import json
from typing import Dict, List, Optional
from .types import Story, DynamicState, PlayerPersona

def get_eldoria_template() -> Story:
    return Story(
        id='eldoria',
        type='template',
        title='The Whispers of Eldoria',
        genre='Fantasy',
        synopsis='You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
        language='English',
        narrative_propensity='balanced',
        dynamic_state=DynamicState(
            character_sheet="""Name: Evelyn of Eldoria
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
- Traveling Cartographer's Parchment & Charcoal Sticks""",
            setting="""The ancient mountain sanctuary of Eldoria lies swallowed deep within the Whispering Woods. Once a grand redoubt of the Sun Elves, its stone gates were sealed centuries ago during the Cataclysm of the Pale Moon to contain a cosmic rift. Cold mountain mist rolls through ruined pillars; the air smells of crushed pine needles, damp granite, and faint ozone. Deep within the ruins, rhythmic violet luminescence pulses from ancient monoliths.

Atmosphere & Flora:
- Whisper-Moss: Luminescent moss that rustles when vibrations pass over it, acting as a natural chime.
- Spectral Lanterns: Residual arcane wisps floating over sunken plazas at twilight.
- Timber-Stalkers: Chitin-plated woodland predators prowling the outer forest perimeter.""",
            factions="""- The Sylvan Wardens: A cloistered order of elven rangers and druids sworn by blood oath to keep Eldoria permanently sealed. They view any intrusion as an existential threat to the forest ecosystem.
- The High Arcane Conclave of Oakhaven: Imperial scholars and battle-mages seeking ancient conduits to replenish dying magical engines in the capital.
- The Gilded Talon Mercenary Company: Pragmatic sellswords hired by antiquities dealers to recover relics, seeking profit with minimal loss of life.""",
            conflicts="""- The territorial standoff between the Sylvan Wardens and the Conclave expeditions at the edge of the woods.
- Friction between local provincial herbalists and imperial scholars clear-cutting enchanted brier groves.
- Mercenary tensions between impatient sellsword veterans and academic patrons demanding cautious preservation.""",
            historical_facts="""- Three centuries ago, the Cataclysm of the Pale Moon caused planar fissures across the northern mountains.
- Eldoria was sealed by a historic covenant between the Sun Elves and the First Forest Circle.
- The sanctuary architecture consists of seamless pale granite, carved directly from Mount Sael's bedrock.""",
            lorebook="""## The Setting: Eldoria Ruins
Once a grand mountain sanctuary of the ancient Sun Elves, swallowed by the Whispering Woods. Cold mountain mist rolls through ruined pillars; rhythmic violet luminescence pulses from the inner sanctuary.

## Factions
- The Sylvan Wardens: Elven rangers sworn to keep the ruins sealed.
- The High Arcane Conclave of Oakhaven: Imperial scholars seeking ancient power sources.
- The Gilded Talon Company: Pragmatic sellswords hired to plunder relics.

## Incidental Flora & Fauna
- Whisper-Moss: Rustles when stepped on.
- Spectral Lanterns: Residual wisps over sunken plazas.
- Timber-Stalkers: Chitinous predators of the outer woods.""",
            master_journal="""[CAMPAIGN CONTEXT & ATMOSPHERE]
- Evelyn operates around the ancient moss-grown redoubts of Eldoria as twilight descends over the Whispering Woods.
- Cold mountain mist rolls through ruined pillars; the air smells of crushed pine needles, damp granite, and ozone.
- Soft violet pulses emanate from deep within the ruins, causing Evelyn's silver pendant to hum with resonant warmth.

[ACTIVE FACTIONS & SCHEMES]
1. The Sylvan Wardens
   - Strategic Goal: Preserve the ancient seal of Eldoria at all costs and prevent outside contamination.
   - Active Operation & Timeline: Patrol the outer brier boundaries; warding rune maintenance before the solstice.
   - Physical Bottlenecks & Dependencies: Boundary wardstones and ancient heartwood totems.
   - Current Knowledge & Blind Spots: Wary of imperial scholars; currently unaware of the protagonist's specific botanical cover. [Standing: Tier 2 - Distrustful / Guarded].

2. The High Arcane Conclave of Oakhaven
   - Strategic Goal: Tap into Eldoria's ancient conduits to replenish dying magical engines in the capital.
   - Active Operation & Timeline: Setting up forward excavation camps near the forest perimeter.
   - Physical Bottlenecks & Dependencies: Runic breach-spikes and planar stabilization anchors.
   - Current Knowledge & Blind Spots: Believe the ruins hold an energy engine, unaware of the contained Void entity. [Standing: Tier 3 - Neutral / Transactional].

3. The Gilded Talon Mercenary Company
   - Strategic Goal: Secure salvageable relics and ancient elven gold for private patrons.
   - Active Operation & Timeline: Scouting perimeter ruins and establishing fortified supply lines.
   - Physical Bottlenecks & Dependencies: Local mountain guides and unmapped trail charts.
   - Current Knowledge & Blind Spots: Purely pragmatic, motivated by coin; oblivious to arcane rift hazards. [Standing: Tier 3 - Neutral / Transactional].

[SECRETS & LATENT THREATS]
- The Violet Beacon is not an engine; it is a cage containing "Valithar", a fallen elven solar guardian corrupted by the Void. The Conclave's dispelling runes will shatter the cage rather than harness it.

[CORE DIRECTIVES FOR THE MASTER]
- Maintain rich sensory atmosphere, wilderness mystery, and tactical caution.""",
            default_starting_intent="The sun is setting. I am crouched among the ferns, observing the mossy gateway to Eldoria and searching for fresh tracks before deciding whether to cross the wards.",
            starting_intent="The sun is setting. I am crouched among the ferns, observing the mossy gateway to Eldoria and searching for fresh tracks before deciding whether to cross the wards."
        ),
        player_persona=PlayerPersona(
            short_term_goal="Investigate the pulsing violet beacon at the sanctuary gates without triggering forest alarms or provoking the Sylvan Wardens.",
            long_term_goal="Uncover the truth behind the sealed redoubts of Eldoria and protect the woodland balance from reckless imperial excavation.",
            mindset="Patient, observant, reverent toward natural and ancient seals; distrustful of imperial politics, prefers non-lethal stealth and de-escalation.",
            playstyle="cautious_investigator",
            flaws_and_fears="Dreads ancient Void contamination; hesitates to harm woodland guardians even when under pressure."
        )
    )

def get_sector7_template() -> Story:
    return Story(
        id='sector7',
        type='template',
        title='Sector 7: Neon Drift',
        genre='Cyberpunk',
        synopsis='Rain pours over the towering neon monoliths of Sector 7. As a rogue decker, you hold a datachip that megacorporations would burn cities to retrieve.',
        language='English',
        narrative_propensity='cinematic',
        dynamic_state=DynamicState(
            character_sheet="""Name: Kaelen Vex
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
- Encrypted military-grade Datachip ("Project Lazarus")""",
            setting="""Sector 7 ("The Sump") is the rain-drenched underbelly of Neo-Kyoto. Immense corporate skyscrapers pierce the toxic cloud layer above, casting the lower city into perpetual neon-lit darkness. Acidic rain puddles reflect flickering holographic advertisements for synthetic noodles and memory-wipes. Steam rises from sewer vents, mixing with frying synthetic oils and industrial smog.""",
            factions="""- Shin-Megacorp Sec-Ops: Highly disciplined corporate enforcement units executing kill-or-capture retrieval orders.
- Null-Vector: An underground hacker collective in abandoned transit tunnels advocating for radical information liberation.
- The Rust Syndicate: The dominant street cyber-yakuza controlling clandestine clinics, pawnshops, and smuggled electronics.
- Precinct 9 Municipal Police: Chronic under-funded, corrupt officers taking bribes and staying out of corporate firefights.""",
            conflicts="""- The corporate manhunt for the stolen "Project Lazarus" datachip turning Sector 7 into a militarized zone.
- Asymmetric friction between subterranean hacker collectives leaking corporate assets and security black-ops squads executing sweeps.
- Power struggles between street gangs and the Rust Syndicate over territory around black clinics.""",
            historical_facts="""- The Great Data Crash of '88 fragmented the old public internet into corporate sovereign intranets.
- Sector 7 was originally a logistics freight district before being buried under the upper residential platforms.
- The Neo-Kyoto Covenant grants megacorporations absolute sovereign immunity within their corporate zones.""",
            lorebook="""## The Setting: Sector 7 ("The Sump")
The rain-drenched underbelly of Neo-Kyoto. Corporate monoliths tower into toxic smog while neon-lit alleys host street-level commerce and clandestine cyber-clinics.

## Factions
- Shin-Megacorp Sec-Ops: Elite corporate recovery teams.
- Null-Vector: Underground revolutionary hacker network.
- The Rust Syndicate: Street cyber-yakuza.
- Precinct 9: Cynical municipal police force.""",
            master_journal="""[CAMPAIGN CONTEXT & ATMOSPHERE]
- Kaelen operates in Sector 7 ("The Sump"), the rain-drenched underbelly of Neo-Kyoto.
- Acidic rain, flickering neon advertisements, distant search drone whines, steam rising from sewer grates.
- The stolen "Project Lazarus" datachip is in Kaelen's possession, undergoing decryption.

[ACTIVE FACTIONS & SCHEMES]
1. Shin-Megacorp Sec-Ops
   - Strategic Goal: Retrieve Project Lazarus at all costs and eliminate all rogue handlers.
   - Active Operation & Timeline: Grid-by-grid signal sweeps and biometric checkpoints in lower Sector 7.
   - Physical Bottlenecks & Dependencies: Local relay uplinks and subnet packet sniffers.
   - Current Knowledge & Blind Spots: Know the datachip is in Sector 7; do not yet know Kaelen's cover alias as Derrick Vance. [Standing: Tier 1 - Hostile].

2. Null-Vector
   - Strategic Goal: Intercept and liberate corporate data to expose megacorp crimes to the public.
   - Active Operation & Timeline: Monitoring police frequencies and tapping black-clinic networks.
   - Physical Bottlenecks & Dependencies: Secure proxy nodes and trusted physical runners.
   - Current Knowledge & Blind Spots: Scented a major data breach; trying to locate the decker before Sec-Ops. [Standing: Tier 3 - Neutral / Opportunistic].

3. The Rust Syndicate
   - Strategic Goal: Control illicit cyber-clinics and black-market trade in Sector 7 without drawing full corporate military raids.
   - Active Operation & Timeline: Enforcing turf protection and taxing clandestine safehouses.
   - Physical Bottlenecks & Dependencies: Back-alley clinic networks and smuggled military cyberware.
   - Current Knowledge & Blind Spots: Cautious about corporate activity; willing to fence high-value tech for exorbitant cuts. [Standing: Tier 3 - Neutral / Transactional].

[SECRETS & FACTION TENSIONS]
- Fixer Blue's debt is owed directly to Shin-Megacorp's regional security chief; she is caught between protecting Kaelen and clearing her debt.
- Null-Vector has sleeper agents inside Precinct 9 police dispatch.

[CORE DIRECTIVES FOR THE MASTER]
- Fast-paced, gritty cyberpunk realism, electronic hums, neon shadows, and high stakes.""",
            default_starting_intent="I am holed up in my neon capsule room. Acid rain lashes against the glass as my cyberdeck decrypts the datachip stolen from Shin-Megacorp.",
            starting_intent="I am holed up in my neon capsule room. Acid rain lashes against the glass as my cyberdeck decrypts the datachip stolen from Shin-Megacorp."
        ),
        player_persona=PlayerPersona(
            short_term_goal="Decrypt the Project Lazarus datachip and set up proxy relays to mask my electronic footprint from corporate sniffers.",
            long_term_goal="Expose Shin-Megacorp's illegal biometric experiments and secure enough leverage to buy permanent immunity from corporate tracking.",
            mindset="Cynical, street-smart, paranoid of surveillance; protects street allies only when trust is earned, prioritizes survival and operational secrecy.",
            playstyle="cynical_mercenary",
            flaws_and_fears="Suffers anxiety when disconnected from data nets; deeply suspicious of authority figures offering easy solutions."
        )
    )

def get_deepice_template() -> Story:
    return Story(
        id='deepice',
        type='template',
        title='The Deep Ice',
        genre='Sci-Fi / Horror',
        synopsis="On Europa's frozen ocean, your mining outpost drilled deeper than ever before. Yesterday, the drill stopped. Today, something started tapping back.",
        language='English',
        narrative_propensity='cinematic',
        dynamic_state=DynamicState(
            character_sheet="""Name: Dr. Isaac Clarke
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
- Emergency Flare Sticks (x3) & Medical Sedative Injectors (x2)""",
            setting="""Outpost Boreas is a titanium modular research station anchored 4 kilometers beneath Europa's surface ice, hanging directly above a pitch-black, hyper-pressurized subterranean ocean. Temperatures outside heated modules drop to -60°C. The station creaks continuously under massive tidal friction generated by Jupiter's gravity. Condensation freezes on the interior of pressure visors, and the hum of thermal scrubbers fills every corridor.""",
            factions="""- United Space Alliance Station Administration: Corporate executives focused on meeting extraction quotas and enforcing containment protocols.
- The Roughneck Drilling Crew: Experienced deep-crust drillers who prioritize station survival and fear catastrophic ice collapses.
- The Xenobiology Research Team: Scientists torn between scientific discovery and growing dread over anomalous psychological symptoms spreading through the crew.""",
            conflicts="""- The corporate mandate to keep the borehole open versus the drilling crew's demand to seal Shaft 4 immediately.
- Psychological strain caused by mathematically structured acoustic vibrations humming continuously through the station's hull.
- Communication delays of over forty minutes isolating the crew from Earth command.""",
            historical_facts="""- Outpost Boreas was commissioned twelve years ago during the Jovian Mineral Initiative.
- Europa's ice shell floats atop an ocean estimated to be over one hundred kilometers deep.
- Shaft 4 reached an unprecedented depth into a warm hydrothermal chimney vent yesterday morning.""",
            lorebook="""## The Setting: Outpost Boreas
Deep-crust modular outpost on Europa, four kilometers beneath the ice shell. Groans under Jupiter's gravitational tidal pull.

## Factions
- Station Command: Corporate officials enforcing strict extraction orders.
- Drilling Crew: Industrial miners on the verge of mutiny over safety concerns.
- Scientific Division: Researchers investigating anomalous sub-ice acoustics.""",
            master_journal="""[CAMPAIGN CONTEXT & ATMOSPHERE]
- Outpost Boreas is anchored 4 kilometers beneath Europa's surface ice above a pitch-black subterranean ocean.
- Temperatures drop to -60°C outside; the station creaks continuously under Jupiter's gravitational tidal friction.
- Shaft 4 has reached deep hydrothermal vents, where rhythmic acoustic pulses hum through the ice.

[ACTIVE FACTIONS & SCHEMES]
1. Station Administration
   - Strategic Goal: Maintain mining quotas and enforce strict corporate quarantine protocols.
   - Active Operation & Timeline: Preparing automated core extraction despite anomalous telemetry.
   - Physical Bottlenecks & Dependencies: Central station power grid and communication relay.
   - Current Knowledge & Blind Spots: Dismissing crew psychological reports as standard cabin fever. [Standing: Tier 3 - Neutral / Bureaucratic].

2. The Roughneck Drilling Crew
   - Strategic Goal: Station structural survival and preventing catastrophic ice fractures.
   - Active Operation & Timeline: Demanding emergency shutoff of Shaft 4 and inspecting thermal stress seals.
   - Physical Bottlenecks & Dependencies: Heavy plasma torches and pressure hatch hydraulics.
   - Current Knowledge & Blind Spots: Terrified of hull breach, superstitious about sub-ice sounds. [Standing: Tier 4 - Favorable / Guarded Respect].""",
            default_starting_intent="I am standing in the observation bay overlooking the borehole of Shaft 4, datapad in hand, listening to the acoustic resonance scanner.",
            starting_intent="I am standing in the observation bay overlooking the borehole of Shaft 4, datapad in hand, listening to the acoustic resonance scanner."
        ),
        player_persona=PlayerPersona(
            short_term_goal="Calibrate acoustic sensors along Shaft 4 bulkhead to confirm whether the tapping is mechanical resonance or biological.",
            long_term_goal="Secure the structural integrity of Outpost Boreas and prevent a catastrophic subterranean hull breach.",
            mindset="Methodical, empirical, driven by hard diagnostic telemetry; fights claustrophobia through rigid adherence to scientific protocol.",
            playstyle="cautious_investigator",
            flaws_and_fears="Severe claustrophobia; haunted by nightmares of being trapped in pitch-black sub-glacial ocean waters."
        )
    )

def get_collective_flame_template() -> Story:
    return Story(
        id='collective-flame',
        type='template',
        title='The Collective Flame',
        genre='High Fantasy / Arcane Mystery',
        synopsis='Settled in the vibrant canal metropolis of Valoria for nearly a year under the mortal cover of Kael and Leonor, the Collective Flame—husband and wife, legendary sorcerer and sorceress whose souls unified into a single primordial flame centuries ago—enjoy the warm, colorful simplicity of their mortal life. Kael runs a modest apothecary as an arcane healer and herbalist, while Leonor is a respected sensitive who consoles spirits and families in mourning. A century after staging their legendary "Scission" to escape cosmic cartels and inquisitorial grasp, they rediscover themselves as two young mages in love, surrounded by colorful neighbors and street friends. But when unusual magical anomalies, rogue relics, and whispers of ancient shadows ripple across the city, they must use their mortal wits, street ties, and subtle magic to preserve the Balance—without blowing their cover or destroying the cozy life they have come to cherish.',
        language='English',
        narrative_propensity='literary',
        dynamic_state=DynamicState(
            character_sheet="""Name: The Collective Flame (Public Mortal Identities: Kael & Leonor — Husband and Wife)
True Nature: A unified primordial consciousness and soul residing simultaneously within two distinct, independent physical bodies. Centuries ago, Kizag (a sorcerer) and Lyra (a sorceress) met as wanderers, faced countless perils together, fell deeply in love, and married. Over epochs of profound spiritual harmony, their two souls fused into the Collective Flame. They have been husband and wife for centuries, romantic life companions, and STRICTLY NOT siblings or twins.

Mortal Life in Valoria (Settled for nearly a year):
They live and work in the working-class lower canals district, on the ground floor of an ancient stone building overlooking the water ("The Willow Apothecary"). They genuinely cherish this ordinary mortal life and revel in rediscovering themselves as young newlyweds in the mortal world.

The Two Vessels & Daily Roles:
1. Kizag ("Kael"):
   - Appearance: Young man with sharp eyes, a crooked grin, and perpetually tousled dark hair, wearing working wool tunics and a soft leather apron.
   - Public Role: Independent Herbalist and Arcane Healer. Not a pious cleric devoted to a deity, but an adept arcanist who channels the current of Life. He mends broken bones, soothes fevers with subtle vital infusions, and brews medicinal salves.
   - Traits: Chaotic, quick-witted, ironic, in perpetual methodological contrast with the haughty apothecaries and alchemists of the Academy. Wears an ancient, well-balanced shortsword at his hip.

2. Lyra ("Leonor"):
   - Appearance: Attractive, composed, and observant young woman with piercing hazel eyes, a dark braid, and a mischievous half-smile.
   - Public Role: Manuscript Archivist and gentle Sensitive / Funerary Necromancer. She communes with departed spirits to settle unresolved regrets, consoles grieving families, dispels minor domestic hauntings, and blesses burial grounds.
   - Traits: Methodical, analytical, with razor-sharp, dry wit. Conceals two curved daggers inside her sleeves.

Couple Dynamics & Charm:
- Both are charming, charismatic young people with playful telepathic banter between husband and wife.
- They love each other with absolute centuries-long devotion and tenderness.

Neighborhood Friends & Acquaintances:
- Master Tarek: The half-orc innkeeper of "The Copper Boar". Gruff, jovial, fiercely proud of his spicy mutton stew.
- Sofi: A streetwise orphan runner who knows every rumor and canal murmur.
- Brother Julian: A gentle young cleric of the Order of the Solar Flame, visibly charmed by Leonor.

Dormant Primordial Capabilities (The Secrecy Challenge):
- Total Telepathic Synthesis: Instant, continuous sharing of thoughts, senses, and emotional states.
- Subtle Everyday Magic: Minor cantrips, subtle kinetic nudges, spirit sensing, and vital resonance used casually as mundane apprentice-level tricks.
- Why They Restrain Themselves: Revealing their true divine nature would summon ancient cosmic powers and shatter their cozy peace in Valoria.""",
            setting="""The Realm of Balance is a vibrant, classic, pre-industrial High Fantasy world where magic permeates every tier of everyday life.

Valoria, the City of Bridges and Canals:
- A picturesque, bustling river metropolis: monumental arched marble bridges, paved alleys lit by wrought-iron lanterns, alchemy shops, masted river barges, and colorful open-air markets.
- Common and Visible Magic: Magic is not a sequestered elite secret; it is woven into the city's daily fabric. Townsfolk use minor elemental sparks to light hearths, arcane healers practice openly, and river wisps dance over the water on foggy evenings.
- Organic Diversity: Humans, half-orcs, elves, dwarves, beast-kin, and sylphs live together as respected citizens and artisans without monolithic racial divides.
- Strictly Pre-Industrial & Arcane: Absolutely NO steam technology, industrial runoff, modern metal pumps, chemical factories, or modern municipal bureaucracy.""",
            factions="""1. The Academy of Channelers (Valoria's Arcane Guild):
   - A sprawling, diverse magical university. Under the Shadow Charter, ethical funerary necromancy is legal and respected.
2. The Order of the Solar Flame (The Church of Light):
   - A vast faith housing merciful shepherds (Brother Julian), dogmatic scholars, and monster-slaying paladins.
3. Street Life & Freelancers:
   - River merchant guilds, independent alchemists, traveling bards, hedge-healers, and canal runners.
4. The Keepers of the Dual Veil:
   - Peaceful custodians seeking harmony between life and death, venerating the legendary Collective Flame.
5. The Obsidian Watchers (Deep Shadows):
   - Ancient fellowship of immortal archivists monitoring superhuman anomalies and avatar manifestations.
6. The Tyrant's Ashes (Fractured Cults):
   - Splinter covens seeking remnant vampiric relics from the tyrant defeated a century ago.""",
            conflicts="""- District & Everyday Life: Local cutpurses testing their luck against the shop; rivalries with pompous Academy apothecaries; bashful suitors orbiting Leonor or Kael.
- Arcane Mysteries: Restless river spirits in sunken vaults; cursed relics fished out of canals; rogue apprentice experiments.
- The Cover Dilemma: Resolving local dilemmas with mortal wits, street ties, and subtle magic without triggering cosmic scrutiny from the Obsidian Watchers.""",
            historical_facts="""- One century ago, the Collective Flame staged their tragic public "Scission" to escape cosmic cartels and divine inquisition courts.
- The Scission is commemorated annually in Valoria with a vibrant civic festival of theatre and canal lantern dances.
- Nearly a year ago, Kizag and Lyra quietly returned to mortal society as Kael and Leonor, finding contentment in their neighborhood shop.""",
            lorebook="""## Setting: Valoria & The Realm of Balance
A vibrant High Fantasy canal metropolis of arched marble bridges, magic shops, and river barges. Magic is common, visible, and part of everyday life.

## Protagonists: Kael & Leonor
Husband and wife for centuries and mortal vessels of the Collective Flame, living for nearly a year at The Willow Apothecary. Kael is an independent arcane healer and herbalist; Leonor is an archivist and gentle funerary sensitive.

## Neighborhood Acquaintances
- Master Tarek: Gruff, warm-hearted half-orc innkeeper of "The Copper Boar".
- Sofi: Quick-witted canal orphan and errand runner.
- Brother Julian: Earnest, gentle young solar cleric, openly captivated by Leonor.

## Major Powers
- The Academy of Channelers: Diverse magical university; ethical necromancy is legal.
- The Order of the Solar Flame: Nuanced church of light.
- Keepers of the Dual Veil: Peaceful custodians of balance.
- The Obsidian Watchers: Secret chroniclers hunting superhuman anomalies.
- The Tyrant's Ashes: Fractured covens seeking remnant vampiric relics.""",
            master_journal="""[CAMPAIGN CONTEXT & ATMOSPHERE]
- Kael and Leonor live and work at The Willow Apothecary in the lower canals district of Valoria. The shop smells of dried mint, spruce resin, and beeswax candles.
- Both are the mortal vessels of the Collective Flame, deeply in love and united in soul for centuries, dedicated to protecting their cozy neighborhood life without leaking their divine cosmic nature.

[ACTIVE FACTIONS & SCHEMES]
1. The Tyrant's Ashes (Willow Canal Cell)
   - Strategic Goal: Awaken dormant bloodline conduits beneath the city to restore their fallen matriarch.
   - Active Operation & Timeline: Conducting clandestine rites in sunken crypts beneath the canal locks.
   - Physical Bottlenecks & Dependencies: Necrotic blood reagents, shadow-etched bone foci, and midnight tide windows.
   - Current Knowledge & Blind Spots: Operating in secret; entirely unaware of Kael and Leonor's true primordial identities. [Standing: Tier 1 - Hostile / Latent Threat].

2. Order of the Solar Flame (Local Canal Parish)
   - Strategic Goal: Maintain spiritual purity, dispense charity, and root out dark superstition along the canal slums.
   - Active Operation & Timeline: Routine parish rounds, market blessings, and aid for the impoverished (such as Brother Julian).
   - Physical Bottlenecks & Dependencies: Chapel sanctification censers, soothing incense supplies, and limited district clergy.
   - Current Knowledge & Blind Spots: Respect Kael and Leonor as skilled local apothecaries. [Standing: Tier 4 - Favorable / Guarded Respect].

3. The Academy of Channelers (Valoria's Arcane Guild)
   - Strategic Goal: Regulate civic magical commerce and maintain guild dominance over potions and scrolls.
   - Active Operation & Timeline: Periodic informal inspections of hedge-shops and academic debates.
   - Physical Bottlenecks & Dependencies: Guild licensure registries and rigid formal formulas.
   - Current Knowledge & Blind Spots: Condescendingly view Kael as a lucky hedge-healer, oblivious to his true arcane mastery. [Standing: Tier 3 - Neutral / Transactional].

[SECRETS & LATENT THREATS]
- The Obsidian Watchers constantly scan the city for reality-bending anomalies or immortal avatars.
- Revealing the true divine nature of the Collective Flame would summon ancient cosmic powers and destroy their cherished peace.

[CORE DIRECTIVES FOR THE MASTER]
- Make high fantasy magic feel tangible, vibrant, and pre-industrial (strictly no modern industrial anachronisms).
- Celebrate the couple's personal charm, affectionate telepathic banter, and warm bonds with neighbors (Master Tarek, Sofi, Julian).
- Encourage practical herbalism, clever mortal ingenuity, diplomacy, and subtle magic rather than overt cosmic displays.""",
            default_starting_intent="It is a quiet morning at the Willow Apothecary. Kael is finishing preparing an ointment while Leonor catalogs funeral manuscripts, enjoying the peace of our neighborhood.",
            starting_intent="It is a quiet morning at the Willow Apothecary. Kael is finishing preparing an ointment while Leonor catalogs funeral manuscripts, enjoying the peace of our neighborhood."
        ),
        player_persona=PlayerPersona(
            short_term_goal="Serve neighborhood visitors at the Willow Apothecary, check in with Sofi for canal gossip, and handle minor ailments without raising suspicion.",
            long_term_goal="Safeguard the magical Balance in Valoria and protect our cozy mortal marriage from cosmic scrutiny.",
            mindset="Playful, affectionate, compassionate, razor-witted; protective of neighborhood friends; strictly avoid overt god-level magic.",
            playstyle="diplomatic_socialite",
            flaws_and_fears="Dread exposing their divine primordial nature, which would destroy the warm mortal life they cherish."
        )
    )

TEMPLATES: Dict[str, Story] = {
    'eldoria': get_eldoria_template(),
    'sector7': get_sector7_template(),
    'deepice': get_deepice_template(),
    'collective-flame': get_collective_flame_template(),
    'collective_flame': get_collective_flame_template(),
    'collectiveflame': get_collective_flame_template(),
}

def load_template(name_or_path: str, language: Optional[str] = None) -> Story:
    key = name_or_path.lower().strip()
    if key in TEMPLATES:
        story = TEMPLATES[key]
        target_lang = language or story.language or 'English'
        return Story(
            id=story.id,
            type=story.type,
            title=story.title,
            genre=story.genre,
            synopsis=story.synopsis,
            language=target_lang,
            narrative_propensity=story.narrative_propensity,
            dynamic_state=DynamicState(
                character_sheet=story.dynamic_state.character_sheet,
                lorebook=story.dynamic_state.lorebook,
                master_journal=story.dynamic_state.master_journal,
                master_feedback=story.dynamic_state.master_feedback,
                setting=story.dynamic_state.setting,
                factions=story.dynamic_state.factions,
                conflicts=story.dynamic_state.conflicts,
                historical_facts=story.dynamic_state.historical_facts,
                default_starting_intent=story.dynamic_state.default_starting_intent,
                starting_intent=story.dynamic_state.starting_intent
            ),
            player_persona=PlayerPersona(
                short_term_goal=story.player_persona.short_term_goal,
                long_term_goal=story.player_persona.long_term_goal,
                mindset=story.player_persona.mindset,
                playstyle=story.player_persona.playstyle,
                flaws_and_fears=story.player_persona.flaws_and_fears,
                scratchpad=list(story.player_persona.scratchpad)
            ),
            messages=[]
        )
    
    # Try reading as JSON file
    with open(name_or_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        ds_raw = data.get('dynamicState', data.get('dynamic_state', {}))
        ds = DynamicState(
            character_sheet=ds_raw.get('characterSheet', ds_raw.get('character_sheet', '')),
            lorebook=ds_raw.get('lorebook', ''),
            master_journal=ds_raw.get('masterJournal', ds_raw.get('master_journal', '')),
            master_feedback=ds_raw.get('masterFeedback', ds_raw.get('master_feedback', '')),
            setting=ds_raw.get('setting', ''),
            factions=ds_raw.get('factions', ''),
            conflicts=ds_raw.get('conflicts', ''),
            historical_facts=ds_raw.get('historicalFacts', ds_raw.get('historical_facts', '')),
            default_starting_intent=ds_raw.get('defaultStartingIntent', ds_raw.get('default_starting_intent', '')),
            starting_intent=ds_raw.get('startingIntent', ds_raw.get('starting_intent', ''))
        )
        pp_raw = data.get('playerPersona', data.get('player_persona', {}))
        persona = PlayerPersona(
            short_term_goal=pp_raw.get('shortTermGoal', pp_raw.get('short_term_goal', '')),
            long_term_goal=pp_raw.get('longTermGoal', pp_raw.get('long_term_goal', '')),
            mindset=pp_raw.get('mindset', ''),
            playstyle=pp_raw.get('playstyle', 'balanced'),
            flaws_and_fears=pp_raw.get('flawsAndFears', pp_raw.get('flaws_and_fears', '')),
            scratchpad=pp_raw.get('scratchpad', [])
        )
        target_lang = language or data.get('language', 'English')
        return Story(
            id=data.get('id', 'custom_story'),
            type='template',
            title=data.get('title', 'Custom Tale'),
            genre=data.get('genre', 'Adventure'),
            synopsis=data.get('synopsis', ''),
            language=target_lang,
            narrative_propensity=data.get('narrativePropensity', data.get('narrative_propensity', 'balanced')),
            dynamic_state=ds,
            player_persona=persona,
            messages=[]
        )
