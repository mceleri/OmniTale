import type { Story } from './useStoryStore'; 

export const initialStories: Story[] = [
  {
    id: 'eldoria',
    type: 'tale',
    title: 'The Whispers of Eldoria',
    genre: 'Fantasy',
    synopsis: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    dynamicState: {
      characterSheet: 'Name: Evelyn of Eldoria\nClass: Ranger / Scout\nLevel: 3\n\nAttributes:\n- Strength: 11\n- Dexterity: 16\n- Constitution: 12\n- Intelligence: 14\n- Wisdom: 15\n- Charisma: 10\n\nEquipment:\n- Recurve Bow of Elm\n- Leather Jerkin\n- Silver Elven Pendant\n- Ranger\'s Survival Kit',
      lorebook: `## Eldoria Ruins\nOnce a grand temple sanctuary of the Sun Elves, now swallowed by the Whispering Woods. It is said a rift in the weave of magic lies deep in its heart.\n\n## The Violet Beacon\nA crystalline pillar at the center of the ruins. It has glowed with a soft, pulsing light since the Great Eclipse, drawing travelers close.`,
      masterJournal: '// Master AI Notes - Eldoria Adventure\n// Act 1: The Gates of Eldoria\n- Player has arrived at the exterior gate.\n- Theme: Eldritch fantasy, ancient secrets.\n- Key Encounter: Crystalline Guardian at the inner courtyard.\n- Lore hint: The violet light is feeding on nearby life force.',
    },
    messages: [
      {
        id: '1',
        role: 'master',
        content: 'Welcome to OmniTale. Your solo RPG adventure begins now.\n\nThe damp, cool mist of the Whispering Woods clings to your cloak as you stand before the towering, moss-draped gates of Eldoria. For centuries, this place was declared forbidden. Yet, here you are, guided by the recurring dream of a violet beacon.\n\nThe stone archway is cracked, and a faint hum vibrates through the damp air. Inside, a violet light pulses gently, casting long, dancing shadows.\n\nHow do you proceed, Ranger?'
      },
      {
        id: '2',
        role: 'player',
        content: 'I check the gate for traps or magical runes, keeping my hand close to my recurve bow.'
      },
      {
        id: '3',
        role: 'master',
        content: 'You approach the gate stealthily, your eyes scanning the ancient masonry. Near the base of the left pillar, you spot faint Elven glyphs. They glow with a dull, amber warmth—an alarm rune, sleeping but active.\n\nTo bypass it, you could try to scrape a vital intersection of the rune off with your dagger, or look for an alternative path over the collapsed western wall.\n\nWhat is your choice?'
      }
    ],
    createdAt: 1717372800000,
    updatedAt: 1717372800000
  },
  {
    id: 'sector7',
    type: 'tale',
    title: 'Sector 7: Neon Drift',
    genre: 'Cyberpunk',
    synopsis: 'Rain pours over the towering neon monoliths of Sector 7. As a rogue decker, you hold a datachip that megacorporations would burn cities to retrieve.',
    dynamicState: {
      characterSheet: 'Name: Kaelen Vex\nRole: Rogue Decker\nCreds: 1,450\n\nAugmentations:\n- Neuro-Link V4 (Neural Jack)\n- Synthetic Cyber-Eye (Thermal/IR)\n- Subdermal Armor Plate\n\nGear:\n- Arasaka Custom Cyberdeck\n- Monomolecular Dagger\n- Silenced heavy pistol (9mm)',
      lorebook: `## Sector 7 Underbelly\nThe low-life district of Neo-Tokyo. Sprawling slums shaded by massive corporate towers of Shin-Megacorp. Law enforcement is highly corrupt.\n\n## The Red Chip\nAn encrypted, military-grade storage medium recovered from a downed high-security courier. Rumored to hold files on "Project Lazarus".`,
      masterJournal: '// Master AI Notes - Sector 7 Cyberpunk\n// Act 1: The Safehouse Siege\n- Player is currently hiding in a capsule hotel room.\n- Corporate agents are scanning the grid for the chip\'s local signature.\n- Next Beat: A local fixer named \'Blue\' offers help, but she might be a double agent.',
    },
    messages: [
      {
        id: '1',
        role: 'master',
        content: 'The neon reflection of Sector 7 dances on the wet concrete. You are inside a cramped, synthetic-smelling capsule room at the "Midnight Rest" hotel. The hum of the cheap ventilation is drowned out by the heavy rain outside.\n\nIn your hand, the Red Chip feels warm. You just booted up your cyberdeck, and the virtual console displays a grid-wide lockdown warning. They are searching for you.\n\nSuddenly, the power in your corridor cuts out. Total darkness, save for the cold blue glow of your deck.\n\nWhat is your move?'
      }
    ],
    createdAt: 1717286400000,
    updatedAt: 1717286400000
  },
  {
    id: 'deepice',
    type: 'template',
    title: 'The Deep Ice',
    genre: 'Sci-Fi',
    synopsis: 'On Europa\'s frozen ocean, your mining outpost drilled deeper than ever before. Yesterday, the drill stopped. Today, something started tapping back.',
    dynamicState: {
      characterSheet: 'Name: Dr. Isaac Clarke\nRole: Lead Xenogeologist\nSanity: 78%\n\nEquipment:\n- Thermal Hardsuit (Level 2)\n- Industrial Plasma Cutter\n- Handheld Spectrometer\n- Portable Oxygen Tank (2 hours remaining)',
      lorebook: `## Outpost Boreas\nThe deep-crust drilling station established by United Space Alliance on Europa. Hovering 4 kilometers below the ice sheet over a pitch-black abyss.`,
      masterJournal: '// Master AI Notes - The Deep Ice\n// Act 1: The Silent Shaft\n- Mood: Intense claustrophobia, isolation, slow dread.\n- Primary hazard: Freezing temperatures, power outages.\n- Entity behavior: Communicates through acoustic vibrations.',
    },
    messages: [
      {
        id: '1',
        role: 'master',
        content: 'Outpost Boreas is silent. The structural groans of the 4km-thick ice above you sound like a sleeping beast. In the control module, the monitors flicker with a pale green phosphor.\n\nYour headset crackles with static. Then, a slow, rhythmic tapping sound vibrates through the steel deck beneath your heavy hardsuit boots.\n\nTap... Tap-Tap... Tap-Tap-Tap...\n\nIt is the prime number sequence. It is coming from the drill shaft. The main shaft elevator has just begun ascending from the deep ocean abyss, entirely on its own.\n\nYour move, Doctor.'
      }
    ],
    createdAt: 1717200000000,
    updatedAt: 1717200000000
  }
];
