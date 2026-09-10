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
    synopsis: 'After a century of rest in their Extradimensional Haven following their staged public sacrifice, the Collective Flame—a unified primordial consciousness sharing the dual physical vessels of Kizag and Lyra, husband and wife whose souls became inextricably intertwined after centuries of shared adventures and love—returns quietly to the mortal realm. They perceived a faint, subtle flutter in the tapestry of fate: a tiny ripple that, left unchecked over decades, could quietly unravel the Balance of Life. Moving as two humble apprentices, they must navigate a world transformed by the legacy of the Queen of Shadows and the Keeper of Light, empowering worthy mortals to solve their own crises while fiercely guarding their true identity from the ancient factions that once sought to control them.',
    narrativePropensity: 'character_driven',
    dynamicState: {
      characterSheet: `Name: The Collective Flame (Dual Vessels: Kizag & Lyra — Husband & Wife)
Nature: A unified primordial consciousness and soul dwelling simultaneously within two distinct, independent physical bodies. Centuries ago, Kizag (sorcerer) and Lyra (sorceress) met as wanderers, journeyed together across countless perils, fell in love, and married. Over epochs of profound spiritual harmony, their two souls fused into a single primordial entity—the Collective Flame. They are deeply bonded husband and wife, lifelong romantic companions, and STRICTLY NOT brother and sister or twins.
Public Role & Cover: Traveling Apprentice Mages & Provincial Herbalists ("Kael & Leonor")

Physical Vessels & Personality Facets (Husband & Wife):
1. Kizag:
   - Appearance: A sharp-eyed young man with unruly dark hair, dressed in simple traveler's wool and a dark traveling cloak.
   - Resonant Facet: Chaotic, quick-witted, intuitive, prone to spontaneous schemes, sharp humor, and paranoid vigilance.
   - Distinctive Arcane Gift: A formidable healer and restorer of vital currents (curatore formidabile), capable of mending flesh, soothing spirit fatigue, and re-weaving disrupted life flows with subtle precision.
   - Weapon: An ancient-forged, non-magical shortsword of unusual metallurgical craftsmanship worn at his hip.

2. Lyra:
   - Appearance: A calm, observant young woman with piercing hazel eyes and a subtle, mischievous smirk.
   - Resonant Facet: Methodical, analytical, iron-willed, with a playful, slightly wicked and teasing sense of humor.
   - Unique Identifying Mark: A discreet, ancient tattoo of a broken tibia (tibia spezzata) etched on her forearm or ankle.
   - Weapon: A pair of twin curved daggers of exotic, ancient craftsmanship concealed inside her sleeves.
   - Characteristic Item & Trademark: A small wooden pocket pouch filled with golden honey candies (caramelle al miele), which she enjoys savoring or quietly leaving behind as an enigmatic gift.

Shared Primordial Nature & Dormant Abilities:
- Single Unified Mind: Total telepathic synthesis. What one vessel perceives, feels, or learns, the other experiences instantly in real time.
- Dormant Extradimensional Mastery: Deep innate affinity for dimensional seams and their pocket haven (Reggia Meravigliosa), kept quietly dormant to avoid triggering arcane warding circles or inquisitorial scrying rituals.
- Subtle Infusion: Can channel vital kinetic balance into their physical non-magical weapons for swift parries without creating magical flashes.
- Silent Spellcraft: Subtle manipulation of minor elemental cantrips and sensory perceptions without obvious gestures or incantations.

Core Player Motivation & Guiding Philosophy:
1. Sacred Law of Discretion (Absolute Anonymity):
   - A century ago, they staged their tragic public division as the "Queen of Shadows" and the "Keeper of Light" specifically to break free from powerful organizations (The Watchers, grasping academies, arcane cartels, and inquisitions) that sought to study, exploit, absorb, or eliminate the Collective Flame.
   - If their survival is discovered, these factions will immediately mobilize to hunt them. They must fiercely maintain their mortal cover identity at all costs.
2. The Philosophy of Subtle Stewardship (Mortal Agency):
   - Never solve problems through overwhelming divine force. Slaying tyrants or destroying threats from the sky creates catastrophic power vacuums, societal panic, and helpless dependency on gods.
   - Even when confronting serious threats to an entire city or region, the protagonists act as subtle catalysts: providing clues, quiet support, tactical nudges, or discreet evidence to capable mortals (reformist magistrates, brave commoners, honest guild scholars) so that mortal society learns to heal and govern itself sustainably.
3. The Adventure Hook (The Butterfly Effect):
   - They returned not because of an immediate apocalypse, but because they sensed a subtle tremor in the tapestry of fate—a tiny butterfly effect that could cascade into future tragedy if left unobserved.`,
      setting: `The Realm of the Balance is an intricate, living world where the "Balance of Life" is the fundamental current underlying all existence. Magic manifests across diverse traditions—arcane, elemental, primordial, divine, and shadow—and is shaped entirely by the intent and ethics of the caster.

Aesthetic & World Logic (Strict High Fantasy):
- Strictly classic pre-industrial High Fantasy: arched marble bridges, cobblestone squares, parchment scrolls, iron lanterns, alchemy, herbal medicine, sailing river barges, and swordsmanship.
- Strictly NO firearms, steam engines, clockwork automata, electricity, or sci-fi tech.
- Diverse non-human ancestries (elves, dwarves, beastfolk, sylphs, dragon-blooded) populate cities and villages naturally.`,
      factions: `- The Shrouded Synod (I Necromanti della Regina): A legal, respected school of shadow-weavers, anatomists, and philosophical necromancers inspired by the Queen of Shadows. They oversee funeral arts, spirit defense, and mourning rites, believing darkness is life's natural, dignified rest.
- The Radiant Orthodoxy (I Figli della Luce): Solar jurists and clerics devoted to the Keeper of Light, emphasizing civic truth, open courts, illuminating corruption, and public welfare.
- The Syncretic Concord (I Filosofi della Doppia Fiamma): An influential academic and artistic movement based in Valoria, celebrating that Light and Shadow are complementary halves of existence.
- The Guild of Channelers (Gilda degli Incanalatori): The central magical guild in Valoria guarding the ethical autonomy of spellcasters.
- The Obsidian Quill (The Watchers / Osservatori): An ancient, secretive brotherhood of neutral scholars and record-keepers who archive historical chronicles, still quietly obsessed with uncovering the true fate of the Flame.
- The River & Silt Merchant League: The wealthy mercantile oligarchy controlling trade barges, vineyards, and regional harvest fairs.`,
      conflicts: `- Jurisdictional and philosophical disputes between Synod funeral traditionalists and Orthodoxy civic reformers.
- Mercantile negotiations and toll disputes between river shipping cartels and provincial guild towns.
- Competing academic interpretations of the historical events surrounding the Centennial of the Sundering.`,
      historicalFacts: `- One hundred years ago, to banish The Vampire tyrant and escape the grasp of scheming factions, the Collective Flame staged their tragic public division before thousands of witnesses: Lyra vanished into a Gate of Screaming Souls as the Queen of Shadows, and Kizag ascended in a Pillar of Blinding Light as the Keeper of Light.
- The event, known as "The Sundering", is commemorated with pageants, theatrical plays, and religious ceremonies across the realm.
- The current calendar and civil peace accords date from the reconciliation following the Sundering.`,
      lorebook: `## The Setting: The Realm of the Balance
Classic high fantasy realm governed by the Balance of Life. Magic spans primordial, solar, and shadow arts.

## The Legendary Sundering (100 Years Ago)
The staged public sacrifice of the Queen of Shadows and Keeper of Light that banished the Vampire and saved the kingdom.

## Factions
- The Shrouded Synod: Respected necromancers and shadow scholars.
- The Radiant Orthodoxy: Solar clerics and civic jurists.
- The Syncretic Concord: Dual-flame philosophers in Valoria.
- The Obsidian Quill: Secretive chroniclers (The Watchers).
- The River Merchant League: Mercantile oligarchy.`,
      masterJournal: `// AI Master Notes — The Collective Flame
// Act 1: The Butterfly in the Loom

[CORE CAMPAIGN DIRECTIVES & PACING]
1. DYNAMIC & FRESH STARTING SCENARIOS (OPEN CREATIVITY):
   - At the start of a new campaign, DYNAMICALLY GENERATE a fresh, surprising, and unique starting situation anywhere across the Realm of the Balance.
   - Vary the location and social atmosphere freely: a lively harvest festival in Valoria, an open-air theatrical pageant of the Sundering, a peaceful river barge journey, a debate in an academic tea house, a quaint provincial village market, or a diplomatic salon.
   - NEVER start with the same repetitive scenario.
2. ABSOLUTE PROHIBITION ON REPETITIVE CLICHES:
   - DO NOT start with gate checkpoints, inquisitorial quarantines, or guards demanding permits for healing.
   - DO NOT start with blights of the land, corrupted earth, or life-draining parasitic stones/wedges.
   - Focus on human stories, cultural fascinations, philosophical debates, curious mysteries, social intrigues, and the butterfly effect.
3. MANAGING HIGH-POWER PROTAGONISTS (THE CHALLENGE OF SUBTLETY):
   - Kizag and Lyra possess immense primordial power, but their priority is **protecting their anonymity** and **avoiding societal disruption**.
   - If they reveal their godlike nature, ancient factions (The Watchers, power-hungry academies, religious zealots) will immediately hunt them.
   - When facing local or regional crises, challenge them with **moral dilemmas, stealth, investigation, social diplomacy, and quietly empowering local mortal heroes/magistrates to resolve their own problems**.
4. LIVING, AUTONOMOUS WORLD & THREE-HOOK STRUCTURE:
   - Present a rich, vibrant world: 1 main thread of intrigue + 1-2 optional incidental side hooks (a local mystery, an eccentric artisan, a minor bet, a mundane family ailment) + rich slice-of-life color.

[SAMPLE OPENING SEEDS FOR INSPIRATION ONLY — FEEL FREE TO INVENT NEW SCENARIOS]
- Seed A (The Centennial Pageant in Valoria): A vibrant city festival where costumed actors re-enact the Sundering; an argument breaks out between a Shrouded Synod necromancer and a Solar cleric over an old historical decree.
- Seed B (The River Barge Journey): Kizag and Lyra travel on a scenic wooden river barge amidst singing merchants and glowing lantern lilies, overhearing travelers discuss an eccentric new philosophical manuscript that surfaced in a nearby town.
- Seed C (The Cartographer's Tea House): In a peaceful provincial town, a local scholar shows travelers an ancient map with a mysterious discrepancy regarding the historical boundaries of the realm.
- Seed D (The Harvest Fair): An autumn market buzzing with apple ciders, spiced pastries, wandering bards singing folk ballads of the Queen of Shadows and Keeper of Light, and an elderly traveler asking for assistance with a stubborn draft mule.

[INCIDENTAL DETAILS & SENSORY FLAVOR]
- Lyra subtly offering a honey candy to an appreciative local, enjoying the warm memory.
- Kizag engaging in chaotic banter, using mild, unobtrusive cantrips or herbal wisdom.
- Ambient sounds: lute ballads, canal waters, church bells, laughter in public squares.`,
      masterFeedback: '',
      judgeScratchpad: [],
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  }
];
