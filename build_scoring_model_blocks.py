#!/usr/bin/env python3
"""
Build and normalize scoring_model blocks for all personality profiles.

This script loads personality profiles and outline data, ensuring each profile
has a complete scoring_model object with all required keys in the correct order.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


# ============================================================================
# Helper Functions
# ============================================================================


def build_outline_index(outline_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """
    Recursively walk outline_data and index all nodes with id,
    specific_task_group_title, and all_chapter fields.

    Returns a dictionary mapping id -> full node.
    """
    index: Dict[str, Dict[str, Any]] = {}

    def walk(obj: Any) -> None:
        if isinstance(obj, dict):
            # Check if this object looks like a Specific Task Group node
            if ("id" in obj and
                "specific_task_group_title" in obj and
                "all_chapter" in obj):
                index[obj["id"]] = obj

            # Recursively walk all values
            for value in obj.values():
                walk(value)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)

    walk(outline_data)
    return index


def get_basic_context(
    profile: Dict[str, Any],
    outline_ctx: Optional[Dict[str, Any]]
) -> Tuple[str, str, str]:
    """
    Extract display_name, theme, and focus_area from profile and outline context.

    Returns (display_name, theme, focus_area).
    """
    display_name = (
        profile.get("display_name") or
        profile.get("specific_task_group_title") or
        profile.get("chapter_title") or
        "this pattern"
    )

    theme = (
        profile.get("theme") or
        profile.get("chapter_theme") or
        (outline_ctx.get("specific_task_group_title") if outline_ctx else None) or
        "your core theme"
    )

    focus_area = (
        profile.get("focus_area") or
        (outline_ctx.get("focus_area") if outline_ctx else None) or
        "your current growth edge"
    )

    return display_name, theme, focus_area


def generate_daily_prompt(
    profile: Dict[str, Any],
    outline_ctx: Optional[Dict[str, Any]]
) -> str:
    """
    Generate a daily_prompt if not already present.
    """
    # Prefer existing daily_prompt
    if "daily_prompt" in profile and profile["daily_prompt"]:
        return profile["daily_prompt"]

    # Otherwise, generate one
    display_name, theme, focus_area = get_basic_context(profile, outline_ctx)

    return (
        f"Today, where in your life are you most feeling the theme of \"{theme}\" "
        f"as the {display_name}? What is one small action that would move you "
        f"a step forward in {focus_area.lower()}?"
    )


def generate_practices(
    profile: Dict[str, Any],
    outline_ctx: Optional[Dict[str, Any]]
) -> List[str]:
    """
    Generate or retrieve practices for the profile.
    """
    # Prefer existing practices
    if "practices" in profile and profile["practices"]:
        return profile["practices"]

    # Fallback to development_practices
    if "development_practices" in profile and profile["development_practices"]:
        return profile["development_practices"]

    # Generate from growth_focus traits if available
    traits = profile.get("traits", {})
    growth_focus = traits.get("growth_focus", [])

    if growth_focus:
        return [f"Turn into practice: {item}" for item in growth_focus[:5]]

    # Generate default practices
    display_name, theme, focus_area = get_basic_context(profile, outline_ctx)

    return [
        f"Identify one situation today where you can act in line with your {display_name} theme of '{theme}'.",
        f"Take a small, concrete step that supports {focus_area.lower()}.",
        "Spend five minutes reflecting on what felt aligned and what felt off.",
        f"Notice how your {display_name} strengths show up in ordinary moments.",
        "Ask someone you trust how they see you embodying your theme."
    ]


def generate_transformation_indicators(
    profile: Dict[str, Any],
    outline_ctx: Optional[Dict[str, Any]]
) -> List[str]:
    """
    Generate or retrieve transformation indicators for the profile.
    """
    # Prefer existing transformation_indicators
    if "transformation_indicators" in profile and profile["transformation_indicators"]:
        return profile["transformation_indicators"]

    # Generate from strengths and context
    traits = profile.get("traits", {})
    strengths = traits.get("strengths", [])

    display_name, theme, focus_area = get_basic_context(profile, outline_ctx)

    indicators = []

    # Add indicators based on strengths (first 3)
    if strengths:
        for strength in strengths[:3]:
            indicators.append(
                f"Your '{strength}' shows up more consistently, even under stress."
            )

    # Add theme-based indicators
    indicators.extend([
        f"Situations that once felt overwhelming now look like places to practice "
        f"your {display_name} theme of '{theme}'.",

        f"You make more decisions that support {focus_area.lower()} "
        f"rather than old autopilot reactions.",

        "Others describe you as more steady, intentional, and aligned with what you say matters.",
    ])

    return indicators


def derive_top_signal_items(
    scoring_model: Dict[str, Any],
    signals_map: Optional[Dict[str, Any]],
    profile: Dict[str, Any]
) -> List[str]:
    """
    Derive top_signal_items from scoring_model, signals_map, or profile context.
    """
    # If scoring_model already has top_signal_items, use that
    if "top_signal_items" in scoring_model and scoring_model["top_signal_items"]:
        return scoring_model["top_signal_items"]

    # If signals_map exists, take its first 8 keys
    if signals_map:
        return list(signals_map.keys())[:8]

    # Synthesize IDs based on all_chapter
    all_chapter = profile.get("all_chapter")
    if all_chapter:
        return [f"Q{all_chapter}{i:02d}" for i in range(1, 9)]

    # Fallback
    return []


def generate_signals_map_from_traits(
    profile: Dict[str, Any],
    top_signal_items: List[str]
) -> Dict[str, Dict[str, Any]]:
    """
    Generate signals_map from traits and top_signal_items.
    """
    dim_cycle = [
        "agency",
        "conscientiousness",
        "stability",
        "adaptability",
        "empathy",
        "orderliness",
        "risk_tolerance",
        "abstract_reasoning",
    ]

    display_name, theme, focus_area = get_basic_context(profile, None)
    traits = profile.get("traits", {})
    strengths = traits.get("strengths", [])
    shadow = traits.get("shadow", [])

    signals_map = {}

    for idx, item_id in enumerate(top_signal_items):
        dim = dim_cycle[idx % len(dim_cycle)]

        # First 6 items are positive (polarity 1)
        if idx < 6:
            polarity = 1
            if idx < len(strengths):
                content = f"{strengths[idx]} as it relates to {theme.lower()}"
            else:
                content = f"Demonstrating {dim} in line with {display_name} values"
        else:
            # Remaining items are warning signals (polarity -1)
            polarity = -1
            if (idx - 6) < len(shadow):
                content = f"When stressed: {shadow[idx - 6]}"
            else:
                content = f"When stressed or misaligned, struggles with {dim}"

        signals_map[item_id] = {
            "dimension": dim,
            "polarity": polarity,
            "content": content
        }

    return signals_map


def update_scoring_models(
    profiles_data: Dict[str, Any],
    outline_index: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Traverse all personality profiles and update their scoring_model blocks.
    """
    profile_count = 0
    updated_count = 0

    # Iterate through families and personalities
    for family_key, family_data in profiles_data.get("families", {}).items():
        personalities = family_data.get("personalities", {})

        for profile_key, profile in personalities.items():
            profile_count += 1

            # Get outline context if available
            canonical_id = profile.get("canonical_id")
            outline_ctx = outline_index.get(canonical_id) if canonical_id else None

            # Get or initialize scoring_model
            scoring_model = profile.get("scoring_model", {})

            # ================================================================
            # Step 1: Preserve or initialize core fields
            # ================================================================

            dimensions = scoring_model.get("dimensions", {})
            match_weights = scoring_model.get("match_weights", {})
            threshold = scoring_model.get("threshold", 0.84)

            # ================================================================
            # Step 2: Handle signals_map
            # ================================================================

            # Prefer scoring_model["signals_map"]
            effective_signals_map = scoring_model.get("signals_map")

            # Fallback to top-level profile["signals_map"]
            if not effective_signals_map and "signals_map" in profile:
                effective_signals_map = profile["signals_map"]

            # ================================================================
            # Step 3: Derive top_signal_items
            # ================================================================

            top_signal_items = derive_top_signal_items(
                scoring_model, effective_signals_map, profile
            )

            # ================================================================
            # Step 4: Generate signals_map if needed
            # ================================================================

            if not effective_signals_map:
                effective_signals_map = generate_signals_map_from_traits(
                    profile, top_signal_items
                )

            # ================================================================
            # Step 5: Handle daily_prompt
            # ================================================================

            daily_prompt = generate_daily_prompt(profile, outline_ctx)

            # ================================================================
            # Step 6: Handle practices
            # ================================================================

            practices = generate_practices(profile, outline_ctx)

            # ================================================================
            # Step 7: Handle transformation_indicators
            # ================================================================

            transformation_indicators = generate_transformation_indicators(
                profile, outline_ctx
            )

            # ================================================================
            # Step 8: Assemble new scoring_model with correct key order
            # ================================================================

            new_scoring_model = {
                "dimensions": dimensions,
                "match_weights": match_weights,
                "threshold": threshold,
                "top_signal_items": top_signal_items,
                "signals_map": effective_signals_map or {},
                "daily_prompt": daily_prompt,
                "practices": practices,
                "transformation_indicators": transformation_indicators,
            }

            # Assign back to profile
            profile["scoring_model"] = new_scoring_model
            updated_count += 1

    return profiles_data


def main(
    profiles_path: str = "data/dist/new_personality_profile.json",
    outline_path: str = "data/l_outline.json",
    output_path: str = "data/dist/new_personality_profile_scored.json",
) -> None:
    """
    Main function to build and normalize scoring_model blocks.

    Supports optional CLI overrides:
        python build_scoring_model_blocks.py [profiles_path] [outline_path] [output_path]
    """
    # Handle CLI arguments
    if len(sys.argv) > 1:
        profiles_path = sys.argv[1]
    if len(sys.argv) > 2:
        outline_path = sys.argv[2]
    if len(sys.argv) > 3:
        output_path = sys.argv[3]

    # Resolve paths
    profiles_file = Path(profiles_path)
    outline_file = Path(outline_path)
    output_file = Path(output_path)

    # Validate input files exist
    if not profiles_file.exists():
        print(f"❌ Error: Profiles file not found: {profiles_file}")
        sys.exit(1)

    if not outline_file.exists():
        print(f"❌ Error: Outline file not found: {outline_file}")
        sys.exit(1)

    print(f"📖 Loading profiles from: {profiles_file}")
    print(f"📖 Loading outline from: {outline_file}")

    # Load JSON files
    with open(profiles_file, "r", encoding="utf-8") as f:
        profiles_data = json.load(f)

    with open(outline_file, "r", encoding="utf-8") as f:
        outline_data = json.load(f)

    # Build outline index
    print("🔍 Building outline index...")
    outline_index = build_outline_index(outline_data)
    print(f"   Found {len(outline_index)} indexed nodes")

    # Update scoring models
    print("🔨 Updating scoring_model blocks...")
    updated_profiles = update_scoring_models(profiles_data, outline_index)

    # Write output file
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(updated_profiles, f, ensure_ascii=False, indent=2)

    print(f"✅ Updated scoring_model blocks written to: {output_file}")


if __name__ == "__main__":
    main()
