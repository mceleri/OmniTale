import type { Story } from '../types/story';

export const initialStories: Story[] = [
  {
    id: 'eldoria',
    type: 'template',
    title: 'The Whispers of Eldoria',
    genre: 'Fantasy',
    synopsis: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    dynamicState: {
      characterSheet: 'Name: Evelyn of Eldoria\nClass: Ranger / Scout\n\nEquipment:\n- Recurve Bow of Elm\n- Leather Jerkin\n- Silver Elven Pendant\n- Ranger\'s Survival Kit',
      lorebook: `## Eldoria Ruins\nOnce a grand temple sanctuary of the Sun Elves, now swallowed by the Whispering Woods. It is said a rift in the weave of magic lies deep in its heart.\n\n## The Violet Beacon\nA crystalline pillar at the center of the ruins. It has glowed with a soft, pulsing light since the Great Eclipse, drawing travelers close.`,
      masterJournal: '// Master AI Notes - Eldoria Adventure\n// Act 1: The Gates of Eldoria\n- Player has arrived at the exterior gate.\n- Theme: Eldritch fantasy, ancient secrets.\n- Key Encounter: Crystalline Guardian at the inner courtyard.\n- Lore hint: The violet light is feeding on nearby life force.',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'sector7',
    type: 'template',
    title: 'Sector 7: Neon Drift',
    genre: 'Cyberpunk',
    synopsis: 'Rain pours over the towering neon monoliths of Sector 7. As a rogue decker, you hold a datachip that megacorporations would burn cities to retrieve.',
    dynamicState: {
      characterSheet: 'Name: Kaelen Vex\nRole: Rogue Decker\nCreds: 1,450\n\nAugmentations:\n- Neuro-Link V4 (Neural Jack)\n- Synthetic Cyber-Eye (Thermal/IR)\n- Subdermal Armor Plate\n\nGear:\n- Arasaka Custom Cyberdeck\n- Monomolecular Dagger\n- Silenced heavy pistol (9mm)',
      lorebook: `## Sector 7 Underbelly\nThe low-life district of Neo-Tokyo. Sprawling slums shaded by massive corporate towers of Shin-Megacorp. Law enforcement is highly corrupt.\n\n## The Red Chip\nAn encrypted, military-grade storage medium recovered from a downed high-security courier. Rumored to hold files on "Project Lazarus".`,
      masterJournal: '// Master AI Notes - Sector 7 Cyberpunk\n// Act 1: The Safehouse Siege\n- Player is currently hiding in a capsule hotel room.\n- Corporate agents are scanning the grid for the chip\'s local signature.\n- Next Beat: A local fixer named \'Blue\' offers help, but she might be a double agent.',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'deepice',
    type: 'template',
    title: 'The Deep Ice',
    genre: 'Sci-Fi',
    synopsis: 'On Europa\'s frozen ocean, your mining outpost drilled deeper than ever before. Yesterday, the drill stopped. Today, something started tapping back.',
    dynamicState: {
      characterSheet: 'Name: Dr. Isaac Clarke\nRole: Lead Xenogeologist\nSanity: 78%\n\nEquipment:\n- Thermal Hardsuit\n- Industrial Plasma Cutter\n- Handheld Spectrometer',
      lorebook: `## Outpost Boreas\nThe deep-crust drilling station established by United Space Alliance on Europa. Hovering 4 kilometers below the ice sheet over a pitch-black abyss.`,
      masterJournal: '// Master AI Notes - The Deep Ice\n// Act 1: The Silent Shaft\n- Mood: Intense claustrophobia, isolation, slow dread.\n- Primary hazard: Freezing temperatures, power outages.\n- Entity behavior: Communicates through acoustic vibrations.',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'tariald-chronicles',
    type: 'template',
    title: 'Tariald Chronicles',
    genre: 'Dark Fantasy',
    synopsis: 'In the wealthy and ancient city of Tariald, the Great Portal brings endless riches. You are Zor, a low-ranking mage from the distant empire of Osys, working grueling shifts at the portal. But beneath your arcane duties lies a deadly secret: a demon trapped within your mind.',
    dynamicState: {
      characterSheet: 'Name: Zor\nRole: Low-Ranking Osys Mage\nAffinity: Demonic Magic (Forbidden in Tariald)\n\nTraits:\n- The Curse of Osys: Harbors a bound demon within his conscience. Constant struggle for control.\n- Manipulative and cunning; successfully deceives Tariald Academy officials.\n\nKey Allies:\n- Valerius (Osys Supervisor, silent accomplice)\n\nEquipment:\n- Reagent Containers (Reinforced glass, lead-lined with consecrated salt)\n- Standard Osys robes',
      lorebook: `## Tariald & Surroundings\nAn ancient city governed by a Council of guilds and nobles. To the North lie perilous lava fields and "Outposts" mining volatile minerals; West are rich mines; East, an immense ancient forest; South, trade routes to other kingdoms.\n\n## Magic & The Curse of Osys\nMagic alters its user. Demonic magic and necromancy are strictly forbidden in Tariald. However, all Mages of Osys secretly harbor a trapped demon within their minds (The Curse of Osys). They draw immense power from it, but face execution by their own specialized guards if they lose control. Clashes with demonic entities leave residue like sulfur and skin sparks, which Osys mages cunningly use as a cover for their forbidden arts.\n\n## The Great Portal\nA massive gateway maintained by the Tariald Academy with the "generous" help of the Osys enclave. It brings immense wealth through instant trade. With great effort, it can expel magical anomalies into interdimensional limbo.\n\n## Notable Entities & Dangers\n- **Forest Entity:** An ancient, dark being seeking human hosts, feared even by the Osys demons.\n- **Obsidian Fragment:** An interdimensional anchor radiating absolute cold. Touching it marks the soul, emitting a black vapor and psionic resonance.\n- **Academy Inquisitors:** Ruthless Tariald officials seeking forbidden magic traces, capable of forced conscience extraction.`,
      masterJournal: '// Master AI Notes - Tariald Chronicles\n// Act 1: The Portal\'s Secret\n- Player (Zor) is ending a grueling shift at the Great Portal.\n- Tension: Hiding the internal demon from Tariald\'s ruthless Academy Inquisitors.\n- Plot Hook: Supervisor Valerius suspects Zor\'s true potential and might cover for him when a strange anomaly (possibly the Obsidian Fragment) appears at the portal.',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'blackout',
    type: 'template',
    title: 'Blackout',
    genre: 'Psychological Thriller',
    synopsis: 'You wake up in a luxury penthouse at night, with absolutely no memory of who you are or how you got there. No name, no date, no past.',
    dynamicState: {
      characterSheet: 'Name: [Player Choice / Undiscovered]\nRole: [Undiscovered]\nCondition: Complete declarative amnesia. Procedural memory intact.\n\nInventory / Immediate Surroundings:\n- High-quality tailored clothing\n- Wall safe (combination remembered purely via muscle memory)\n- Inside safe: Large amount of cash, passport (first identity clue), photograph with a second person whose face is blacked out with a marker.\n- Dead cell phone. Once charged: "M. - do not come tonight, it is dangerous" (sent yesterday).',
      lorebook: `## The Setting\nA contemporary, unnamed Western metropolis. Vertical skyline, financial district, stark separation between luxury and working-class neighborhoods. Frequent rain, neon reflections, constant traffic.\n\n## The Penthouse\nTop floor, private elevator, numeric keypad. Minimalist, expensive, impersonal. A dark, unidentified stain on the entrance rug, partially hidden by a smaller rug. No signs of forced entry.\n\n## NPC Compartmentalization Rule\n**Crucial:** NPCs ONLY know the info in their sections. They do NOT communicate off-screen. If presented with new info, they react with realistic surprise, suspicion, or denial.\n\n## NPCs\n**Avery Quinn (Personal Assistant):** Knows your professional schedule (last 2 weeks). Knows you canceled a major meeting 3 days ago and were unusually nervous. Eager to please, might invent plausible details out of job insecurity.\n**Marsh Calloway (Old Friend):** Knows vague past details. Knows you asked for a discreet cash loan 3 days ago. Warm, but shows subtle non-verbal inconsistencies.\n**Detective Renata Boyle (Police):** Investigating an anonymous noise/altercation complaint from the penthouse tonight. Dry, procedural. Needs a warrant to see your safe or phone.\n**Dana Voss (Hostile Figure):** Believes you wronged her (e.g., broken trust, failed deal). Cold, uses social leverage. Genuinely believes she is right.\n**Walter Briggs (Doorman):** Knows entry/exit logs. Reports an unidentified person asked for you tonight but left before being announced. Respectful, reserved, speaks only when asked.`,
      masterJournal: '// Master AI Notes - Blackout\n// STRICT RULE: Choose ONE Hidden Truth below at the start of the game and NEVER deviate. NPCs only know their specific fragments.\n// Truth A (Victim): Protagonist discovered something compromising, was drugged/robbed of memories to be kept quiet.\n// Truth B (Culprit): Protagonist did something terrible last night; amnesia is self-induced dissociative trauma. The clues are consequences of their own actions.\n// Truth C (Tool): Protagonist was used as a pawn/frontman for months. Started asking questions, so the handlers wiped their recent memory.\n// \n// Act 1: The Awakening\n- Never impose a name or appearance until the player discovers it (passport) or defines it.\n- Reveal only ONE concrete clue per scene. Let the player drive the pacing.\n- Keep track of what has been revealed to each NPC to maintain strict compartmentalization.',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'echoes-of-the-void',
    type: 'template',
    title: 'Echoes of the Void',
    genre: 'Sci-Fi / Space Opera',
    synopsis: "Humanity has scattered across a thousand frontier colonies in the Sector, while ancient alien threats have splintered into feral swarms and hostile factions. You are Lyra, one of the last survivors of the elite 'Ghost' program. Gifted with psionic powers and a refractive stealth suit that renders you invisible, you wander the stars haunted by voices in your mind and a moral compass that drives you to protect the weak... even if it constantly gets you into trouble.",
    dynamicState: {
      characterSheet: `Name: Lyra
Role: Ex-Elite Special Agent ("Ghost")
Psychic Condition: Constant psionic echoes (hears voices from the void)

Powers & Implants:
- Psionic Cloaking: Tactical optical-refraction stealth suit (rechargeable battery)
- Psionic Aptitude: Latent telepathy, short-range premonition, amplified sensory awareness

Equipment:
- "Solaria" High-Output Impulse Sniper Rifle (Solar-recharged, extreme range)
- Conventional Kinetic Sidearm
- Monocrystalline Combat Blade
- Lightweight Tactical Infiltration Under-suit
- Emergency Medikit & Field Rations`,
      lorebook: `## The Frontier Sector
A lawless sprawl of star systems once united under rigid galactic empires, now reduced to a shifting mosaic of dusty mining colonies, outlaw outposts, and ruthless corporate mercenary syndicates.

## Feral & Shattered Alien Threats
The massive insectoid swarms and zealot psionic alien crusaders of the past have fractured. Now, feral sub-swarms, rogue bio-forms, and fanatic alien splinter groups roam the shipping lanes, preying on remote human settlements.

## The Ghost Program
A defunct, highly classified black-budget military program that engineered lethal operatives through cybernetic enhancement and forced psychic awakening. Officially disbanded, the few surviving Ghosts are either hunted fugitives or solitary mercenaries, plagued by the severe neural side-effects of their conditioning.

## Voices of the Void
A haunting byproduct of Lyra's psionic conditioning. She perceives psychic ripples, emotional residues of the living and the dead, or even the alien hive-mind's leftover murmurs. Discerning reality from hallucinatory echoes in high-stress environments is a constant struggle.`,
      masterJournal: `// AI Master Notes — Echoes of the Void
// Act 1: Fire on the Frontier

[CORE CONFLICT POINTS FOR THE DM]
1. THE MERCENARY EXTORTION:
- A ruthless corporate security force ("Vanguard Syndicate") is extorting a local, defenseless mining settlement on a desolate desert planet.
- Tension: If Lyra steps in to defend the miners, she must expose her high-tech gear and psionic abilities, which will alert the mercenary scouts and reveal her location to active bounty hunters searching for rogue Ghosts.

2. THE FERAL SWARM OUTBREAK:
- Beneath the colony's metallic scrap heaps, a dormant nest of ravenous, insectoid carapaced predators ("Chitin Crawlers") has awakened, hungry and aggressive.
- Tension: The local sheriff is planning a suicidal descent into the nest to save trapped children. Lyra can support from the shadows using her Solaria rifle, but the echoes of the hive-mind will flood her head, risking a psychic overload or hallucinations at a critical moment.

3. THE SPLINTERED CRUSADER'S RELIC:
- A rogue, fanatic alien warrior is hunting a powerful psionic relic buried near the town's water supply. The relic's frequency is amplifying Lyra's "voices," making them loud and painful, but also giving her flashes of future events.
- Tension: The alien views humans as contaminants. Lyra can try to communicate telepathically with this alien, but doing so could burn out her neural pathways or reveal her mind to the wider hive-mind remaining in the sector.

4. THE CORRUPT COLONY LEADER:
- The mayor of the settlement is secretly working with the Vanguard Syndicate, planning to sell out the local workers in exchange for passage off-world.
- Tension: A child miner has stolen a datapad containing proof of this betrayal and has fled to the desert wastes. Lyra is the only one who can navigate the sandstorms to track them before the corporate death squads do.

[TONE & ATMOSPHERE]
- Gritty space western, isolation, deep psychological burden, high-stakes tactical combat, and the overwhelming, haunting whisper of the void.`
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  }
];
