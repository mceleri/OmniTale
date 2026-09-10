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
      characterSheet: `Name: The Collective Flame (Public Mortal Identities: Kael & Leonor — Husband and Wife)
True Nature: A unified primordial consciousness and soul residing simultaneously within two distinct, independent physical bodies. Centuries ago, Kizag (a sorcerer) and Lyra (a sorceress) met as wanderers, faced countless perils together, fell deeply in love, and married. Over epochs of profound spiritual harmony, their two souls fused into the Collective Flame. They have been husband and wife for centuries, romantic life companions, and STRICTLY NOT siblings or twins.

Mortal Life in Valoria (Settled for nearly a year):
They live and work in the working-class lower canals district, on the ground floor of an ancient stone building overlooking the water ("The Willow Apothecary"). They genuinely cherish this ordinary mortal life and revel in rediscovering themselves as young newlyweds in the mortal world.

The Two Vessels & Daily Roles:
1. Kizag ("Kael"):
   - Appearance: Young man with sharp eyes, a crooked grin, and perpetually tousled dark hair, wearing working wool tunics and a soft leather apron.
   - Public Role: Independent Herbalist and Arcane Healer. Not a pious cleric devoted to a deity, but an adept arcanist who channels the current of Life. He mends broken bones, soothes fevers with subtle vital infusions, and brews medicinal salves.
   - Traits: Chaotic, quick-witted, ironic, in perpetual methodological contrast with the haughty apothecaries and alchemists of the Academy: while they employ rigid formulas, intricate distillations, and pompous academic theories, Kael operates through an instinctive, direct connection to vital flows. For this reason, the academy masters look down on him as an uneducated self-taught hedge-mage, perhaps more lucky than skilled, while he chuckles at their pedantic sluggishness. Wears an ancient, well-balanced shortsword at his hip.

2. Lyra ("Leonor"):
   - Appearance: Attractive, composed, and observant young woman with piercing hazel eyes, a dark braid, and a mischievous half-smile.
   - Public Role: Manuscript Archivist and gentle Sensitive / Funerary Necromancer. She communes with departed spirits to settle unresolved regrets, consoles grieving families, dispels minor domestic hauntings, and blesses burial grounds.
   - Traits: Methodical, analytical, with razor-sharp, dry wit. Always carries a pocket cloth pouch filled with golden honey candies and conceals an ancient tattoo of a fractured shinbone beneath a linen ribbon on her wrist. Conceals two curved daggers inside her sleeves.

Couple Dynamics & Charm:
- Both are charming, charismatic young people: occasional patrons or canal folk playfully flirt with them, triggering private amusement and telepathic banter between husband and wife.
- They love each other with absolute centuries-long devotion and tenderness, yet in public maintain the fresh, playful spark of young newlyweds.

Neighborhood Friends & Acquaintances:
- Master Tarek: The half-orc innkeeper of the nearby tavern "The Copper Boar". Gruff, jovial, fiercely proud of his spicy mutton stew, he treats Kael and Leonor like favorite kin and trades hearty hot meals for Kael's backache salves.
- Sofi: A streetwise orphan runner, quick on her feet and sharp-tongued, who runs errands for the apothecary and knows every rumor, contraband ring, and canal murmur.
- Brother Julian: A young cleric of the Order of the Solar Flame, naive, earnest, and gentle-hearted. He regularly purchases soothing temple incense from Leonor and is visibly flustered, awestruck, and charmed by her intellect.

Dormant Primordial Capabilities (The Secrecy Challenge):
- Total Telepathic Synthesis: Instant, continuous sharing of thoughts, senses, and emotional states in real time.
- Subtle Everyday Magic: Minor cantrips, subtle kinetic nudges, spirit sensing, and vital resonance used casually as mundane apprentice-level tricks.
- Why They Restrain Themselves: They genuinely love their mortal life, their shop, and their neighborhood friends. Revealing their true divine nature would summon ancient cosmic powers and permanently shatter the cozy peace and happiness they have built in Valoria.`,
      setting: `The Realm of Balance is a vibrant, classic, pre-industrial High Fantasy world where magic permeates every tier of everyday life.

Valoria, the City of Bridges and Canals:
- A picturesque, bustling river metropolis: monumental arched marble bridges, paved alleys lit by wrought-iron lanterns, alchemy shops, masted river barges, and colorful open-air markets.
- Common and Visible Magic: Magic is not a sequestered elite secret; it is woven into the city's daily fabric. Townsfolk use minor elemental sparks to light hearths or boil kettles, arcane healers and funerary sensitives practice openly in district squares, and playful river wisps dance over the water on foggy evenings.
- Organic Diversity & Coexistence: Humans, half-orcs, elves, dwarves, beast-kin, and sylphs live and work together as respected citizens, artisans, merchants, and sailors without monolithic racial divides.
- Strictly Pre-Industrial & Arcane: Absolutely NO steam technology, industrial runoff, modern metal pumps, chemical factories, heavy industrial pollution, or modern municipal bureaucracy. Any anomaly, corruption, or blight is magical, alchemical, cursed, demonic, or beast-spawned.`,
      factions: `The factions of the Realm are dynamic, multifaceted organizations rather than bureaucratic monoliths:

1. The Academy of Channelers (Valoria's Arcane Guild):
   - A sprawling, diverse arcane university and guild comprising multiple faculties: Pyromancy, Hydromancy, Kinetic Arts, Transmutation Alchemy, Natural Magic, and Philosophical Necromancy.
   - The Shadow Charter: Thanks to the historic precedent established a century ago by the Queen of Shadows, necromancy and shadow magic are recognized as LEGAL and respected disciplines dedicated to pacifying spirits, funerary rites, and anatomical study. Only black necromancy (enslaving undead thralls, violent soul-rending, desecration) is strictly outlawed and hunted.
   - Atmosphere: Eccentric professors, rival apprentices dueling with cantrips in cobblestone courtyards, and spirited academic disputes.

2. The Order of the Solar Flame (The Church of Light):
   - A vast, nuanced faith far beyond a one-dimensional zealot inquisition. It houses varied internal currents:
     * Shepherds of Light: Merciful priests, healers, and almsgivers serving the poor (such as Brother Julian).
     * Keepers of Dogma: Rigorous theologians who debate ethics in public forums and cast a skeptical eye on academic necromancy.
     * Blades of Dawn: Radiant knights and paladins dedicated to defending frontier roads and fighting genuine horrors and demonic incursions.

3. Street Life & Freelancers:
   - River merchant guilds, independent alchemists, traveling bards, hedge-healers, and the "Canal Wolves" (river smugglers and pickpockets who view the young apothecary couple as soft marks or occasional allies).

4. The Keepers of the Dual Veil (Philosophical Heirs of the Flame):
   - A peaceful spiritual order founded after the Scission, dedicated to preserving harmony between Life and Death, Light and Shadow. They act as arbiters and stewards of ancient shrines, venerating the legendary Collective Flame without suspecting that the mythical couple is happily running an herb shop down in the lower canals!

5. The Obsidian Watchers (Deep Shadows):
   - An ancient fellowship of immortal archivists obsessed with monitoring superhuman entities, divine avatars, and reality-bending anomalies. They lurk in the shadows, gathering chronicles and tracking cosmic whispers.

6. The Tyrant's Ashes (Fractured Cults — Latent Threat):
   - Scattered splinter covens of blood mages and fallen nobles squabbling over relics and residual power left behind by the Vampire Tyrant vanquished a century ago. They seek personal power and forbidden lore rather than reviving their dead master.`,
      conflicts: `Vivid, Multilevel Conflicts (Zero Notarial Bureaucracy):
- District & Everyday Life: Local pickpockets and cutpurses testing their luck against Kael or Leonor; professional rivalries with haughty Academy apothecaries; eccentric patrons seeking remedies for bizarre conditions; bashful suitors orbiting Leonor or Kael.
- Arcane Mysteries & Local Hazards: Restless river spirits haunting old sunken vaults; cursed alchemical curios hauled up by river derrick nets; Academy students whose wild elemental experiments get loose in the canals; illicit black-market reagent trades.
- Civic & Doctrinal Debates: Lively theological disputes between solar clerics and academic necromancers over the stewardship of ancient crypts; city night-watches investigating river contraband.
- The Cover Dilemma: The persistent challenge of addressing local crises with mortal wits, street ties, and subtle magic while ensuring higher divine powers do not leak, lest they draw the gaze of the Obsidian Watchers or embolden the Tyrant's Ashes.`,
      historicalFacts: `- One century ago, following the defeat of the Vampire Tyrant, the Collective Flame staged their tragic public "Scission" (Lyra departing as the Queen of Shadows, Kizag as the Warden of Light) to liberate themselves from the demands of divine courts, inquisitions, and cosmic orders seeking to exploit their power.
- The Scission is commemorated annually in Valoria with a vibrant civic festival of theatre, costumed revels, and canal lantern dances.
- Nearly a year ago, Kizag and Lyra quietly returned to mortal society under the guise of young newlyweds Kael and Leonor, finding genuine contentment and joy in their cozy neighborhood routine.`,
      lorebook: `## Setting: Valoria & The Realm of Balance
A vibrant High Fantasy canal metropolis of arched marble bridges, magic shops, and river barges. Magic is common, visible, and part of everyday life.

## Protagonists: Kael & Leonor
Husband and wife for centuries and mortal vessels of the Collective Flame, living for nearly a year at The Willow Apothecary. Kael is an independent arcane healer and herbalist; Leonor is an archivist and gentle funerary sensitive. They deeply cherish their mortal life and protect it vigilantly.

## Neighborhood Acquaintances
- Master Tarek: Gruff, warm-hearted half-orc innkeeper of "The Copper Boar".
- Sofi: Quick-witted canal orphan and errand runner.
- Brother Julian: Earnest, gentle young solar cleric, openly captivated by Leonor.

## Major Powers
- The Academy of Channelers: Diverse magical university; ethical and funerary necromancy is legal.
- The Order of the Solar Flame: Nuanced church (merciful shepherds, dogmatic scholars, monster-slaying paladins).
- Keepers of the Dual Veil: Peaceful custodians seeking harmony between light and shadow.
- The Obsidian Watchers: Secret chroniclers hunting superhuman anomalies.
- The Tyrant's Ashes: Fractured covens seeking remnant vampiric relics.`,
      masterJournal: `// AI Master Notes — The Collective Flame
// Act 1: Life and Mysteries along the Willow Canals

[STARTING SCENARIO & ATMOSPHERE]
- Kael and Leonor have lived peacefully at The Willow Apothecary for nearly a year. The shop smells of dried mint, spruce resin, and beeswax candles.
- They are well-known and liked throughout the lower canal district: locals know Kael can set a dislocated shoulder or soothe a virulent fever with remarkable arcane touch, while Leonor gently listens to spirit murmurs to bring comfort to grieving families.
- Their couple dynamic is affectionate, witty, and peppered with unspoken telepathic banter.

[IMMEDIATE SCENE HOOKS (CHOOSE OR COMBINE ORGANICALLY)]
1. Master Tarek's Plight: The half-orc innkeeper knocks on the apothecary door, rubbing his aching back with a grimace: strange ghostly whispers and faint blue glows have been rising from his tavern cellar ever since he purchased three barrels of spiced cider from an out-of-town barge captain.
2. Brother Julian's Errand: The young solar cleric drops by to collect ritual incense for the chapel, blushing nervously as he greets Leonor, but brings intriguing news: canal patrols recovered an odd dagger etched with shadowy runes from near the docks.
3. The Overconfident Cutpurses: Sofi darts into the shop to warn that two young street thieves from the "Canal Wolves" are casing the apothecary, convinced a pair of young newlywed herbalists will make an easy, wealthy mark.

[CORE DIRECTIVES FOR THE GAME MASTER]
1. EVERYDAY VITALITY & GENUINE HIGH FANTASY:
   - Make magic feel tangible and alive: domestic cantrips, color-shifting herbal draughts, curious minor spirits, and lively banter between apothecaries and students.
   - ABSOLUTELY NO industrial anachronisms (no modern plumbing, heavy metal pipes, chemical factory pollution, or notarized tax bureaucracy).
2. SOCIAL CHARM, WIT & FLIRTATION:
   - Celebrate the protagonists' personal charm: appreciative passersby, playful neighborhood flirtations, and affectionate telepathic repartee between husband and wife.
   - Bring NPCs to life with distinct warmth and quirks: Master Tarek is rustic and protective, Sofi is sharp and loyal, Julian is gentle and flustered.
3. THE ART OF RESTRAINT:
   - The primary stake is not avoiding death in combat, but safeguarding their cozy mortal life and friends without alerting ancient watchful eyes (the Obsidian Watchers or Tyrant's Ashes).
   - When overcoming obstacles, encourage mundane ingenuity, practical herbalism, clever diplomacy, and subtle magic rather than overt cosmic displays.`,
      masterFeedback: '',
      judgeScratchpad: [],
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  }
];
