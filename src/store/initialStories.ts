import type { Story } from '../types/story';

export const initialStories: Story[] = [
  {
    id: 'eldoria',
    type: 'template',
    title: 'The Whispers of Eldoria',
    genre: 'Fantasy',
    synopsis: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    dynamicState: {
      characterSheet: `Name: Evelyn of Eldoria
Role: Wilderness Scout & Herbalist
Attributes:
- Might: 9
- Agility: 14
- Intellect: 12
- Grit: 11

Skills: Forest Tracking, Archery, Herbal Alchemy, Stealth, Ancient Sylvan Dialect

Equipment:
- Recurve Bow of Heartwood Elm & 20 Steel-tipped Arrows
- Monofilament Hunter's Dagger
- Supple Leather Jerkin (Reinforced with boiled hide)
- Silver Elven Pendant (Heirloom pulsing faintly near elven relics)
- Field Herbalism Kit & Rations (4 days)
- Traveling Cartographer's Parchment & Charcoal Sticks

Active Cover Persona:
- Presents herself as "Evelyn Gray", an independent botanical cartographer hired by Oakhaven apothecaries.`,
      lorebook: `## The Setting: Eldoria Ruins
Once a grand mountain sanctuary of the ancient Sun Elves, now swallowed by the ancient Whispering Woods. Centuries ago, during the Cataclysm of the Pale Moon, its gates were sealed to contain a cosmic tear. Now, the sanctuary's stone pylons glow with a rhythmic violet luminescence.

## The Violet Beacon
A towering crystalline monolith at the center of the inner sanctuary. Ancient manuscripts claim it serves as a soul-anchor for a dormant celestial entity, drawing nearby living souls through sub-audible psionic murmurs.

## Factions & Competing Agendas
- **The Sylvan Wardens:** A cloistered order of elven rangers and druids sworn by blood to keep Eldoria sealed forever. They view any intrusion as an existential threat to the forest ecosystem.
- **The High Arcane Conclave of Oakhaven:** Imperial scholars and battle-mages who believe the Violet Beacon can be harnessed as a perpetual energy source for their dying arcane engines. They are willing to forcefully bypass the Wardens.
- **The Gilded Talon Mercenary Company:** Pragmatic sellswords hired by illicit antiquities syndicates to plunder elven relics and celestial crystals from the ruins, indifferent to magical repercussions.

## Key NPCs
- **Scholar Elian (Conclave Expeditioner):** Wounded at the outer gatehouse, bleeding from a beast claw. Claims to be a harmless botanist seeking rare herbs, but secretly carries Conclave dispelling sigils. Disposition: Desperate, grateful for aid, guarded. Knowledge of PG: Believes Evelyn is merely a local scout.
- **Warden Maeve (Sylvan Patrol Leader):** Stern, veteran archer patrolling the tree canopies with an owl companion. Intolerant of treasure hunters, but respects those who show reverence to the forest spirits. Knowledge of PG: Unaware of Evelyn's true lineage.
- **Torin 'Ironhand' (Mercenary Veteran):** Camping with a small squad near the river crossing downstream. Pragmatic, exhausted, looking for an easy score or valuable intel before his contract expires.

## Cover Identities & Subterfuges
- **Botanical Cartographer ("Evelyn Gray"):** Evelyn carries forged guild seals from Oakhaven proving her botanical mission. Conclave mages and mercenaries will treat her as harmless non-combatant staff unless she displays advanced archery or magic.

## Incidental World Elements & Flora
- **Whisper-Moss:** Luminescent moss that rustles when vibrations pass over it, acting as natural alarm chimes.
- **Spectral Lanterns:** Residual arcane wisps that float over sunken plazas at twilight, harmless unless startled by loud noise.
- **Feral Timber-Stalkers:** Lean, quadrupedal predators with hardened chitin plates that hunt around the outer ruins.`,
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
      characterSheet: `Name: Kaelen Vex
Role: Rogue Decker & Infiltration Specialist
Credits: 1,450 ₡
Street Cred: Tier 2 (Known in the Sump)

Augmentations:
- Neuro-Link V4: Direct military neural interface, overclockable for rapid matrix breaching (+30% ICE breaking speed, risks neural burnout).
- Synthetic Cyber-Eye (Left): Thermal imaging, optical zoom (x8), HUD targeting grid, facial recognition scan.
- Subdermal Carbon-Mesh Weave: Ballistic absorption under the ribcage and forearms.

Gear & Inventory:
- Arasaka Custom 'Onyx-9' Cyberdeck (Loaded with custom ICE-Breakers & Decoy Daemons)
- Silenced Ares 9mm Heavy Pistol (15 rounds AP, 1 spare mag)
- Monomolecular Combat Blade (Concealed in forearm sheath)
- EMP Grenade (x1) & Patch-Kits (Trauma-Gel x2)
- Encrypted military-grade Datachip ("Project Lazarus")

Active Cover Persona:
- Forged Digital ID: "Derrick Vance", Level-2 Sub-Contracting Net-Technician for Shin-Megacorp Utility Grid.`,
      lorebook: `## The Setting: Sector 7 ("The Sump")
The rain-drenched underbelly of Neo-Kyoto. Towering corporate megastructures pierce the toxic cloud layer above, casting the slums below into perpetual neon-lit darkness. Acidic rain puddles reflect flickering holographic advertisements for synthetic noodles and memory-wipes.

## The Red Chip ("Project Lazarus")
A classified, military-grade storage module recovered from a downed Shin-Megacorp executive AV in the upper district. It contains compressed neural engrams of deceased megacorp board executives who continue to govern through shadow AI subroutines.

## Factions & Street Dynamics
- **Shin-Megacorp Sec-Ops (Black-Ops Division):** Highly trained corporate death squads equipped with combat cyberware and tracking drones. Their orders are shoot-to-kill to recover the chip without public exposure.
- **Null-Vector:** An underground radical hacker collective operating out of abandoned subway tunnels. They want to upload the chip's unencrypted contents to the public holo-net to trigger an open corporate revolution.
- **The Rust Syndicate:** The dominant cyber-yakuza clan in Sector 7, running black-market clinics, illegal braindances, and smuggled tech pawnshops. They are interested purely in selling the chip to the highest bidder.
- **Precinct 9 (Metropolitan Police):** Chronic under-funded, corrupt municipal officers who take bribes from the Syndicate and look the other way when Sec-Ops conducts sweeps.

## Key NPCs
- **'Blue' (Fixer at The Neon Lotus Lounge):** Sharp, charismatic cyber-fixer with high-roller debts. She arranged Kaelen's safehouse. Knowledge of PG: Knows him as 'Ghost-Jack', unaware of the exact contents of the chip. Disposition: Helpful but desperate for a big score.
- **Chop-Doc Kaito:** An elderly, cyber-surgeon operating a clandestine clinic behind a synthetic ramen shop. Cynical, reliable, refuses to work for corpos.
- **Detective Victor Chen (Precinct 9):** A weary vice detective tracking the AV crash. He suspects a street decker has the prize and wants a cut to forge an exit permit off-world.

## Cover Identities & Subterfuges
- **Technician Derrick Vance:** Kaelen carries a forged Shin-Megacorp maintenance badge and work overalls. Corporate drones and checkpoint guards will treat him as low-level utility labor unless scanned by high-grade military biometric arrays.

## Incidental Street Life & Atmospheric Details
- Sizzling street-side synth-ramen stalls with steam rising into neon rain.
- Glitched billboard projections broadcasting looping celebrity murder trials and artificial lottery drawings.
- Roaming scrapper kids pulling copper wiring from exposed junction boxes.`,
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
      characterSheet: `Name: Dr. Isaac Clarke
Role: Chief Xenogeologist & Environmental Specialist
Sanity: 82% (Stable, but showing sleep-deprivation tremors)
Physical Condition: Mild hypothermia risk (-45°C ambient)

Skills: Sub-Glacial Geology, Spectrometric Analysis, Heavy Machinery Operation, Emergency First Aid, Pressure Systems

Equipment:
- Reinforced Mk-IV Thermal Pressure Suit (Integrated HUD, Internal O2: 45 min)
- Industrial Plasma Cutter (Tool / lethal short-range energy weapon)
- Handheld Acoustic & Spectrometric Resonator
- Diagnostic Datapad (With local station telemetry logs)
- Emergency Flare Stick (x3) & Medical Sedative Injector (x2)

Active Focus:
- Determining the nature of the geological anomaly at Shaft 4 before Station Command implements quarantine protocols.`,
      lorebook: `## The Setting: Outpost Boreas
A modular deep-crust research and mining station suspended 4 kilometers beneath Europa's frozen crust, anchoring directly over a pitch-black, pressurized abyssal ocean. The station groans constantly under tectonic tidal shifts caused by Jupiter's gravity.

## The Anomaly at Shaft 4
Yesterday at 04:00, the primary super-drill breached a sub-ice cavern and immediately seized. Shortly after shutdown, rhythmic acoustic vibrations—mathematically structured acoustic pulses—began traveling up through the station's titanium framework.

## Factions & Internal Station Tensions
- **Station Command (United Space Alliance Executives):** Driven by corporate directives to extract high-value alien compounds at all costs. They have classified the drill logs and placed armed security at the airlocks.
- **The Roughneck Drilling Crew:** Hardened industrial miners who have worked Europa for years. Exhausted and terrified, they believe the drill awakened something lethal and are threatening an armed mutiny to seal the shaft.
- **The Scientific Division:** Torn between scientific ambition to make first contact with extraterrestrial biology and the growing dread of the psychological symptoms spreading through the crew.

## Key NPCs
- **Commander Ronald Harris (USA Station Chief):** Calculating, under immense pressure from corporate headquarters on Earth. Carrying encrypted containment orders and a sidearm. Disposition: Authoritative, paranoid about panic.
- **Chief Engineer Yana Petrova:** Cynical, blunt, and fiercely protective of her maintenance crew. Smuggles contraband vodka into the life-support vents and knows every structural flaw in the station.
- **Dr. Soren Vance (Acoustic Specialist):** Confined to his quarters after listening to the acoustic pulses for 12 hours straight. He claims the ice is "remembering" human voices.

## Atmospheric & Environmental Realities
- **The Cold:** Ambient temperature in unheated maintenance shafts drops to -60°C in minutes if power fluctuates.
- **Acoustic Bleed:** The station walls act like a giant tuning fork, transmitting the deep subterranean tapping directly into the crew's living quarters.`,
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
      characterSheet: `Name: Zor
Role: Low-Ranking Osys Portal Mage & Secret Demon Host
Affinity: Abyssal & Entropic Magic (Strictly Capital Crime in Tariald)

Attributes:
- Arcane Might: 14 (Amplified by demonic surge)
- Willpower & Sanity: 10 (Struggling against inner whispers)
- Deception & Guile: 13
- Physical Fortitude: 9

Traits & Secrets:
- **The Curse of Osys:** Harbors "Malok the Render", a sentient entropic demon bound into his neural conscience. Grants immense arcane insight at the cost of periodic bloodlust and sulfurous bodily sparks.
- **Masters of Dissembling:** Highly practiced in concealing demonic residue as mundane portal arcane exhaust.

Equipment:
- Standard Osys Grey Robes (Worn, ink-stained)
- Consecrated Lead-Lined Glass Phials (For collecting volatile rift residue)
- Runic Chalk, Parchment & Mana-Calibration Focus Rod
- Hidden Silver Dagger (Etched with Osys warding seals against mental takeover)

Active Cover Persona:
- Presents himself as a humble, timid arcane archivist specializing only in mundane flux telemetry calculations.`,
      lorebook: `## The Setting: Tariald, City of Portals
An immense, tiered metropolis governed by a proud Council of Guilds, High Nobles, and Arch-Mages. The city's immense wealth derives from **The Great Portal**, a monumental rift gateway connecting distant kingdoms and interdimensional resource nodes.

## The Empire of Osys & The Curse
The distant desert empire of Osys provides the dangerous manual arcane labor required to keep the Portal stable. To survive the lethal extradimensional radiation, all Osys mages secretly undergo the forbidden rite of binding a minor demon to their soul. If Tariald Inquisitors discover this, execution by public soul-extraction is immediate.

## Factions & Political Friction
- **The Tariald Academy of High Sorcery:** Arrogant aristocratic mages who reap the wealth of the portal while treating Osys laborers as expendable second-class servants.
- **The Inquisitorial Eye of Tariald:** Fanatical arcane inquisitors equipped with soul-hound constructs that sniff out entropic magic, demonic corruption, and illegal mana smuggling.
- **The Osys Mage Enclave:** A tight-knit, secretive community of foreign mages who watch each other's backs, but will ruthlessly eliminate any member who loses control of their inner demon to protect the enclave.
- **The Silt Veil Syndicate:** A criminal network in the lower canal districts dealing in forbidden planar artifacts, stolen portal keystones, and untaxed dimensional cargo.

## Key NPCs
- **Supervisor Valerius (Osys Enclave Elder):** Zor's direct superior. Severe, calculating, and cynical. He knows Zor's bound entity is unusually potent; he covers for Zor but expects obedience in enclave schemes.
- **Inquisitor Morwen:** A sharp, cold inquisitor stationed at Portal Control. She carries an arcane balance scale and suspects the Osys shifts are siphoning exotic matter.
- **Shara of the Silt Veil:** A resourceful fence in the canal district who buys raw anomaly crystals and can arrange forged travel passes out of Tariald.

## Cover Identities & Demonic Subterfuge
- **Archivist Zor:** All Academy records describe Zor as an unremarkable low-tier number-cruncher. As long as Zor avoids overt displays of shadow/fire magic, Academy inspectors treat him with dismissive condescension.

## Incidental City Life
- Canals filled with gondolas transporting glowing exotic spices from planar rifts.
- Street heralds shouting council decrees and fluctuating tariffs on planar silk.
- Street vendors roasting spiced cavern lizards on brass braziers.`,
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
      characterSheet: `Name: [Player Undiscovered / Alias Dependent]
Role: [Amnesiac Protagonist - Skills discovered through action]
Condition: Complete retrograde declarative amnesia. Intact procedural memory & muscle reflexes.

Observed Traits & Clues:
- Tailored Italian Wool Suit (Expensive, discreet inner pocket)
- High-end Patek Philippe Chronometer (Stopped precisely at 01:14 AM)
- Bruised knuckles on the right hand; slight trace of dried blood under thumbnail
- Fluent in multiple languages and trained in situational awareness

Immediate Inventory:
- Keycard to Penthouse Suite 44A
- Wall Safe Keypad (Combination remembered purely via tactile muscle memory)
- Inside Safe: $45,000 in unmarked high-denomination cash, clean foreign passport in the name "Julian Mercer", blacked-out photograph of two people outside a dockside warehouse.
- Unlocked Smartphone (Dead battery; when charged, displays 1 unread text from 'M': "Do not come tonight. They know.")`,
      lorebook: `## The Setting: The Metropolitan Glass Tower
The top-floor penthouse (Suite 44A) of a prestigious financial district skyscraper. Floor-to-ceiling windows look out over a sprawling city drenched in cold rain and glowing corporate towers. The penthouse is minimalist, luxurious, and disturbingly quiet.

## NPC Compartmentalization Rule
**CRITICAL DM DIRECTIVE:** Every NPC possesses only their specific fragment of the truth. NPCs do NOT communicate off-screen. If presented with unexpected questions, they react with realistic suspicion, confusion, or guarded professional distance.

## Key NPCs & Fragmented Knowledge
- **Avery Quinn (Personal Executive Assistant):** Arrives at 03:30 AM with a locked leather briefcase. Knows you scheduled a confidential asset liquidation 3 days ago. Nervous, overworked, terrified of losing her career. Knowledge of PG: Thinks you are in complete command of the operation.
- **Detective Renata Boyle (Metropolitan Police):** Arrives following an anonymous noise complaint from the penthouse. Sharp, procedural, observant. Notice details like the wet umbrella by the door and bruised knuckles. Knowledge of PG: Checking if a domestic altercation or burglary occurred.
- **Marsh Calloway (Old Business Partner):** Calls the penthouse landline at 03:45 AM. Warm voice, but subtle nervous pauses. Claims you were supposed to meet him at the harbor pier with "the ledger".
- **Dana Voss (Corporate Rival / Hostile Executive):** Believes you betrayed her in a hostile takeover. Cold, ruthless, wields legal and private security leverage.
- **Walter Briggs (Night Concierge):** Observant, polite elderly doorman in the lobby. Remembers everyone who entered or left the private elevator between midnight and 02:00 AM.

## Cover Identities & Social Navigation
- The protagonist can present themselves as "Julian Mercer" (the passport name), the rightful apartment owner, or an innocent guest, depending on how they manipulate information.`,
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
Role: Ex-Elite Special Agent ("Ghost") & Wandering Marksman
Psychic Condition: Constant Psionic Echoes (Perceives emotional residues, void ripples, and alien thoughts)

Combat Aptitudes & Powers:
- **Psionic Cloaking:** Activates tactical optical-refraction stealth suit (battery recharge required after sustained use).
- **Psionic Sensory Awareness:** Latent short-range danger premonition, telepathic murmur eavesdropping.
- **Precision Marksmanship:** Master-level long-range kinetic and particle sniper handling.

Equipment:
- "Solaria" High-Output Impulse Sniper Rifle (Solar/kinetic charged, extreme armor penetration)
- Heavy Kinetic Mag-Pistol (Silenced barrel attachment)
- Monocrystalline Vibro-Blade (Concealed boot sheath)
- Lightweight Tactical Infiltration Under-suit (Thermal regulation & kinetic dampeners)
- Neural Psi-Dampener Injectors (x2, stabilizes psychic overload in emergencies)
- Field Medikit & Survival Rations (3 days)

Active Cover Identity:
- Wandering Frontier Scout & Salvage Hunter named "Kira Sol" from the Outer Rim.`,
      lorebook: `## The Setting: The Kepler Frontier Sector
A lawless expanse of red-dust mining colonies, rusty orbital stations, and abandoned terraforming installations. Following the collapse of the Central Hegemony, the sector is divided between ruthless corporate syndicates, desperate settler unions, and fractured alien war-bands.

## The Ghost Program
A disbanded military black-project that genetically awakened psionic abilities in human orphans to create apex assassins. Surviving Ghosts are hunted as illegal weapons of mass destruction by bounty syndicates and corporate courts.

## Factions & Competing Forces
- **The Vanguard Syndicate:** A brutal corporate private military corporation controlling off-world fuel depots and extorting frontier settlements through private debt contracts.
- **The Frontier Settlers Union:** Independent miners, moisture farmers, and engineers struggling to build self-sustaining communities without corporate enslavement.
- **The Ascendant Zealots (Splinter Psions):** Fanatical alien psions who view human psionics as heretical blasphemy and seek to reclaim ancient precursor monoliths.
- **The Void Scrappers Guild:** Opportunistic salvagers who trade in scrap metal, black-market stims, and alien artifacts.

## Key NPCs
- **Sheriff Douglas Reed (Rust-Crest Settlement):** An aging, battle-scarred lawman who carries an old pump-action scattergun. Dedicated to protecting the town children, but hopelessly outgunned by the Syndicate.
- **Fixer Jin (Scrap Merchant & Informant):** A shrewd, cyber-eyed junk dealer in Rust-Crest who knows 'Kira' is far more dangerous than a standard drifter.
- **Zealot Vael-Kor:** An alien psionic hunter tracking the psychic frequency of an ancient void beacon buried beneath the town.

## Cover Identities & Ghost Subterfuge
- **Kira the Drifter:** When Lyra keeps her sniper rifle dismantled in her travel pack and refrains from active psionic cloaking, local settlers and Vanguard grunts dismiss her as an ordinary dust-scout.`,
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
    synopsis: 'After a century of rest in their extradimensional Haven, the Collective Flame—a single primordial consciousness sharing the twin bodies of Kizag and Lyra—returns to the mortal realm as two unassuming young apprentices to see if the Balance of Life, freedom of channelers, and the echoes of their legendary past still endure.',
    dynamicState: {
      characterSheet: `Name: The Collective Flame (Vessels: Kizag & Lyra)
Nature: A unified primordial consciousness and soul dwelling simultaneously within two distinct, independent physical bodies.
Public Role & Cover: Traveling Apprentice Mages & Herbalists ("Kael & Leonor")

Physical Vessels & Personality Facets:
1. Kizag:
   - Appearance: A sharp-eyed young man with unruly dark hair, dressed in simple traveler's wool and a dark traveling cloak.
   - Resonant Facet: Chaotic, quick-witted, intuitive, prone to spontaneous schemes, sharp humor, and paranoid vigilance.
   - Distinctive Arcane Gift: A formidable, extraordinary healer and restorer of vital currents (curatore formidabile), capable of mending flesh, soothing spirit fatigue, and re-weaving disrupted life flows with subtle precision.
   - Weapon: An ancient-forged, non-magical shortsword of unusual, exquisite metallurgical craftsmanship worn at his hip.

2. Lyra:
   - Appearance: A calm, observant young woman with piercing hazel eyes and a subtle, mischievous smirk.
   - Resonant Facet: Methodical, analytical, iron-willed, with a playful, slightly wicked and teasing sense of humor.
   - Unique Identifying Mark: A discreet, ancient tattoo of a broken tibia (tibia spezzata) etched on her forearm/ankle.
   - Weapon: A pair of twin curved daggers of exotic, ancient craftsmanship concealed inside her sleeves.
   - Characteristic Item & Trademark: A small wooden pocket pouch filled with golden honey candies (caramelle al miele), which she enjoys savoring or quietly leaving behind as an enigmatic gift.

Shared Primordial Nature & Dormant Abilities:
- Single Unified Mind: Total telepathic synthesis. What one vessel perceives, feels, or learns, the other experiences instantly in real time.
- Dormant Extradimensional Mastery: Deep innate affinity for dimensional seams and the Extradimensional Haven (The Magnificent Mansion / Reggia Meravigliosa), kept quietly dormant to avoid triggering arcane warding circles or inquisitorial scrying rituals.
- Subtle Infusion: Can channel vital kinetic balance into their physical non-magical weapons for swift parries without creating magical flashes.
- Silent Spellcraft: Subtle manipulation of minor elemental cantrips and sensory perceptions without obvious gestures or incantations.

Current Stated Objective:
- Move quietly as two humble apprentices. Observe the mortal world, verify if channelers and enchanters remain free and ethical, and explore how the realm remembered their legendary past sacrifice, all without drawing the eye of inquisitions or high authorities.`,
      lorebook: `## The Setting: The Realm of the Balance
The realm is an intricate, living tapestry where the "Balance of Life" is the fundamental current underlying all existence. Magic manifests in diverse forms—arcane, elemental, primordial, divine, and shadow—and is neither inherently good nor evil, but shaped entirely by the intent and ethics of the caster.

## The Legendary "Event of the Sundering" (~A Century Ago)
A century ago, after countless covert interventions across Grimgate and the realm, the Collective Flame realized they were becoming too predictable and targeted by scheming factions seeking to manipulate or destroy them. During their climactic final battle against **The Vampire**—a powerful undead tyrant who had nearly subjugated the realm in necromancy—the Flame staged a tragic, heartbreaking public division before thousands of witnesses:
- **Lyra** assumed the role of the *Queen of Shadows (Regina delle Ombre)* and dramatically vanished into a *Gate of Screaming Souls*.
- **Kizag** assumed the role of the *Keeper of Light (Custode della Luce)* and ascended into a *Pillar of Blinding Light*.
This staged split was so emotionally and magically consuming that the two vessels spent decades resting in their Extradimensional Haven to re-weave their joint consciousness. In mortal history and folklore, this event is revered as the ultimate sacrificial tragedy that banished the Vampire and saved the kingdom.

## The Metropolis of Valoria (A Century Later)
An ancient, thriving metropolis of canal waterways, grand marble aqueducts, and bustling guild plazas. Valoria flourishes in a golden age of magical study and commerce, though delicate political friction exists between magical freedom and civic regulation.

## Factions & Competing Worldviews
- **The Guild of Channelers (Gilda degli Incanalatori):** Headquartered in the High Spire of Valoria, built upon an ancient "moral compass" prioritizing the defense of life's dignity and the ethical autonomy of all magic users. They strive to protect young channelers from exploitation.
- **The Holy Order & Civic Inquisition:** Led by reformist inquisitors, they focus on preventing dangerous necromantic outbreaks, blood magic, and unauthorized planar rifts. They operate through rigorous civic law, magical permits, and investigative registries rather than blind zealotry.
- **The Obsidian Quill (The Watchers / Osservatori):** An ancient, secretive brotherhood of neutral scholars and record-keepers who archive historical events and planar echoes without direct interference, bound by their strict non-intervention creed.
- **The Silt & Stone Merchant League:** The wealthy mercantile oligarchy controlling the river wharves and trade routes, occasionally clashing with the Guild of Channelers over taxes on enchanted goods.

## Key NPCs
- **Arch-Mage Alain (Master Emeritus of the Channelers Guild):** An aged, wise sage who spearheaded the guild's moral independence. He keeps a framed, century-old honey candy wrapper in his private archive as a legendary symbol of ancient guardians. Knowledge of PG: Sees them only as two talented, humble apprentices seeking rural travel registration.
- **High Inquisitor Valen Verridian:** A shrewd, principled investigator who seeks to maintain order through forensic evidence and law rather than fear. Deeply suspicious of illicit soul-tampering.
- **Seraphina the Archivist (The Watchers):** A quiet scholar in the Grand Archive investigating historical records and folk ballads regarding the *Queen of Shadows* and the *Keeper of Light*.
- **Mira (Proprietress of The Weeping Willow Tavern):** A warm, perceptive hostess at the north gate who knows all local rumors, trade gossip, and traveler news.

## Subterfuge & Apprentice Covers
- **The Rural Apprentice Guise ("Kael & Leonor"):** Kizag and Lyra carry forged provincial recommendation papers. Unless they unleash godlike primordial magic, all authorities, guards, and mages perceive them strictly as ordinary mortal novices with good instincts.
- **The Honey Candy Signature:** An occasional, playful trademark of Lyra, left at scenes of quiet benevolent intervention or as a subtle nod to old allies.

## Pure Classic High Fantasy (Strict Prohibition on Sci-Fi & Steampunk)
Even though a century has passed in the world's history, the realm has evolved culturally, philosophically, and artistically—NOT technologically. The aesthetic remains strictly pure, classic High Fantasy: marble bridges, parchment scrolls, iron lanterns, alchemy, herbal medicine, swords, bows, and spellcraft. There are absolutely NO firearms, steam engines, clockwork automata, electricity, or sci-fi gadgets. The world's richness comes from classical fantasy diversity: non-human ancestries (elves, dwarves, beastfolk, sylphs, dragon-blooded), mythical beasts (gryphons, river drakes, forest spirits), and rich arcane lore.

## Incidental World Life & Local Flavor
- Street bards singing mournful ballads of the *Keeper of Light* and the *Queen of Shadows* in the Sunken Market.
- Gondolas navigating the moonlit canals carrying singing travelers and glowing lantern lilies.
- Apprentice mages practicing minor spark-tricks to cheering children in the Plaza of Fountains.
- Aromas of roasted spiced nuts, fresh river fish, and damp stone drying under the morning sun.`,
      masterJournal: `// AI Master Notes — The Collective Flame
// Act 1: The Return to Valoria

[CORE CAMPAIGN DIRECTIVES & PACING]
1. RELAXED, EXPLORATORY PACING (NO COSMIC APOCALYPSE):
   - The world is NOT in immediate peril. Do NOT rush the narrative or force an apocalyptic crisis.
   - Maintain a grounded, literary, and atmospheric tone. Let the two protagonists explore, converse, investigate local life, and observe how society evolved over the past century.
2. ABSOLUTE BAN ON RECYCLED VILLAINS:
   - Past enemies (The Vampire, The Higher Mind, The New Dawn Consortium, The Dark Scholars, ancient extra-dimensional anomalies) were PERMANENTLY defeated and destroyed.
   - Do NOT bring them back, resurrect them, or reuse them. Any obstacles must be fresh, organic, local, and grounded in human/mortal nature.
3. PRESERVE THE APPRENTICE COVER & VITAL ROLES:
   - Kizag and Lyra choose to stay low-profile. Let them solve problems through wits, charm, investigation, Lyra's sharp intellect, and Kizag's subtle healing mastery when helping commoners.
4. PURE CLASSIC HIGH FANTASY ONLY (NO TECH OR STEAMPUNK DRIFT):
   - The passing of a century brought peace, art, architecture, and guild philosophy, NOT industrialization or steampunk technology.
   - Strictly avoid guns, clockwork machines, steam engines, factories, electricity, or sci-fi tropes.
   - Freely populate the world with classic fantasy richness: diverse non-human ancestries (elves, dwarves, beastfolk, sylphs, dragon-blooded), mythical creatures, ancient ruins, and herbal/arcane traditions.

[STARTING SCENARIO]
- Kizag and Lyra step through a quiet boundary fold at dawn just outside Valoria's bustling North Gate.
- The gate road is crowded with wagons of crisp autumn apples, wandering minstrels, and young spellcaster hopefuls.
- The air is fresh, smelling of dew-soaked grass, woodsmoke, and the faint tingling hum of the city's protective warding stones.

[IMMEDIATE ORGANIC HOOKS & CHOICES FOR THE PLAYER]
1. The Gate Registry Line: Inquisitorial guards and Guild clerks are interviewing newcomers. Kizag and Lyra can present their provincial papers, chat with fellow travelers, or playfully test the clerk's perception.
2. The Distressed Courier: A flustered young guild apprentice has dropped a bundle of sealed missives into the canal water near the bridge, panicked that he will fail his initiation.
3. The Wandering Bard: A minstrel near the tavern entrance is tuning a lute, preparing to sing a popular local ballad about the "Tragedy of Light and Shadow" (the staged sacrifice of Kizag and Lyra).
4. The Tavern Atmosphere: The "Weeping Willow" tavern by the gate is full of colorful morning chatter about the Channelers Guild's latest ethical debates with the Merchant League.

[DM OBSERVATION THEMES]
- How have the myths of the *Queen of Shadows* and the *Keeper of Light* morphed over 100 years into folklore, art, and guild dogma?
- How do ordinary citizens feel about magic in their everyday lives?
- Let Kizag's chaotic humor, subtle healing warmth, and Lyra's teasing intellect with her honey candies bounce off each other naturally through their shared single consciousness.

[INCIDENTAL DETAILS]
- Lyra unwrapping a honey candy with a quiet smile as she watches the sun illuminate the spires of Valoria.
- Kizag unobtrusively pressing a thumb against the bruised knee of an elderly cart driver in the line, soothing the joint ache with a warm pulse of vital restoration without uttering a spell.
- A street cat rubbing against Lyra's boots, sensing a faint, warm primordial hum before purring contentedly.`,
      masterFeedback: '',
    },
    messages: [],
    createdAt: 1782345600000,
    updatedAt: 1782345600000
  }
];
