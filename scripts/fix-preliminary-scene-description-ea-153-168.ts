import { db } from '../src/lib/db';
import { chapters, scenes } from '../src/lib/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix "preliminary_scene_description" column for EA-153 through EA-168
 * Format: "[Beat/Phase] where [narrative context]—[framework details]. [Development and implications]."
 * Target length: ~250-300 characters like reference chapters
 */

interface SceneFix {
  chapterNumber: number;
  sceneNumber: number;
  preliminarySceneDescription: string;
}

const fixes: SceneFix[] = [
  // EA-153: Creative Idealism
  {
    chapterNumber: 153,
    sceneNumber: 1,
    preliminarySceneDescription: "Action beginning where post-Boon creativity demands new visions—Kelley's Creative Confidence teaching fearless prototyping. Liberating ideas flow freely but surveillance exposes every vision helpfully directing creative choices. Discovers creative confidence exploited when shared. Learns internal visioning protecting imagination from helpful optimization."
  },
  {
    chapterNumber: 153,
    sceneNumber: 2,
    preliminarySceneDescription: "Action deepening where protected imagination seeks deeper access—Cameron's Morning Pages unlocking stream-of-consciousness creativity. Private writing accessing transformative visions but behavioral extraction tracking patterns helpfully suggesting improvements. Discovers written creativity creates predictable patterns. Learns mental creative process protecting from optimization."
  },
  {
    chapterNumber: 153,
    sceneNumber: 3,
    preliminarySceneDescription: "Action completing where transparency inevitably exposes creative process—attempted balance between community learning and solitary protection failing. Discovers transparency inescapably exposing creative patterns for optimization. Learns solitary creativity protecting authentic visions despite accepting community learning sacrifice and loneliness cost."
  },
  {
    chapterNumber: 153,
    sceneNumber: 4,
    preliminarySceneDescription: "Creative journey complete where protected solitude produces genuine authentic visions—accepting isolation price for undistorted creativity. Solitary visions maintaining authenticity worth loneliness. Learns Creative Idealism achieved through protected internal imagination accepting community sacrifice for vision purity maintaining creative sovereignty."
  },

  // EA-154: Op-For Planning (Converge/resolution beat)
  {
    chapterNumber: 154,
    sceneNumber: 1,
    preliminarySceneDescription: "Converge beginning where strategic foresight faces deliberate traps—Kim & Mauborgne's Blue Ocean Strategy creating uncontested space. Blue oceans deliberately left as traps exploiting strategic thinking. Nine of Swords strategic nightmares. Learns blue oceans are bloodbaths accepting competitive terrain for opposition planning."
  },
  {
    chapterNumber: 154,
    sceneNumber: 2,
    preliminarySceneDescription: "Converge deepening where competitive choice gets weaponized—Lafley & Martin's Playing to Win forcing battles on losing terrain. Strategic choice exploited by enemies controlling ground selection. Learns accepting bad ground paradoxically creating unpredictability through choosing to fight where disadvantaged developing opposition strategy."
  },
  {
    chapterNumber: 154,
    sceneNumber: 3,
    preliminarySceneDescription: "Converge advancing where scenario planning creates paralysis—multiple futures analysis enabling perfect countermeasures. Scenario thinking exploited through preparation tracking. Learns incomplete analysis accepting uncertainty choosing decisive action despite scenarios remaining unplanned enabling strategic surprise."
  },
  {
    chapterNumber: 154,
    sceneNumber: 4,
    preliminarySceneDescription: "Converge completing where strategic clarity emerges from rest—sleep enabling decisive opposition planning. Exhausted planning failing but rest revealing strategic insight. Learns strategic sleep necessity accepting planning limits for intuitive clarity enabling opposition thinking transcending systematic analysis."
  },

  // EA-155: Exigency Planning (Flight beat)
  {
    chapterNumber: 155,
    sceneNumber: 1,
    preliminarySceneDescription: "Flight beginning where crisis demands rapid response—McChrystal's Team of Teams creating networked transparent agility. Transparency mapping vulnerabilities enabling simultaneous attacks. Five of Cups spilled trust. Learns distributed coordination accepting opacity for exigency response maintaining operational security."
  },
  {
    chapterNumber: 155,
    sceneNumber: 2,
    preliminarySceneDescription: "Flight deepening where chaos should strengthen systems—Taleb's Antifragile philosophy gaining from disorder. Endless stress exploiting antifragile logic causing burnout. Five of Cups resilience spilled. Learns measured antifragility accepting fragility limits for sustainable crisis capacity preventing exhaustion."
  },
  {
    chapterNumber: 155,
    sceneNumber: 3,
    preliminarySceneDescription: "Flight advancing where unpredictable catastrophes overwhelm—Taleb's Black Swan events defying prediction. Multiple black swans simultaneously deployed creating inundation. Learns accepting unpredictability developing flexible response capacity rather than prediction enabling crisis adaptation."
  },
  {
    chapterNumber: 155,
    sceneNumber: 4,
    preliminarySceneDescription: "Flight completing where capacity limits must be honored—Five of Cups teaching sustainable exigency response. Crisis demands exceeding capacity but five cups remaining representing preserved capability. Learns exigency mastery accepting capacity limits maintaining reserves for sustained crisis navigation."
  },

  // EA-156: Forward Thinking (Battle/set-up beat)
  {
    chapterNumber: 156,
    sceneNumber: 1,
    preliminarySceneDescription: "Battle setup beginning where innovation creates vulnerability—Christensen's Innovator's Dilemma exposing disruption focus. Innovation thinking weaponized abandoning sustaining capabilities. Learns balanced innovation accepting disruption limits maintaining core capabilities enabling strategic flexibility."
  },
  {
    chapterNumber: 156,
    sceneNumber: 2,
    preliminarySceneDescription: "Battle setup deepening where speed demands sacrifice timing—decisive action versus perfect timing trade-off. Speed pressure weaponized forcing premature decisions. Learns accepting imperfect timing choosing decisive action over waiting enabling strategic momentum despite uncertainty."
  },
  {
    chapterNumber: 156,
    sceneNumber: 3,
    preliminarySceneDescription: "Battle setup advancing where complexity obscures path—strategic fog from information overload and conflicting signals. Learns piercing fog accepting ambiguity developing clarity amid complexity enabling forward movement despite uncertainty through focused analysis."
  },
  {
    chapterNumber: 156,
    sceneNumber: 4,
    preliminarySceneDescription: "Battle setup completing where forward thinking integrates paradoxes—backward reflection providing context, slow deliberation enabling depth, ambiguous navigation accepting uncertainty. Knight of Swords balanced mastery. Learns forward thinking paradoxically requires backward looking, slow processing, ambiguous acceptance."
  },

  // EA-157: Inspirational Empathy (Resurrection/Break into Three beat)
  {
    chapterNumber: 157,
    sceneNumber: 1,
    preliminarySceneDescription: "Resurrection beginning where empathy becomes weapon—emotional connection exploited for manipulation and extraction. Empathy tracking enabling targeting. Learns protected empathy accepting boundary necessity maintaining emotional connection while defending against exploitation establishing healthy limits."
  },
  {
    chapterNumber: 157,
    sceneNumber: 2,
    preliminarySceneDescription: "Resurrection deepening where inspiration depletes energy—uplifting others while maintaining personal reserves. Inspirational role creating burnout vulnerability. Learns sustainable inspiration accepting energy limits replenishing self while uplifting others balancing giving with receiving."
  },
  {
    chapterNumber: 157,
    sceneNumber: 3,
    preliminarySceneDescription: "Resurrection advancing where emotional intelligence enables navigation—Goleman's framework developing awareness and regulation skills. Learns emotional intelligence mastery recognizing patterns managing feelings skillfully navigating complex emotional landscapes with conscious awareness."
  },
  {
    chapterNumber: 157,
    sceneNumber: 4,
    preliminarySceneDescription: "Resurrection completing where empty cup enables refill—Queen of Cups teaching self-replenishment. Inspirational empathy achieved through accepting depletion necessity creating space for renewal. Learns climactic emptiness paradoxically enabling fullness through conscious replenishment cycle."
  },

  // EA-158: Self-Reflection (Rescue from Without beat)
  {
    chapterNumber: 158,
    sceneNumber: 1,
    preliminarySceneDescription: "Rescue from Without beginning where silence rescues from noise—withdrawal from external demands enabling internal access. Hermit wisdom through contemplative retreat. Learns silence necessity accepting isolation for self-discovery finding wisdom through quiet contemplation away from action."
  },
  {
    chapterNumber: 158,
    sceneNumber: 2,
    preliminarySceneDescription: "Rescue continuing where internal examination reveals depths—self-inquiry exploring hidden patterns and unconscious motivations. Learns introspection practice accepting discomfort of self-confrontation discovering truth through honest internal examination facing shadow aspects courageously."
  },
  {
    chapterNumber: 158,
    sceneNumber: 3,
    preliminarySceneDescription: "Rescue advancing where external light must be extinguished—lantern releasing enabling inner light discovery. Paradox of finding light through darkness acceptance. Learns inner illumination accessed through outer darkness accepting external guidance release trusting internal wisdom."
  },
  {
    chapterNumber: 158,
    sceneNumber: 4,
    preliminarySceneDescription: "Rescue completing where hermit journey achieves wisdom—Hermit card complete through solitary self-reflection mastery. Learns hermit wisdom achieved through withdrawal, examination, inner light discovery creating foundation for re-emergence transformed through contemplative isolation."
  },

  // EA-159: Stack Wins/Losses (Return with Elixir/Finale beat)
  {
    chapterNumber: 159,
    sceneNumber: 1,
    preliminarySceneDescription: "Finale beginning where incremental progress reveals limits—stacking small wins showing accumulation boundaries. Progress tracking weaponized creating perfectionism paralysis. Learns transcending incremental thinking accepting progress limitations for breakthrough possibility beyond mere accumulation."
  },
  {
    chapterNumber: 159,
    sceneNumber: 2,
    preliminarySceneDescription: "Finale deepening where losses teach growth—accounting defeats as valuable lessons rather than failures. Loss aversion exploited creating risk paralysis. Learns loss acceptance embracing defeats as teachers extracting wisdom from setbacks transforming failure into growth."
  },
  {
    chapterNumber: 159,
    sceneNumber: 3,
    preliminarySceneDescription: "Finale advancing where mastery becomes monotonous—Eight of Disks showing skill repetition without meaning. Achievement repetition creating emptiness despite competence. Learns transcending mastery finding meaning beyond achievement accepting accomplishment limits seeking purpose over perfection."
  },
  {
    chapterNumber: 159,
    sceneNumber: 4,
    preliminarySceneDescription: "Finale completing where scattered wins reveal pattern—diverse small victories creating comprehensive capability mosaic. Eight Disks scattered showing distributed mastery. Learns integration of diverse wins accepting varied small successes creating complete capability through breadth."
  },

  // EA-160: Foresight (Master of Two Worlds beat)
  {
    chapterNumber: 160,
    sceneNumber: 1,
    preliminarySceneDescription: "Master of Two Worlds beginning where foresight capacity develops—anticipating future patterns and possibilities through strategic vision. Learns predictive thinking foundation recognizing patterns projecting futures developing foresight capability enabling proactive strategic positioning."
  },
  {
    chapterNumber: 160,
    sceneNumber: 2,
    preliminarySceneDescription: "Master continuing where prediction balances intuition and analysis—refining foresight through dual-process integration. Learns foresight refinement combining gut feeling with systematic projection creating robust predictions balancing instinct with reason."
  },
  {
    chapterNumber: 160,
    sceneNumber: 3,
    preliminarySceneDescription: "Master advancing where foresight accuracy gets tested—learning from prediction successes and failures improving capability. Learns foresight calibration accepting prediction errors refining accuracy through feedback cycles developing mature predictive judgment."
  },
  {
    chapterNumber: 160,
    sceneNumber: 4,
    preliminarySceneDescription: "Master completing where future vision integrates into strategy—foresight enabling strategic decision-making across timeframes. Learns foresight mastery integrating prediction into action creating strategic advantage through temporal vision spanning present and future."
  },

  // EA-161: Readiness (Ordinary World/Opening Image beat)
  {
    chapterNumber: 161,
    sceneNumber: 1,
    preliminarySceneDescription: "Ordinary World beginning where readiness foundation establishes—systematic preparation for challenges ahead developing capability base. Learns readiness establishment accepting preparation necessity building skills, resources, knowledge creating foundation for action."
  },
  {
    chapterNumber: 161,
    sceneNumber: 2,
    preliminarySceneDescription: "Ordinary World continuing where readiness capacity builds—developing skills and gathering resources for mission ahead. Learns capacity development accepting growth requirements expanding capabilities through training and resource accumulation."
  },
  {
    chapterNumber: 161,
    sceneNumber: 3,
    preliminarySceneDescription: "Ordinary World advancing where readiness gets tested—verifying preparedness through assessment and practice validation. Learns readiness verification accepting testing necessity confirming capability through trial and assessment before commitment."
  },
  {
    chapterNumber: 161,
    sceneNumber: 4,
    preliminarySceneDescription: "Ordinary World completing where complete readiness achieved—standing prepared for mission commencement with validated capability. Learns readiness completion accepting preparation sufficiency transitioning from preparation to action beginning quest."
  },

  // EA-162: Confirmation (Call to Adventure/Inciting Incident beat)
  {
    chapterNumber: 162,
    sceneNumber: 1,
    preliminarySceneDescription: "Call to Adventure beginning where confirmation sought—validating calling through external signs and internal conviction alignment. Learns confirmation seeking accepting doubt confronting questioning mission legitimacy requiring validation before commitment."
  },
  {
    chapterNumber: 162,
    sceneNumber: 2,
    preliminarySceneDescription: "Call continuing where confirmation received—discovering evidence supporting mission legitimacy and purpose validity. Learns confirmation discovery accepting signs recognizing validation confirming calling through convergent evidence internal and external."
  },
  {
    chapterNumber: 162,
    sceneNumber: 3,
    preliminarySceneDescription: "Call advancing where confirmation tested—weighing validation against persistent doubt and uncertainty requiring discernment. Learns confirmation testing accepting ambiguity discerning true validation from false signs developing judgment wisdom."
  },
  {
    chapterNumber: 162,
    sceneNumber: 4,
    preliminarySceneDescription: "Call completing where confirmation accepted—committing fully to quest with validated purpose resolving doubt through conviction. Learns confirmation acceptance embracing validated calling transitioning from seeking to committing beginning journey."
  },

  // EA-163: Tumultuous Victory (Ordinary World/Setup beat)
  {
    chapterNumber: 163,
    sceneNumber: 1,
    preliminarySceneDescription: "Ordinary World beginning where hero journey becomes trap—recognizing formula limitations and potential manipulation through predictable patterns. Five of Swords tumultuous victory. Learns escaping hero formula accepting journey complexity beyond prescribed stages."
  },
  {
    chapterNumber: 163,
    sceneNumber: 2,
    preliminarySceneDescription: "Ordinary World continuing where grit reaches exhaustion—persistence limits requiring rest despite pressure to continue. Duckworth's grit weaponized into endless grinding. Learns grit limits accepting rest necessity balancing persistence with recovery."
  },
  {
    chapterNumber: 163,
    sceneNumber: 3,
    preliminarySceneDescription: "Ordinary World advancing where mindset gets manipulated—growth orientation exploited for external control and manipulation. Dweck's growth mindset weaponized. Learns authentic growth maintaining genuine development resisting manipulation despite pressure."
  },
  {
    chapterNumber: 163,
    sceneNumber: 4,
    preliminarySceneDescription: "Ordinary World completing where tumultuous victory achieved—Five of Swords accepting triumph's chaos and complexity. Victory messy ambiguous incomplete. Learns achievement complexity accepting imperfect success embracing chaotic incomplete triumph."
  },

  // EA-164: Resilient Allegiance (Refusal of Call/Catalyst beat)
  {
    chapterNumber: 164,
    sceneNumber: 1,
    preliminarySceneDescription: "Refusal/Catalyst beginning where resilient bonds form—creating allegiances surviving adversity and pressure through commitment depth. Learns alliance building accepting vulnerability creating bonds enduring trials through mutual support."
  },
  {
    chapterNumber: 164,
    sceneNumber: 2,
    preliminarySceneDescription: "Refusal continuing where alliance strength tested—maintaining loyalty through conflict and doubt requiring commitment renewal. Learns allegiance testing accepting strain maintaining bonds despite pressure demonstrating resilience through adversity."
  },
  {
    chapterNumber: 164,
    sceneNumber: 3,
    preliminarySceneDescription: "Refusal advancing where commitment deepens—demonstrating resilient allegiance through action proving bonds through behavior. Learns commitment demonstration accepting action necessity showing allegiance through deeds beyond words."
  },
  {
    chapterNumber: 164,
    sceneNumber: 4,
    preliminarySceneDescription: "Refusal completing where allegiance formation completes—establishing unshakeable bonds despite challenges creating enduring relationships. Learns allegiance completion accepting bonds forged through adversity creating lasting resilient connections."
  },

  // EA-165: Revitalized Hope (Reaction beat)
  {
    chapterNumber: 165,
    sceneNumber: 1,
    preliminarySceneDescription: "Reaction beginning where hope depletion recognized—confronting despair and energy exhaustion requiring renewal acknowledgment. Learns hope scarcity accepting depletion reality recognizing exhaustion necessity for replenishment beginning."
  },
  {
    chapterNumber: 165,
    sceneNumber: 2,
    preliminarySceneDescription: "Reaction continuing where hope sources discovered—finding renewal through connection and meaning creating replenishment pathways. Learns hope discovery accepting renewal sources identifying connection and purpose as hope generators."
  },
  {
    chapterNumber: 165,
    sceneNumber: 3,
    preliminarySceneDescription: "Reaction advancing where revitalized hope cultivated—rebuilding optimism through intentional practice and conscious attention. Learns hope cultivation accepting practice necessity building optimism through deliberate effort and attention."
  },
  {
    chapterNumber: 165,
    sceneNumber: 4,
    preliminarySceneDescription: "Reaction completing where renewed hope embodied—carrying revitalized energy forward into action sustaining momentum. Learns hope embodiment accepting renewal integrating revitalized optimism into ongoing action."
  },

  // EA-166: Blind Beneficence (Call to Adventure beat)
  {
    chapterNumber: 166,
    sceneNumber: 1,
    preliminarySceneDescription: "Call to Adventure beginning where blind generosity discovered—giving without seeing full consequences creating unintended harm. Learns generosity limits accepting helping shadow recognizing good intentions causing damage."
  },
  {
    chapterNumber: 166,
    sceneNumber: 2,
    preliminarySceneDescription: "Call continuing where beneficence limits confronted—recognizing helping's shadow and potential harm from unaware giving. Learns helping boundaries accepting beneficence dangers seeing assistance causing dependence or harm."
  },
  {
    chapterNumber: 166,
    sceneNumber: 3,
    preliminarySceneDescription: "Call advancing where wise giving develops—balancing generosity with awareness and conscious boundaries creating conscious beneficence. Learns wise generosity accepting awareness necessity seeing consequences while maintaining generous spirit."
  },
  {
    chapterNumber: 166,
    sceneNumber: 4,
    preliminarySceneDescription: "Call completing where conscious beneficence mastered—giving with eyes open to impact creating aware generosity. Learns beneficence mastery accepting sight necessity seeing consequences while giving consciously."
  },

  // EA-167: Responsive Grace (Action beat)
  {
    chapterNumber: 167,
    sceneNumber: 1,
    preliminarySceneDescription: "Action beginning where responsive capacity discovered—adapting gracefully to changing circumstances maintaining equilibrium through flexibility. Learns responsiveness foundation accepting change necessity adapting with grace maintaining center."
  },
  {
    chapterNumber: 167,
    sceneNumber: 2,
    preliminarySceneDescription: "Action continuing where grace under pressure cultivated—maintaining poise through adversity demonstrating elegant resilience. Learns grace cultivation accepting pressure maintaining composure through trials demonstrating poised resilience."
  },
  {
    chapterNumber: 167,
    sceneNumber: 3,
    preliminarySceneDescription: "Action advancing where responsiveness integrates—reacting wisely without losing center balancing adaptation with stability. Learns responsive integration accepting flexibility maintaining core while adapting to circumstances."
  },
  {
    chapterNumber: 167,
    sceneNumber: 4,
    preliminarySceneDescription: "Action completing where responsive grace embodied—flowing with change maintaining elegant equilibrium through conscious adaptation. Learns grace mastery accepting change flow adapting consciously while maintaining elegant stability."
  },

  // EA-168: Adaptable Analysis (Consequence beat)
  {
    chapterNumber: 168,
    sceneNumber: 1,
    preliminarySceneDescription: "Consequence phase where analytical limits recognized—systematic thinking vulnerabilities revealed through lattice pursuit adaptation. Francisco's analysis failing against adaptive algorithms. Learns analysis limits accepting systematic thinking boundaries requiring real-time adaptation recognizing analytical vulnerability."
  },
  {
    chapterNumber: 168,
    sceneNumber: 2,
    preliminarySceneDescription: "Consequence complication where adaptive thinking systematized creates new trap—Dalio's open-mindedness expanding options but creating decision paralysis. Learning adaptation but systematizing creates vulnerability. Learns adaptation paradox accepting flexibility without rigidity balancing openness with decisiveness."
  },
  {
    chapterNumber: 168,
    sceneNumber: 3,
    preliminarySceneDescription: "Consequence culmination where strategic agility synthesizes contradictions—Grit Under Shifting Ground integrating persistence with flexibility. Learns mature strategic agility accepting paradox integration maintaining committed flexibility balancing persistence with adaptation achieving sustainable analytical capability."
  }
];

async function updateDatabase() {
  console.log('📊 Updating database...\n');

  let updateCount = 0;
  for (const fix of fixes) {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(eq(chapters.chapterNumber, fix.chapterNumber))
      .limit(1);

    if (!chapter) {
      console.log(`   ⚠️  Chapter ${fix.chapterNumber} not found, skipping`);
      continue;
    }

    const result = await db
      .update(scenes)
      .set({ preliminarySceneDescription: fix.preliminarySceneDescription })
      .where(
        and(
          eq(scenes.chapterId, chapter.id),
          eq(scenes.sceneNumber, fix.sceneNumber)
        )
      )
      .returning();

    if (result.length > 0) {
      console.log(`✅ Ch${fix.chapterNumber}S${fix.sceneNumber}: Updated (${fix.preliminarySceneDescription.length} chars)`);
      updateCount++;
    } else {
      console.log(`   ⚠️  Ch${fix.chapterNumber}S${fix.sceneNumber}: Scene not found`);
    }
  }

  console.log(`\n✅ Database updated! ${updateCount} scenes modified.\n`);
}

function updateOutline() {
  console.log('📝 Updating outline file...\n');

  const outlinePath = path.join(process.cwd(), 'data', 'l_outline.json');
  const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf-8'));

  function findAndUpdateChapter(obj: any, eaId: string, sceneUpdates: Map<number, string>): boolean {
    if (!obj || typeof obj !== 'object') return false;

    if (obj.id === eaId) {
      if (!obj.scenes) {
        console.log(`   ⚠️  ${eaId}: No scenes array`);
        return true;
      }

      console.log(`✅ Found ${eaId}: ${obj.chapter} - ${obj.specific_task_group_title || obj.title}`);
      
      for (const [sceneNum, newValue] of sceneUpdates.entries()) {
        const scene = obj.scenes.find((s: any) => s.scene_number === sceneNum);
        if (scene) {
          scene.preliminarySceneDescription = newValue;
          console.log(`   ✅ Updated Scene ${sceneNum}`);
        } else {
          console.log(`   ⚠️  Scene ${sceneNum} not found`);
        }
      }
      
      return true;
    }

    for (const key of Object.keys(obj)) {
      if (findAndUpdateChapter(obj[key], eaId, sceneUpdates)) {
        return true;
      }
    }
    return false;
  }

  const chapterUpdates = new Map<string, Map<number, string>>();
  
  for (const fix of fixes) {
    const eaId = `EA-${fix.chapterNumber.toString().padStart(3, '0')}`;
    if (!chapterUpdates.has(eaId)) {
      chapterUpdates.set(eaId, new Map());
    }
    chapterUpdates.get(eaId)!.set(fix.sceneNumber, fix.preliminarySceneDescription);
  }

  for (const [eaId, sceneUpdates] of chapterUpdates.entries()) {
    findAndUpdateChapter(outline, eaId, sceneUpdates);
  }

  const backupPath = path.join(process.cwd(), 'data', 'l_outline.backup-prelim-desc-153-168.json');
  fs.writeFileSync(backupPath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`\n💾 Created backup at data/l_outline.backup-prelim-desc-153-168.json`);

  fs.writeFileSync(outlinePath, JSON.stringify(outline, null, 2), 'utf-8');
  console.log(`✅ Updated data/l_outline.json\n`);
}

async function main() {
  console.log('🔧 Fixing "preliminary_scene_description" column for EA-153 through EA-168\n');
  console.log('Expected format: "[Beat/Phase] where [context]—[framework details]. [Development]."\n');
  console.log('Target length: ~250-300 characters\n');

  await updateDatabase();
  updateOutline();

  console.log('✨ All updates complete!\n');
  console.log('Updated chapters:');
  console.log('  EA-153: 4 scenes (enhanced from brief)');
  console.log('  EA-154: 4 scenes (created from NULL)');
  console.log('  EA-155: 4 scenes (created from NULL)');
  console.log('  EA-156: 4 scenes (created from NULL)');
  console.log('  EA-157: 4 scenes (created from NULL)');
  console.log('  EA-158: 4 scenes (created from NULL)');
  console.log('  EA-159: 4 scenes (created from NULL)');
  console.log('  EA-160: 4 scenes (created from NULL)');
  console.log('  EA-161: 4 scenes (created from NULL)');
  console.log('  EA-162: 4 scenes (created from NULL)');
  console.log('  EA-163: 4 scenes (created from NULL)');
  console.log('  EA-164: 4 scenes (created from NULL)');
  console.log('  EA-165: 4 scenes (created from NULL)');
  console.log('  EA-166: 4 scenes (created from NULL)');
  console.log('  EA-167: 4 scenes (created from NULL)');
  console.log('  EA-168: 3 scenes (enhanced from brief)');
  console.log('  Total: 63 scenes\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
