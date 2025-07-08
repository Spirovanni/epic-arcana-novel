# World Map Page (`src/app/features/world-map/page.tsx`)

## Overview

The `WorldMapPage` component is the main entry point for the interactive world map feature of the Epic Arcana Novel application. It provides a visual representation of locations within the fictional world of Laurasia, allowing users to explore different places, view detailed information, and understand how chapters of the novel are connected to specific geographical points across various timelines.

## Features

*   **Interactive World Map Display**: Renders a map where key locations are marked and interactive.
*   **Location Details Modal**: When a location is clicked, a modal appears displaying comprehensive information about that location, including its description, lore, notable features, and linked arcana.
*   **Timeline Filtering**: Users can switch between "Alpha", "Beta", and "Gamma" timelines. This feature is intended to show how the world and its events evolve or differ across parallel realities or historical periods within the novel's narrative.
*   **Chapter Sidebar**: A toggleable sidebar that displays chapters associated with the currently selected location, filtered by the active timeline. This helps users contextualize story events within the geographical setting.
*   **Loading and Error States**: Provides visual feedback during data loading and displays an informative error message if locations fail to load.
*   **Animations**: Utilizes `framer-motion` for smooth transitions and animations, enhancing the user experience.
*   **Component-Based Structure**: Integrates several sub-components (`InteractiveWorldMap`, `LocationDetailModal`, `MapControls`, `ChapterSidebar`) to manage different aspects of the map interface.

## Functionality

1.  **Data Loading**:
    *   On initial load, the component attempts to load location data.
    *   Currently, location data is hardcoded within the `loadLocations` function for demonstration purposes.
    *   It also extracts SVG regions from an external source (presumably an SVG map file) to link locations to specific areas on the map.
    *   Mock chapters and coordinates are generated for each location to simulate real data.
2.  **State Management**:
    *   Manages the list of `locations`, the `selectedLocation`, the `activeTimeline`, and the visibility of the `ChapterSidebar`.
    *   `isLoading` state controls the display of loading and error messages.
3.  **User Interaction Handling**:
    *   `handleLocationClick`: Updates the `selectedLocation` state when a location marker on the map is clicked, triggering the `LocationDetailModal`.
    *   `handleTimelineChange`: Updates the `activeTimeline` state, which then influences the data displayed in the `ChapterSidebar` and potentially the map itself.
    *   `toggleChapterSidebar`: Controls the visibility of the `ChapterSidebar`.

## Suggestions for Improvement

1.  **Dynamic Data Fetching**:
    *   **Priority**: High.
    *   Replace the hardcoded `locationsData` and `generateMockChapters` with actual API calls to fetch data from the backend (e.g., `/api/locations`, `/api/chapters`). This will make the map dynamic and reflect the true state of the novel's lore.
    *   Consider implementing data caching strategies to improve performance for frequently accessed data.
2.  **SVG Map Integration and Interactivity**:
    *   **Priority**: High.
    *   Ensure the `InteractiveWorldMap` component properly renders a detailed SVG map of Laurasia.
    *   Implement interactive features for the SVG map itself, such as:
        *   Highlighting `svgRegionId` areas when their corresponding locations are selected or hovered over.
        *   Allowing clicks directly on SVG regions to select locations.
        *   Zooming and panning functionality for better exploration.
3.  **Timeline Impact on Map**:
    *   **Priority**: Medium.
    *   Currently, the `activeTimeline` primarily filters chapters. Extend its functionality to visually alter the map or the displayed locations based on the selected timeline (e.g., showing/hiding locations that only exist in certain timelines, changing map features).
4.  **Search and Filtering**:
    *   **Priority**: Medium.
    *   Add a search bar or filter options within the `MapControls` to allow users to quickly find specific locations by name or type.
5.  **Performance Optimization**:
    *   **Priority**: Medium (for large datasets).
    *   If the number of locations grows significantly, investigate techniques like map clustering for markers or virtualized lists for the chapter sidebar to maintain smooth performance.
6.  **Accessibility (A11y)**:
    *   **Priority**: Medium.
    *   Ensure all interactive elements (buttons, map markers, modal) are fully accessible via keyboard navigation.
    *   Provide appropriate ARIA attributes for screen readers.
7.  **Testing**:
    *   **Priority**: High.
    *   Implement unit tests for the `WorldMapPage` component and its sub-components, focusing on state management, data loading, and user interaction handlers.
    *   Add integration tests to ensure the components work together as expected.
8.  **User Experience Enhancements**:
    *   **Priority**: Low to Medium.
    *   Add tooltips on hover for map markers to show location names.
    *   Implement a legend for any visual cues used on the map (e.g., different marker colors for location types).
    *   Consider a "reset view" button for the map.
