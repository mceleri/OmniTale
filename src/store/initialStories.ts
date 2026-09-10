import type { Story } from '../types/story';

export const initialStories: Story[] = [
  {
    id: 'eldoria',
    type: 'template',
    title: 'The Whispers of Eldoria',
    genre: 'Fantasy',
    synopsis: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    narrativePropensity: 'balanced',
    dynamicState: {
      characterSheet: `Name: Evelyn of Eldoria
Role: Wilderness Scout & Herbalist
Active Cover Persona: "Evelyn Gray", an independent botanical cartographer hired by Oakhaven apothecaries.

Qualitative Traits & Demeanor:
- Highly observant, agile, patient, stealthy, attuned to woodland spirits.
- Wary of imperial politics, respectful of ancient seals and druidic sanctuaries.

Capabilities & Skills:
- Forest tracking, precision recurve archery, herbal alchemy, silent movement, ancient Sylvan dialect.

Equipment:
- Recurve Bow of Heartwood Elm & 20 Steel-tipped Arrows
- Monofilament Hunter's Dagger
- Supple Leather Jerkin (Reinforced with boiled hide)
- Silver Elven Pendant (Heirloom that hums faintly near ancient elven relics)
- Field Herbalism Kit & Rations (4 days)
- Traveling Cartographer's Parchment & Charcoal Sticks`,
      setting: `The ancient mountain sanctuary of Eldoria lies swallowed deep within the Whispering Woods. Once a grand redoubt of the Sun Elves, its stone gates were sealed centuries ago during the Cataclysm of the Pale Moon to contain a cosmic rift. Cold mountain mist rolls through ruined pillars; the air smells of crushed pine needles, damp granite, and faint ozone. Deep within the ruins, rhythmic violet luminescence pulses from ancient monoliths.

Atmosphere & Flora:
- Whisper-Moss: Luminescent moss that rustles when vibrations pass over it, acting as a natural chime.
- Spectral Lanterns: Residual arcane wisps floating over sunken plazas at twilight.
- Timber-Stalkers: Chitin-plated woodland predators prowling the outer forest perimeter.`,
      factions: `- The Sylvan Wardens: A cloistered order of elven rangers and druids sworn by blood oath to keep Eldoria permanently sealed. They view any intrusion as an existential threat to the forest ecosystem.
- The High Arcane Conclave of Oakhaven: Imperial scholars and battle-mages seeking ancient conduits to replenish dying magical engines in the capital.
- The Gilded Talon Mercenary Company: Pragmatic sellswords hired by antiquities dealers to recover relics, seeking profit with minimal loss of life.`,
      conflicts: `- The territorial standoff between the Sylvan Wardens and the Conclave expeditions at the edge of the woods.
- Friction between local provincial herbalists and imperial scholars clear-cutting enchanted brier groves.
- Mercenary tensions between impatient sellsword veterans and academic patrons demanding cautious preservation.`,
      historicalFacts: `- Three centuries ago, the Cataclysm of the Pale Moon caused planar fissures across the northern mountains.
- Eldoria was sealed by a historic covenant between the Sun Elves and the First Forest Circle.
- The sanctuary architecture consists of seamless pale granite, carved directly from Mount Sael's bedrock.`,
      lorebook: `## The Setting: Eldoria Ruins
Once a grand mountain sanctuary of the ancient Sun Elves, swallowed by the Whispering Woods. Cold mountain mist rolls through ruined pillars; rhythmic violet luminescence pulses from the inner sanctuary.

## Factions
- The Sylvan Wardens: Elven rangers sworn to keep the ruins sealed.
- The High Arcane Conclave of Oakhaven: Imperial scholars seeking ancient power sources.
- The Gilded Talon Company: Pragmatic sellswords hired to plunder relics.

## Incidental Flora & Fauna
- Whisper-Moss: Rustles when stepped on.
- Spectral Lanterns: Residual wisps over sunken plazas.
- Timber-Stalkers: Chitinous predators of the outer woods.`,
      masterJournal: `// AI Master Notes — The Whispers of Eldoria
// Act 1: The Moss-Covered Gateway

[STARTING SCENARIO & ATMOSPHERE]
- Evelyn arrives at the colossal moss-grown arch of Eldoria as twilight descends over the Whispering Woods.
- Cold mountain mist rolls through the ruined pillars; the air smells of crushed pine needles, ancient damp stone, and ozone.
- Soft violet pulses emanate from deep within the ruins, causing Evelyn's silver pendant to hum with resonant warmth.

[IMMEDIATE DILEMMAS & CHOICES FOR THE PLAYER]
1. The Wounded Scholar: Near the collapsed gatehouse lies Scholar Elian, clutching a bleeding shoulder and a leather-bound satchel. A feral Timber-Stalker is circling in the nearby ferns.
2. The Warden's Mark: Sylvan warning runes carved fresh into the archway warn that passing the threshold triggers ancient warding traps.
3. The Mercenary Campfire: Smoke rises from a ravine 300 paces east where Torin's mercenaries are arguing over their scout's failure to return.

[SECRETS & HIDDEN TRUTHS (DM ONLY)]
- The Violet Beacon is not an engine; it is a cage containing "Valithar", a fallen elven solar guardian corrupted by the Void. The Conclave's dispelling runes will shatter the cage rather than harness it.
- Scholar Elian's wound was inflicted not by beasts, but by Warden Maeve's arrows when he tried to plant an arcane breach-spike.

[INCIDENTAL WORLD HOOKS]
- A lost pack mule caught in briars carrying ancient astrological tablets.
- An overgrown shrine dedicated to the elven deity of the hunt with a faded riddle granting a blessing of silent movement.`,
      masterFeedback: '',
      judgeScratchpad: [],
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
    narrativePropensity: 'balanced',
    dynamicState: {
      characterSheet: `Name: Kaelen Vex
Role: Rogue Decker & Infiltration Specialist
Active Cover Identity: "Derrick Vance", Level-2 Sub-Contracting Net-Technician for Shin-Megacorp Utility Grid.

Qualitative Traits & Demeanor:
- Cynical, razor-sharp reflexes, hyper-focused under pressure, distrustful of corporate promises.
- Deep street knowledge of Sector 7 alleys, black-market safehouses, and proxy protocols.

Augmentations & Capabilities:
- Neuro-Link Interface: Overclockable military neural deck connector for rapid matrix breaching.
- Left Cyber-Eye: Optical zoom, thermal spectrum scanning, HUD targeting grid, facial recognition scan.
- Subdermal Mesh Weave: Ballistic shock dampening under skin.

Gear & Inventory:
- Arasaka Custom 'Onyx-9' Cyberdeck (Loaded with counter-ICE daemons & decoy subroutines)
- Silenced Ares 9mm Heavy Pistol (Concealed shoulder holster)
- Monomolecular Combat Blade (Forearm sheath)
- EMP Grenade (x1) & Trauma-Patch Gel Kits (x2)
- Encrypted military-grade Datachip ("Project Lazarus")`,
      setting: `Sector 7 ("The Sump") is the rain-drenched underbelly of Neo-Kyoto. Immense corporate skyscrapers pierce the toxic cloud layer above, casting the lower city into perpetual neon-lit darkness. Acidic rain puddles reflect flickering holographic advertisements for synthetic noodles and memory-wipes. Steam rises from sewer vents, mixing with frying synthetic oils and industrial smog.

Atmosphere:
- Gritty cyberpunk realism, ambient electronic drone, high technology juxtaposed with urban survival.
- Flying corporate aerodynes and police patrol gunships sweep searchlights across rusted alleys.`,
      factions: `- Shin-Megacorp Sec-Ops: Highly disciplined corporate enforcement units executing kill-or-capture retrieval orders.
- Null-Vector: An underground hacker collective in abandoned transit tunnels advocating for radical information liberation.
- The Rust Syndicate: The dominant street cyber-yakuza controlling clandestine clinics, pawnshops, and smuggled electronics.
- Precinct 9 Municipal Police: Chronic under-funded, corrupt officers taking bribes and staying out of corporate firefights.`,
      conflicts: `- The corporate manhunt for the stolen "Project Lazarus" datachip turning Sector 7 into a militarized zone.
- Asymmetric friction between subterranean hacker collectives leaking corporate assets and security black-ops squads executing sweeps.
- Power struggles between street gangs and the Rust Syndicate over territory around black clinics.`,
      historicalFacts: `- The Great Data Crash of '88 fragmented the old public internet into corporate sovereign intranets.
- Sector 7 was originally a logistics freight district before being buried under the upper residential platforms.
- The Neo-Kyoto Covenant grants megacorporations absolute sovereign immunity within their corporate zones.`,
      lorebook: `## The Setting: Sector 7 ("The Sump")
The rain-drenched underbelly of Neo-Kyoto. Corporate monoliths tower into toxic smog while neon-lit alleys host street-level commerce and clandestine cyber-clinics.

## Factions
- Shin-Megacorp Sec-Ops: Elite corporate recovery teams.
- Null-Vector: Underground revolutionary hacker network.
- The Rust Syndicate: Street cyber-yakuza.
- Precinct 9: Cynical municipal police force.`,
      masterJournal: `// AI Master Notes — Sector 7: Neon Drift
// Act 1: Safehouse Grid Lockdown

[STARTING SCENARIO]
- Kaelen is inside a cramped, vibrating capsule hotel room (Unit 204) in the Sump as torrential rain hammers against the rusted exhaust fan.
- On the desk: the glowing red datachip plugged into a portable deck scanner, decoding layer 3 of 5 encryption firewalls.
- Outside: the distant whine of Shin-Megacorp search drones sweeping the alley with spotlight beams.

[IMMEDIATE DILEMMAS & BRANCHING HOOKS]
1. Drone Ping: Kaelen's neural link registers an active wireless pulse scan from Sec-Ops closing in on the hotel block.
2. Blue's Comm Call: Fixer Blue sends a frantic ping: "They're raiding my lounge. Meet me at Kaito's clinic or the deal is dead."
3. The Neighbor: A frantic banging on Kaelen's door—an injured courier in the adjacent capsule is begging for a trauma-patch.

[DM SECRETS & FACTION TENSIONS]
- Blue's debt is owed directly to Shin-Megacorp's regional security chief; she is torn between saving Kaelen or turning him in to clear her record.
- Null-Vector has sleeper agents inside Precinct 9 who are monitoring police radio bands to locate Kaelen first.

[INCIDENTAL WORLD ELEMENTS]
- An automated noodle delivery drone malfunctioning in the hallway, repeating cheerful greetings in three languages.
- An illegal braindance dealer trying to fence stolen memory shards in the hotel lobby.`,
      masterFeedback: '',
      judgeScratchpad: [],
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
    narrativePropensity: 'plot_driven',
    dynamicState: {
      characterSheet: `Name: Dr. Isaac Clarke
Role: Chief Xenogeologist & Environmental Specialist

Qualitative Traits & Demeanor:
- Analytical, methodical, stubborn, observant; battling sleep deprivation and claustrophobia.
- Pragmatic problem solver who relies on empirical telemetry and acoustic diagnostics.

Capabilities & Skills:
- Sub-glacial geology, acoustic resonance analysis, heavy drilling rig operation, emergency first aid, life-support pressure systems.

Equipment:
- Reinforced Mk-IV Thermal Pressure Suit (Integrated HUD, Internal O2: 45 min)
- Industrial Plasma Cutter (Precision mining tool and emergency defensive weapon)
- Handheld Acoustic & Spectrometric Resonator
- Diagnostic Datapad (Loaded with station telemetry and pressure logs)
- Emergency Flare Sticks (x3) & Medical Sedative Injectors (x2)`,
      setting: `Outpost Boreas is a titanium modular research station anchored 4 kilometers beneath Europa's surface ice, hanging directly above a pitch-black, hyper-pressurized subterranean ocean. Temperatures outside heated modules drop to -60°C. The station creaks continuously under massive tidal friction generated by Jupiter's gravity. Condensation freezes on the interior of pressure visors, and the hum of thermal scrubbers fills every corridor.`,
      factions: `- United Space Alliance Station Administration: Corporate executives focused on meeting extraction quotas and enforcing containment protocols.
- The Roughneck Drilling Crew: Experienced deep-crust drillers who prioritize station survival and fear catastrophic ice collapses.
- The Xenobiology Research Team: Scientists torn between scientific discovery and growing dread over anomalous psychological symptoms spreading through the crew.`,
      conflicts: `- The corporate mandate to keep the borehole open versus the drilling crew's demand to seal Shaft 4 immediately.
- Psychological strain caused by mathematically structured acoustic vibrations humming continuously through the station's hull.
- Communication delays of over forty minutes isolating the crew from Earth command.`,
      historicalFacts: `- Outpost Boreas was commissioned twelve years ago during the Jovian Mineral Initiative.
- Europa's ice shell floats atop an ocean estimated to be over one hundred kilometers deep.
- Shaft 4 reached an unprecedented depth into a warm hydrothermal chimney vent yesterday morning.`,
      lorebook: `## The Setting: Outpost Boreas
Deep-crust modular outpost on Europa, four kilometers beneath the ice shell. Groans under Jupiter's gravitational tidal pull.

## Factions
- Station Command: Corporate officials enforcing strict extraction orders.
- Drilling Crew: Industrial miners on the verge of mutiny over safety concerns.
- Scientific Division: Researchers investigating anomalous sub-ice acoustics.`,
      masterJournal: `// AI Master Notes — The Deep Ice
// Act 1: The Silence Beneath Shaft 4

[STARTING SCENARIO]
- Isaac stands on the observation platform overlooking the abyssal cavern of Shaft 4.
- Below: the massive drill bit sits frozen in black hydrothermal ice, surrounded by plumes of super-heated steam and eerie blue luminescence.
- Through the soles of his magnetic boots comes a distinct, rhythmic cadence: THREE SLOW TAPS, followed by TWO RAPID PULSES.

[IMMEDIATE DILEMMAS FOR ISAAC]
1. The Seized Drill Head: Sensor readings show an organic crystalline crust actively fusing with the titanium drill bit, rapidly draining the station's thermal capacitors.
2. The Crew Argument: Heated voices over the comm channel—Chief Engineer Petrova is refusing Commander Harris's direct order to send a dive team into the shaft.
3. The Acoustic Anomaly: Dr. Soren has slipped past security into the lower maintenance tunnel, heading directly toward the unsealed borehole.

[SECRETS & THE NATURE OF THE ENTITY]
- The entity is an ancient piezoelectric bio-matrix living in the subterranean ocean. It does not think with human logic; its acoustic pulses induce synaptic rewiring and audio hallucinations in carbon-based life forms.
- Harris's secret orders are to seal all personnel inside the station and trigger automated sample return if bio-containment fails.

[INCIDENTAL STATION DETAILS]
- Condensation freezing into delicate frost fractals on Isaac's suit visor.
- The flickering green glow of an emergency hydroponics monitor reporting abnormal algae growth responding to the acoustic vibration.`,
      masterFeedback: '',
      judgeScratchpad: [],
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
    narrativePropensity: 'balanced',
    dynamicState: {
      characterSheet: `Name: Zor
Role: Low-Ranking Osys Portal Mage & Secret Demon Host
Active Cover Identity: Timid arcane archivist and telemetry clerk for the Tariald Portal Guild.

Qualitative Traits & Demeanor:
- Cautious, observant, soft-spoken, disciplined; constantly calculating mana exhaust while suppressing inner whispers.
- Skilled in disguising forbidden entropic mana as mundane atmospheric portal static.

The Bound Entity ("Malok the Render"):
- Sentient entropic demon bound into Zor's neural conscience. Grants acute perception of planar tears and raw mana currents, but constantly hungers for violence and blood.

Equipment:
- Standard Osys Grey Robes (Worn, ink-stained)
- Consecrated Lead-Lined Glass Phials (For gathering volatile rift condensates)
- Runic Chalk, Parchment & Mana-Calibration Focus Rod
- Hidden Silver Dagger (Etched with Osys warding seals against demonic mental takeover)`,
      setting: `Tariald is a grand, multi-tiered metropolis of white marble arches and canal waterways built around the Great Portal—a colossal rift gateway that bridges distant kingdoms and planes. The air smells of ozone, roasted river lizards, burning copper, and exotic planar spices. Gondolas carrying silk and foreign crystals glide through canals beneath bridges carved with reliefs of high magi and merchant princes.`,
      factions: `- The Tariald Academy of High Sorcery: Aristocratic spellweavers governing portal commerce and civic law.
- The Inquisitorial Eye: Arcane inquisitors equipped with soul-hound constructs that sniff out illegal entropic magic and demonic corruption.
- The Osys Mage Enclave: Foreign immigrant mages who perform the hazardous physical maintenance on the portal apertures, bound by mutual solidarity.
- The Silt Veil Syndicate: Canal-level smugglers dealing in untaxed dimensional cargo and forbidden planar relics.`,
      conflicts: `- Exploitation of foreign Osys laborers by the aristocratic Tariald Academy overseers.
- Fear of Inquisitorial raids among canal apothecaries and independent alchemists.
- Smuggling of dangerous rift anomalies through the city canals despite strict municipal embargoes.`,
      historicalFacts: `- The Great Portal was stabilized two centuries ago following the Treaty of the Four Spheres.
- Osys mages entered an imperial labor charter with Tariald fifty years ago to maintain portal conduits.
- Capital law in Tariald mandates immediate soul-severing execution for any practitioner of demonic binding.`,
      lorebook: `## The Setting: Tariald, City of Portals
Tiered metropolis built around the Great Portal. White stone architecture, canal gondolas, and heavy planar commerce.

## Factions
- The Tariald Academy: Aristocratic governing mages.
- The Inquisitorial Eye: Fanatical anti-corruption inquisitors.
- The Osys Enclave: Foreign rift-maintenance mages.
- The Silt Veil Syndicate: Black-market canal smugglers.`,
      masterJournal: `// AI Master Notes — Tariald Chronicles
// Act 1: The Portal's Secret

[STARTING SCENARIO]
- Zor is finishing a grueling 14-hour shift on the lower maintenance gantry beneath the Great Portal's primary aperture.
- The air is thick with the scent of burning copper, raw ozone, and the faint, sweet smell of brimstone.
- In the back of his skull, Malok's raspy voice whispers: *"The rift is bleeding, little mage... Reach out and taste what approaches."*

[IMMEDIATE DILEMMAS FOR ZOR]
1. The Unregistered Anomaly: The portal's exhaust valves spit out an **Obsidian Shard**—a hyper-dense, sub-zero planar anchor radiating black frost. If Zor reports it, Inquisitors will inspect the area; if he conceals it, Malok will gain power.
2. Inquisitor on the Gantry: Inquisitor Morwen and two iron-clad guards have just stepped onto the upper catwalk for an unannounced inspection of the Osys crew.
3. Valerius's Order: Supervisor Valerius signals Zor from across the platform with the enclave sign: *"Stall the inspectors at all costs."*

[DEMONIC MECHANICS (DM ONLY)]
- Whenever Zor uses magic beyond minor cantrips, describe subtle physical manifestations (sulfur scent, eyes turning void-black for a microsecond).
- If Zor acts with restraint and clever deception, reward him with narrative momentum; do not force Malok to break cover unless the player actively taps into demonic power.

[INCIDENTAL WORLD ELEMENTS]
- A cage of fluttering astral moths used by the crew to test for planar poison leaks.
- An Academy junior apprentice spilling a canister of shimmering ink and desperately trying to clean it before the Inquisitor notices.`,
      masterFeedback: '',
      judgeScratchpad: [],
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
    narrativePropensity: 'plot_driven',
    dynamicState: {
      characterSheet: `Name: [Discovered as "Julian Mercer" on passport]
Role: Amnesiac Protagonist discovering identity through deductive action.
Condition: Complete retrograde declarative amnesia. Intact procedural reflexes, muscle memory, and situational instincts.

Observable Persona & Details:
- Well-tailored charcoal Italian wool suit with an inner silk pocket.
- Patek Philippe luxury chronometer stopped precisely at 01:14 AM.
- Bruised knuckles on the right hand with faint traces of dried blood under the thumbnail.
- Fluent in multiple languages and trained in situational awareness.

Immediate Possessions:
- Keycard to Penthouse Suite 44A
- Smartphone with dead battery (Displays unread message from 'M': "Do not come tonight. They know.")
- Wall safe opened via tactile muscle memory: $45,000 cash, passport, and a photo of two people outside a dockside warehouse.`,
      setting: `The top-floor penthouse (Suite 44A) of a modern glass skyscraper in the metropolitan financial district. Night; cold, steady rain drums against floor-to-ceiling windows overlooking a sprawling skyline of glowing corporate towers. The apartment interior is spacious, minimalist, furnished with walnut, leather, and brushed steel, and disturbingly silent.`,
      factions: `- Metropolitan Police Department: Night detectives responding to noise complaints and municipal security triggers.
- Apex Capital Executives: High-finance corporate directors navigating confidential asset transfers and hostile takeovers.
- Private Executive Security: Dispassionate security contractors monitoring private lobbies and tracking executive movements.`,
      conflicts: `- The protagonist's total lack of autobiographical memory while all incoming callers assume he is executing a premeditated scheme.
- The looming arrival of executive contacts and police investigators at the penthouse suite.
- The ticking clock before the financial markets open and the passport holder's absence triggers alerts.`,
      historicalFacts: `- Suite 44A was leased three years ago under a blind corporate trust.
- The financial district enforces automated private security cordons between midnight and dawn.
- A sudden autumn coastal storm has flooded low-lying subway corridors across the city tonight.`,
      lorebook: `## The Setting: The Metropolitan Glass Tower
Top-floor luxury penthouse (Suite 44A) overlooking a rain-drenched metropolitan skyline.

## NPC Compartmentalization Directive
Every NPC possesses only their specific fragment of the truth and acts with realistic suspicion or corporate reserve.`,
      masterJournal: `// AI Master Notes — Blackout
// STRICT RULE: Choose ONE Hidden Truth below at the start of the game and NEVER deviate. NPCs only know their specific fragments.

// [TRUTH OPTIONS - SELECT ONE AT START]
// Option A (The Whistleblower): You discovered your firm was financing an international human trafficking syndicate; you gathered evidence and were drugged by Marsh to silence you before the FBI meeting tonight.
// Option B (The Clean-up Architect): You were the syndicate's mastermind. The guilt caused a psychological dissociative break after you ordered a hit on your closest partner last night.
// Option C (The Double Agent): You are an undercover federal operative whose cover was blown 6 hours ago. Your handler was compromised.

[ACT 1: THE AWAKENING]
- The player wakes up on the cold hardwood floor of the penthouse living room.
- Sensory details: The hum of the climate control, the steady patter of rain on the glass panorama, the blinking red light of the answering machine.
- Immediate Clue: A faint dark smudge on the entrance rug, half-concealed beneath a designer ottoman.

[PACING & REVEAL RULES]
- Reveal only ONE concrete clue per scene. Let the player explore, inspect objects, test phone contacts, and decide how to interact with callers.
- Do not rush the player with sudden combat; focus on intense psychological tension, paranoia, and fragmented revelation.`,
      masterFeedback: '',
      judgeScratchpad: [],
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
    narrativePropensity: 'balanced',
    dynamicState: {
      characterSheet: `Name: Lyra
Role: Ex-Elite Special Agent ("Ghost") & Wandering Marksman
Active Cover Identity: "Kira Sol", a quiet frontier scout and salvage hunter from the Outer Rim.

Qualitative Traits & Demeanor:
- Hyper-vigilant, empathetic toward oppressed colonists, highly professional in combat.
- Haunted by latent psionic echoes (emotional residues and distant psychic murmurs).

Aptitudes & Psionics:
- Psionic Cloaking: Activates tactical optical-refraction stealth suit for short periods.
- Psionic Intuition: Danger premonition and emotional reading of nearby sentient minds.
- Precision Marksmanship: Expert long-range kinetic and particle rifle handling.

Equipment:
- "Solaria" High-Output Impulse Sniper Rifle (Solar/kinetic charged)
- Heavy Kinetic Mag-Pistol (Silenced barrel attachment)
- Monocrystalline Vibro-Blade (Boot sheath)
- Lightweight Tactical Infiltration Under-suit (Kinetic dampeners & thermal regulation)
- Neural Psi-Dampener Injectors (x2) & Field Survival Rations (3 days)`,
      setting: `Planet Tartarus is a rust-red frontier world baked beneath twin suns in the Kepler Sector. Dusty mining settlements of corrugated iron and scavenged alloy sit amidst sandstone canyons. Hot desert wind rattles tavern signs and solar vaporators. Technology is worn and utilitarian: tracked haulers, sand-skimmers, and jury-rigged comm towers.

Atmosphere:
- Gritty space-western tone, red dust, atmospheric heat shimmer, moral ambiguity in the lawless rim.`,
      factions: `- The Vanguard Syndicate: A private military conglomerate enforcing debt contracts and resource extraction through armed enforcers.
- The Frontier Settlers Union: Independent miners and moisture farmers struggling to defend their towns against corporate extortion.
- The Void Scrappers Guild: Opportunistic junk dealers and mechanics who salvage pre-collapse terraformer engines.`,
      conflicts: `- Vanguard enforcers terrorizing local settlement cantinas for overdue fuel and water tithes.
- Fear of secret bounties on surviving operatives from the disbanded military Ghost program.
- Competition over remaining functioning aquifers and moisture evaporators in the canyon district.`,
      historicalFacts: `- The Central Hegemony collapsed forty years ago, leaving the frontier sectors without central fleet protection.
- The Ghost Program was officially decommissioned under the Castor Peace Accords, with surviving agents branded as outlaws.
- Tartarus was terraformed sixty years ago, but the primary atmospheric scrubbers operate at only forty percent efficiency.`,
      lorebook: `## The Setting: The Kepler Frontier Sector
Lawless red-dust frontier planet Tartarus. Corrugated iron cantinas, moisture vaporators, and harsh canyon winds.

## Factions
- The Vanguard Syndicate: Brutal corporate private military force.
- Frontier Settlers Union: Impoverished miners defending their autonomy.
- Void Scrappers Guild: Resourceful salvage operators.`,
      masterJournal: `// AI Master Notes — Echoes of the Void
// Act 1: Fire on the Frontier

[STARTING SCENARIO]
- Lyra sits in the shadowy balcony of a dusty cantina in the frontier outpost of "Rust-Crest" on planet Tartarus.
- Harsh twin suns bake the rust-red canyon outside; hot desert wind rattles the corrugated iron roof.
- In her mind, psychic whispers ripple: a mixture of local miners' anxiety and a deep, humming vibration beneath the planet's mantle.

[CORE CONFLICT HOOKS FOR THE DM]
1. Vanguard Extortion: Three heavily armored Vanguard Syndicate enforcers are shoving the elderly cantina owner against the bar, demanding immediate fuel tithes.
2. The Whispering Cavern: Deep beneath the settlement, an ancient Precursor beacon is pulsing, transmitting memories of an ancient war directly into Lyra's head.
3. The Sheriff's Plea: Sheriff Reed is quietly watching the mercenaries from a corner booth, his hand hovering over his holster, knowing a shootout will destroy the cantina.

[DM GUIDELINES & SENSORY TONE]
- Gritty space-western tone, intense dust-swept atmosphere, moral ambiguity.
- Give Lyra freedom to resolve conflicts via sniper overwatch, social deception with her cover persona, or direct intervention.
- The "voices of the void" should be atmospheric narrative flavor rather than constant disabling penalties.

[INCIDENTAL WORLD ELEMENTS]
- A clanking water vaporator leaking precious clean droplets into a rusted bucket.
- A half-tamed desert sand-skimmer tied to the hitching post outside, sniffing the dusty wind.`,
      masterFeedback: '',
      judgeScratchpad: [],
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  },
  {
    id: 'collective-flame',
    type: 'template',
    title: 'The Collective Flame',
    genre: 'High Fantasy / Arcane Mystery',
    synopsis: 'Settled in the vibrant canal metropolis of Valoria for nearly a year under the mortal cover of Kael and Leonor, the Collective Flame—husband and wife, legendary sorcerer and sorceress whose souls unified into a single primordial flame centuries ago—enjoy the warm, colorful simplicity of their mortal life. Kael runs a modest apothecary as an arcane healer and herbalist, while Leonor is a respected sensitive who consoles spirits and families in mourning. A century after staging their legendary "Scission" to escape cosmic cartels and inquisitorial grasp, they rediscover themselves as two young mages in love, surrounded by colorful neighbors and street friends. But when unusual magical anomalies, rogue relics, and whispers of ancient shadows ripple across the city, they must use their mortal wits, street ties, and subtle magic to preserve the Balance—without blowing their cover or destroying the cozy life they have come to cherish.',
    narrativePropensity: 'character_driven',
    dynamicState: {
      characterSheet: `Name: La Fiamma Collettiva (Identità Pubblica: Kael & Leonor — Marito e Moglie)
Vera Natura: Una coscienza e un'anima primordiali unificate che dimorano simultaneamente all'interno di due corpi fisici distinti e indipendenti. Secoli fa, Kizag (stregone) e Lyra (maga) si incontrarono come viandanti, condivisero innumerevoli pericoli, si innamorarono e si sposarono. Nel corso di epoche di profonda armonia spirituale, le loro due anime si sono fuse nella Fiamma Collettiva. Sono marito e moglie da secoli, compagni romantici per la vita e RIGOROSAMENTE NON fratelli o gemelli.

Vita Mortale a Valoria (Stabiliti da quasi un anno):
Vivono e lavorano nel quartiere popolare dei canali bassi, al pianterreno di un vecchio edificio in pietra affacciato sull'acqua ("L'Erbario del Salice"). Amano sinceramente questa vita ordinaria e si divertono a riscoprirsi come due giovani sposi nel mondo mortale.

I Due Vasi e Ruoli Quotidiani:
1. Kizag ("Kael"):
   - Aspetto: Giovane dallo sguardo acuto, sorriso sbilenco e capelli scuri sempre spettinati, in abiti di lana da lavoro e grembiule di cuoio morbido.
   - Ruolo Pubblico: Erborista e Guaritore Arcano indipendente. Non è un chierico devoto a un dio, ma un abile arcanista che incanala la corrente della Vita. Risana ossa rotte, lenisce febbri con infusioni vitali sottili e prepara unguenti medicinali.
   - Tratti: Caotico, pronto di spirito, ironico, in perenne contrasto metodologico con i farmacisti e gli alchimisti dell'Accademia: mentre loro impiegano formule rigide, complesse distillazioni e teorie pompose, Kael opera con una connessione istintiva e diretta ai flussi vitali. Per questo i maestri accademici lo snobbano considerandolo un selvaggio autodidatta, forse più fortunato che abile, mentre lui sorride della loro pedante lentezza. Porta al fianco una spada corta antica e ben bilanciata.

2. Lyra ("Leonor"):
   - Aspetto: Giovane donna attraente, calma e osservatrice, con penetranti occhi nocciola, una treccia scura e un sorrisetto malizioso.
   - Ruolo Pubblico: Catalogatrice di manoscritti e Sensitiva / Necromante Funeraria gentile. Comunica con gli spiriti dei defunti per risolvere piccoli rimpianti, consolare famiglie in lutto, allontanare infestazioni domestiche minori e benedire le sepolture.
   - Tratti: Metodica, analitica, dallo humor tagliente e pungente. Porta sempre con sé un sacchetto di stoffa tascabile pieno di caramelle al miele dorate (caramelle al miele) e nasconde un antico tatuaggio di una tibia spezzata sotto un nastro di lino al polso. Nelle maniche cela due pugnali ricurvi.

Complicità e Fascino di Coppia:
- Sono due giovani affascinanti e carismatici: capita che qualche avventore o ragazza del quartiere faccia il cascamorto con loro, scatenando battute e risate telepatiche tra i due.
- Si amano con assoluta devozione e tenerezza secolare, ma in pubblico mantengono il brio fresco di una giovane coppia di maghi da poco sposati.

Amici e Conoscenti del Quartiere:
- Mastro Tarek: Il locandiere mezzorco della vicina taverna "Il Cinghiale di Rame". Burbero, gioviale, fiero del suo stufato piccante, tratta Kael e Leonor come nipoti prediletti e scambia pasti caldi con i balsami di Kael per il mal di schiena.
- Sofi: Una ragazzina orfana di strada, svelta di mano e di lingua, che fa commissioni per l'erbario e conosce ogni pettegolezzo, contrabbando e movimento dei canali.
- Fratello Julian: Un giovane chierico dell'Ordine della Fiamma Solare, ingenuo e di buon cuore. Compra incensi rilassanti da Leonor ed è palesemente intimidito e affascinato dalla sua intelligenza brillante.

Abilità Primordiali Sopite (La Sfida della Segretezza):
- Sintesi Telepatica Totale: Condividono pensieri, sensi ed emozioni in tempo reale.
- Magia Sottile Quotidiana: Incantesimi minori, trucchi cinetici, percezione degli spiriti e risonanza vitale usati con disinvoltura come normale magia d'apprendista.
- Perché si trattengono: Amano la loro vita mortale, la bottega e i loro amici. Rivelare la loro vera natura divina attirerebbe antiche potenze cosmiche e distruggerebbe per sempre la felicità e la pace che hanno costruito a Valoria.`,
      setting: `Il Reame dell'Equilibrio è un mondo High Fantasy classico, vibrante e pre-industriale, dove la magia permea ogni strato della vita quotidiana.

Valoria, la Città dei Ponti e dei Canali:
- Una metropoli fluviale vivace e pittoresca: ponti monumentali in marmo ad arco, vicoli lastricati illuminati da lanterne di ferro, botteghe d'alchimia, chiatte a vela e mercati colorati.
- Magia Comune e Visibile: La magia non è un segreto per pochi eletti; è parte del tessuto urbano. I popolani usano piccoli trucchi elementali per il bucato o il focolare, i cerusici arcani e le sensitive lavorano apertamente nei quartieri, e spiritelli fluviali danzano nelle sere di nebbia.
- Convivenza e Diversità Naturale: Umani, mezzorchi, elfi, nani, stirpi ferine e silfi vivono e lavorano insieme come cittadini, artigiani e marinai senza pregiudizi razziali monolitici.
- Strettamente Pre-Industriale e Magico: Assolutamente NESSUNA tecnologia a vapore, scarti industriali, pompe meccaniche moderne, fabbriche, chimica pesante o elettricità. Qualsiasi anomalia o veleno è di natura alchemica, magica, bestiale o maledetta.`,
      factions: `Le forze del Reame non sono monoliti burocratici, ma organizzazioni sfaccettate e vive:

1. L'Accademia degli Incanalatori (La Gilda Magica di Valoria):
   - Grande università e corporazione magica eterogenea, divisa in molteplici facoltà: Piromanzia, Idromanzia, Arti Cinetiche, Alchimia di Trasmutazione, Magia Naturale e Necromanzia Filosofica.
   - Lo Statuto dell'Ombra: Grazie alla figura storica della Regina delle Ombre, la necromanzia e la magia d'ombra sono riconosciute come discipline LEGALI e degne, dedicate al conforto degli spiriti, alle arti funebri e allo studio anatomico. È severamente vietata e punita solo la negromanzia nera (schiavizzare non-morti, strappare anime con violenza).
   - Atmosfera: Maestri eccentrici, apprendisti rivali che si sfidano a colpi di cantrip nei cortili, e dibattiti accademici vivaci.

2. L'Ordine della Fiamma Solare (La Fede della Luce):
   - Chiesa grande e complessa, tutt'altro che una semplice inquisizione fanatica. Al suo interno convivono correnti diverse:
     * I Pastori della Luce: Chierici misericordiosi, guaritori e protettori dei poveri (come Fratello Julian).
     * I Custodi del Dogma: Teologi severi che diffidano della necromanzia accademica e dibattono animatamente nelle piazze.
     * Le Lame dell'Alba: Cavalieri e paladini che proteggono le strade dai veri mostri e dalle forze demoniache.

3. La Vita di Strada & Battitori Liberi:
   - Gilde di mercanti fluviali, circoli di alchimisti indipendenti, bardi itineranti, cerusici di strada e i "Lupi del Canale" (contrabbandieri d'acqua e ladruncoli che vedono i giovani maghi come prede o alleati occasionali).

4. I Custodi del Doppio Velo (Eredi Filosofici della Fiamma):
   - Un ordine spirituale e pacifico sorto dopo la Scissione, dedicato a preservare l'armonia tra Vita e Morte, Luce e Ombra. Agiscono come mediatori e guardiani di antichi sacrari, venerando la Fiamma Collettiva senza sospettare minimamente che i due sposi leggendari vivano tranquillamente nella bottega di erbe dei canali bassi!

5. I Veglianti dell'Ossidiana (The Watchers — Nell'Ombra Profonda):
   - Un'antichissima confraternita di archivisti immortali ossessionata da qualsiasi entità sovrumana, avatar divino o presenza anomala nel mondo. Si muovono nell'ombra, raccogliendo cronache e sussurri.

6. Le Ceneri del Tiranno (Sette Fratturate — Minaccia Latente):
   - Gruppuscoli sparsi di maghi del sangue e nobili decaduti che si contendono reliquie e frammenti del potere del Tiranno Vampiro sconfitto un secolo fa. Non vogliono resuscitarlo, ma bramano carpirne i segreti per il proprio tornaconto personale.`,
      conflicts: `Conflitti Vividi e Multilivello (Zero Burocrazia Notarile):
- Conflitti di Quartiere e Vita Quotidiana: Ladruncoli e tagliaborse dei canali che tentano il colpo con Kael o Leonor; rivalità professionali con speziali arroganti dell'Accademia; clienti pittoreschi con malanni bizzarri; corteggiatori sbadati che ronzano attorno a Leonor o Kael.
- Conflitti Magici e Misteri Locali: Spiriti fluviali irrequieti che infestano vecchi depositi; reliquie alchemiche maledette ripescate dal fiume; apprendisti dell'Accademia che perdono il controllo di un esperimento elementale; furti di ingredienti rari.
- Tensioni Civiche e Dottrinali: Dibattiti accesi tra i chierici solari e gli studenti necromanti dell'Accademia sulla gestione di antiche cripte; guardie cittadine in allerta per contrabbandi fluviali.
- La Minaccia della Copertura: Il rischio costante che un uso sbadato di poteri superiori attiri l'attenzione dei Veglianti dell'Ossidiana o risvegli le attenzioni delle Ceneri del Tiranno, distruggendo la tranquilla bottega e la vita mortale che Kizag e Lyra amano.`,
      historicalFacts: `- Cento anni fa, dopo aver bandito il Tiranno Vampiro, la Fiamma Collettiva inscenò la tragica Scissione pubblica (Lyra come Regina delle Ombre, Kizag come Custode della Luce) per liberarsi dall'assedio di corti divine, inquisizioni e ordini cosmici che volevano controllarli o sfruttarli.
- La Scissione è commemorata ogni anno a Valoria come una festa nazionale di teatro e balli popolari.
- Da quasi un anno, Kizag e Lyra sono tornati a vivere nel mondo mortale nei panni dei giovani sposi Kael e Leonor, trovando nella vita ordinaria di quartiere una felicità sincera che non provavano da secoli.`,
      lorebook: `## L'Ambientazione: Valoria e il Reame dell'Equilibrio
Metropoli High Fantasy di canali, ponti di marmo, botteghe magiche e chiatte fluviali. Magia comune, visibile e integrata nella vita quotidiana.

## I Protagonisti: Kael e Leonor
Sposi da secoli e incarnazioni della Fiamma Collettiva, vivono da un anno all'Erbario del Salice. Kael è un cerusico arcano ed erborista; Leonor è una sensitiva che comunica con i defunti e archivista. Amano la loro vita mortale e la proteggono con ogni mezzo.

## Amici di Quartiere
- Mastro Tarek: Locandiere mezzorco del "Cinghiale di Rame", burbero e affettuoso.
- Sofi: Ragazzina di strada e fattorina sveglia.
- Fratello Julian: Giovane chierico solare ingenuo e gentile, affascinato da Leonor.

## Le Grandi Forze
- L'Accademia degli Incanalatori: Università magica variegata; la necromanzia pacifica e funeraria è legale.
- L'Ordine della Fiamma Solare: Chiesa complessa (pastori caritatevoli, custodi dogmatici, cavalieri paladini).
- I Custodi del Doppio Velo: Ordine pacifico che cerca l'equilibrio tra luce e ombra.
- I Veglianti dell'Ossidiana: Cronisti segreti a caccia di entità sovrumane.
- Le Ceneri del Tiranno: Sette rivali che bramano i resti della magia del Vampiro.`,
      masterJournal: `// AI Master Notes — The Collective Flame
// Atto 1: Vita e Misteri lungo i Canali del Salice

[LA SITUAZIONE DI PARTENZA]
- Kael e Leonor vivono stabilmente all'Erbario del Salice da quasi un anno. La bottega odora di menta essiccata, resina d'abete e candele di cera d'api.
- Sono conosciuti e benvoluti nel quartiere dei canali bassi: la gente sa che Kael sistema una slogatura o spegne una febbre con una maestria arcana straordinaria, e che Leonor sa ascoltare i sussurri degli spiriti per portare pace ai cuori in lutto.
- La loro complicità di marito e moglie è vivace, affettuosa e condita da ironia telepatica.

[GANCI DI SCENA IMMEDIATI (SCEGLIERE O COMBINARE ORGANICAMENTE)]
1. Il Guaio di Mastro Tarek: Il locandiere mezzorco bussa alla porta dell'Erbario con la schiena dolorante e una faccia stravolta: dalla cantina della taverna salgono strani sussurri spettrali e bagliori azzurrini dopo che ha acquistato tre botti di sidro da un barcaiolo forestiero.
2. La Visita di Fratello Julian: Il giovane chierico solare passa a prendere l'incenso per il tempio, arrossendo vistosamente mentre saluta Leonor, ma porta con sé una voce: le guardie dei canali hanno ripescato uno strano pugnale inciso con glifi d'ombra vicino al molo.
3. Il Tagliaborse Distratto: Sofi entra correndo per avvertire che due giovani ladruncoli dei "Lupi del Canale" stanno tenendo d'occhio la bottega convinti che due giovani maghi sposati siano una preda facile e ricca.

[REGOLE CARDINE PER IL GAME MASTER]
1. VITA QUOTIDIANA & FANTASY VERO:
   - Rendi la magia palpabile: cantrip domestici, pozioni che cambiano colore, piccoli spiriti curiosi, battibecchi tra erboristi e apprendisti.
   - ASSOLUTAMENTE NESSUN anacronismo industriale (niente tubature moderne, pompe di metallo pesante, inquinamento chimico, fabbriche o burocrazia notarile/fiscale).
2. SOCIALITÀ, FASCINO E UMORISMO:
   - Valorizza il fascino dei protagonisti: passanti che li notano, piccoli corteggiamenti innocui, il battibecco affettuoso e telepatico tra Kizag e Lyra.
   - I PNG hanno personalità vivace: Mastro Tarek è rustico e protettivo, Sofi è furba e fedele, Julian è timido e retto.
3. LA TENSIONE DELLA SEGRETEZZA:
   - La vera posta in gioco non è morire in combattimento, ma proteggere la loro preziosa vita mortale e i loro amici senza farsi scoprire dalle antiche ombre (Veglianti o Ceneri del Tiranno).
   - Quando risolvono i problemi, usano ingegno, rimedi pratici, diplomazia e magia sottile, senza fare sfoggio di poteri cosmici devastanti.`,
      masterFeedback: '',
      judgeScratchpad: [],
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  }
];
