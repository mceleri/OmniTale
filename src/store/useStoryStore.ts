import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';

export interface Message {
  id: string;
  sender: 'master' | 'player';
  text: string;
  timestamp: string;
}

export interface LoreItem {
  id: string;
  title: string;
  content: string;
}

export interface Adventure {
  id: string;
  title: string;
  description: string;
  characterName: string;
  genre?: string;
  characterSheet: string;
  lorebook: LoreItem[];
  masterJournal: string;
  masterFeedback: string;
  messages: Message[];
  lastPlayed: string;
}

interface StoryState {
  currentView: 'home' | 'story' | 'settings';
  savedStories: Adventure[];
  activeStoryId: string | null;
  // Active story state duplicates (for ease of direct binding in views)
  messages: Message[];
  characterSheet: string;
  lorebook: LoreItem[];
  masterJournal: string;
  masterFeedback: string;
  
  // Settings
  llmUrl: string;
  llmKey: string;
  
  // Actions
  setView: (view: 'home' | 'story' | 'settings') => void;
  selectStory: (storyId: string) => void;
  createStory: (title: string, description: string, characterName: string, genre: string) => void;
  deleteStory: (storyId: string) => void;
  addMessage: (sender: 'master' | 'player', text: string) => void;
  updateCharacterSheet: (text: string) => void;
  updateMasterJournal: (text: string) => void;
  updateMasterFeedback: (text: string) => void;
  addLoreItem: (title: string, content: string) => void;
  deleteLoreItem: (itemId: string) => void;
  updateLlmSettings: (url: string, key: string) => void;
}

const initialStories: Adventure[] = [
  {
    id: 'eldoria',
    title: 'The Whispers of Eldoria',
    description: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    characterName: 'Evelyn the Ranger',
    genre: 'Fantasy',
    characterSheet: 'Name: Evelyn of Eldoria\nClass: Ranger / Scout\nLevel: 3\n\nAttributes:\n- Strength: 11\n- Dexterity: 16\n- Constitution: 12\n- Intelligence: 14\n- Wisdom: 15\n- Charisma: 10\n\nEquipment:\n- Recurve Bow of Elm\n- Leather Jerkin\n- Silver Elven Pendant\n- Ranger\'s Survival Kit',
    lorebook: [
      {
        id: '1',
        title: 'Eldoria Ruins',
        content: 'Once a grand temple sanctuary of the Sun Elves, now swallowed by the Whispering Woods. It is said a rift in the weave of magic lies deep in its heart.'
      },
      {
        id: '2',
        title: 'The Violet Beacon',
        content: 'A crystalline pillar at the center of the ruins. It has glowed with a soft, pulsing light since the Great Eclipse, drawing travelers close.'
      }
    ],
    masterJournal: '// Master AI Notes - Eldoria Adventure\n// Act 1: The Gates of Eldoria\n- Player has arrived at the exterior gate.\n- Theme: Eldritch fantasy, ancient secrets.\n- Key Encounter: Crystalline Guardian at the inner courtyard.\n- Lore hint: The violet light is feeding on nearby life force.',
    masterFeedback: 'Keep the atmosphere dark, descriptive, and mysterious. Emphasize sensory details like damp air, ancient moss, and hums.',
    messages: [
      {
        id: '1',
        sender: 'master',
        text: 'Welcome to OmniTale. Your solo RPG adventure begins now.\n\nThe damp, cool mist of the Whispering Woods clings to your cloak as you stand before the towering, moss-draped gates of Eldoria. For centuries, this place was declared forbidden. Yet, here you are, guided by the recurring dream of a violet beacon.\n\nThe stone archway is cracked, and a faint hum vibrates through the damp air. Inside, a violet light pulses gently, casting long, dancing shadows.\n\nHow do you proceed, Ranger?',
        timestamp: '10:00 AM'
      },
      {
        id: '2',
        sender: 'player',
        text: 'I check the gate for traps or magical runes, keeping my hand close to my recurve bow.',
        timestamp: '10:01 AM'
      },
      {
        id: '3',
        sender: 'master',
        text: 'You approach the gate stealthily, your eyes scanning the ancient masonry. Near the base of the left pillar, you spot faint Elven glyphs. They glow with a dull, amber warmth—an alarm rune, sleeping but active.\n\nTo bypass it, you could try to scrape a vital intersection of the rune off with your dagger, or look for an alternative path over the collapsed western wall.\n\nWhat is your choice?',
        timestamp: '10:03 AM'
      }
    ],
    lastPlayed: '2 hours ago'
  },
  {
    id: 'sector7',
    title: 'Sector 7: Neon Drift',
    description: 'Rain pours over the towering neon monoliths of Sector 7. As a rogue decker, you hold a datachip that megacorporations would burn cities to retrieve.',
    characterName: 'Kaelen Vex',
    genre: 'Cyberpunk',
    characterSheet: 'Name: Kaelen Vex\nRole: Rogue Decker\nCreds: 1,450\n\nAugmentations:\n- Neuro-Link V4 (Neural Jack)\n- Synthetic Cyber-Eye (Thermal/IR)\n- Subdermal Armor Plate\n\nGear:\n- Arasaka Custom Cyberdeck\n- Monomolecular Dagger\n- Silenced heavy pistol (9mm)',
    lorebook: [
      {
        id: '1',
        title: 'Sector 7 Underbelly',
        content: 'The low-life district of Neo-Tokyo. Sprawling slums shaded by massive corporate towers of Shin-Megacorp. Law enforcement is highly corrupt.'
      },
      {
        id: '2',
        title: 'The Red Chip',
        content: 'An encrypted, military-grade storage medium recovered from a downed high-security courier. Rumored to hold files on "Project Lazarus".'
      }
    ],
    masterJournal: '// Master AI Notes - Sector 7 Cyberpunk\n// Act 1: The Safehouse Siege\n- Player is currently hiding in a capsule hotel room.\n- Corporate agents are scanning the grid for the chip\'s local signature.\n- Next Beat: A local fixer named \'Blue\' offers help, but she might be a double agent.',
    masterFeedback: 'Use high-tech, low-life slang. Grid-runs, cyber-enhancements, cold rain, neon lights, corporate threats.',
    messages: [
      {
        id: '1',
        sender: 'master',
        text: 'The neon reflection of Sector 7 dances on the wet concrete. You are inside a cramped, synthetic-smelling capsule room at the "Midnight Rest" hotel. The hum of the cheap ventilation is drowned out by the heavy rain outside.\n\nIn your hand, the Red Chip feels warm. You just booted up your cyberdeck, and the virtual console displays a grid-wide lockdown warning. They are searching for you.\n\nSuddenly, the power in your corridor cuts out. Total darkness, save for the cold blue glow of your deck.\n\nWhat is your move?',
        timestamp: '11:15 PM'
      }
    ],
    lastPlayed: 'Yesterday'
  },
  {
    id: 'deepice',
    title: 'The Deep Ice',
    description: 'On Europa\'s frozen ocean, your mining outpost drilled deeper than ever before. Yesterday, the drill stopped. Today, something started tapping back.',
    characterName: 'Dr. Isaac Clarke',
    genre: 'Sci-Fi',
    characterSheet: 'Name: Dr. Isaac Clarke\nRole: Lead Xenogeologist\nSanity: 78%\n\nEquipment:\n- Thermal Hardsuit (Level 2)\n- Industrial Plasma Cutter\n- Handheld Spectrometer\n- Portable Oxygen Tank (2 hours remaining)',
    lorebook: [
      {
        id: '1',
        title: 'Outpost Boreas',
        content: 'The deep-crust drilling station established by United Space Alliance on Europa. Hovering 4 kilometers below the ice sheet over a pitch-black abyss.'
      }
    ],
    masterJournal: '// Master AI Notes - The Deep Ice\n// Act 1: The Silent Shaft\n- Mood: Intense claustrophobia, isolation, slow dread.\n- Primary hazard: Freezing temperatures, power outages.\n- Entity behavior: Communicates through acoustic vibrations.',
    masterFeedback: 'Focus on silence, cold, claustrophobia, machinery groans, static over radio, dread of the unknown.',
    messages: [
      {
        id: '1',
        sender: 'master',
        text: 'Outpost Boreas is silent. The structural groans of the 4km-thick ice above you sound like a sleeping beast. In the control module, the monitors flicker with a pale green phosphor.\n\nYour headset crackles with static. Then, a slow, rhythmic tapping sound vibrates through the steel deck beneath your heavy hardsuit boots.\n\nTap... Tap-Tap... Tap-Tap-Tap...\n\nIt is the prime number sequence. It is coming from the drill shaft. The main shaft elevator has just begun ascending from the deep ocean abyss, entirely on its own.\n\nYour move, Doctor.',
        timestamp: '02:40 AM'
      }
    ],
    lastPlayed: 'Last week'
  }
];

// Custom StateStorage using idb-keyval
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      currentView: 'home',
      savedStories: initialStories,
      activeStoryId: null,
      messages: [],
      characterSheet: '',
      lorebook: [],
      masterJournal: '',
      masterFeedback: '',

      llmUrl: '',
      llmKey: '',

      setView: (view) => set({ currentView: view }),

      selectStory: (storyId) => set((state) => {
        const story = state.savedStories.find((s) => s.id === storyId);
        if (!story) return {};

        return {
          currentView: 'story',
          activeStoryId: storyId,
          messages: story.messages,
          characterSheet: story.characterSheet,
          lorebook: story.lorebook,
          masterJournal: story.masterJournal,
          masterFeedback: story.masterFeedback
        };
      }),

      createStory: (title, description, characterName, genre) => set((state) => {
        const newId = 'story_' + Date.now();
        const newStory: Adventure = {
          id: newId,
          title,
          description,
          characterName,
          genre,
          characterSheet: `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`,
          lorebook: [
            {
              id: '1',
              title: 'The Journey Begins',
              content: `This is the lorebook for your journey in "${title}". Record locations, characters, and rules here.`
            }
          ],
          masterJournal: `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`,
          masterFeedback: 'Act as a professional Game Master. Keep descriptions evocative, give choices, and let the character actions matter.',
          messages: [
            {
              id: '1',
              sender: 'master',
              text: `Welcome to ${title}, ${characterName}.\n\nYour journey is a blank page waiting to be written. The world stretches before you, rich with secrets, danger, and opportunity.\n\nDescribe your surroundings, your goal, or how you wish to take your first step into this story...`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          lastPlayed: 'Just now'
        };

        const updatedStories = [newStory, ...state.savedStories];

        return {
          savedStories: updatedStories,
          currentView: 'story',
          activeStoryId: newId,
          messages: newStory.messages,
          characterSheet: newStory.characterSheet,
          lorebook: newStory.lorebook,
          masterJournal: newStory.masterJournal,
          masterFeedback: newStory.masterFeedback
        };
      }),

      deleteStory: (storyId) => set((state) => {
        const updatedStories = state.savedStories.filter((s) => s.id !== storyId);
        
        const wasActive = state.activeStoryId === storyId;
        return {
          savedStories: updatedStories,
          ...(wasActive ? {
            activeStoryId: null,
            currentView: 'home',
            messages: [],
            characterSheet: '',
            lorebook: [],
            masterJournal: '',
            masterFeedback: ''
          } : {})
        };
      }),

      addMessage: (sender, text) => set((state) => {
        if (!state.activeStoryId) return {};

        const newMessage: Message = {
          id: 'msg_' + Date.now() + Math.random().toString(36).substr(2, 4),
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...state.messages, newMessage];

        // Update in savedStories list (in-memory only)
        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              messages: updatedMessages,
              lastPlayed: 'Just now'
            };
          }
          return story;
        });

        // If player sent a message, schedule a mock master response to maintain game-like interactive feel!
        if (sender === 'player') {
          setTimeout(() => {
            const mockResponses = [
              "The darkness deepens as you consider your next move. A chilling breeze echoes down the corridor. What do you do?",
              "Your actions ripple through the surroundings. You sense that your choice has drawn attention. How do you prepare?",
              "You move forward with quiet resolve. The pathway ahead reveals new details: a hidden mechanism, a curious inscription, and an eerie silence. Proceed with caution.",
              "An interesting approach. Your skill and intuition reveal a subtle detail you almost missed. How do you capitalize on this?",
              "The air is thick with tension. As you step forward, you hear a faint click underneath your feet. Silence follows. What is your reaction?"
            ];
            const randomText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            useStoryStore.getState().addMessage('master', randomText);
          }, 1000);
        }

        return {
          messages: updatedMessages,
          savedStories: updatedStories
        };
      }),

      updateCharacterSheet: (text) => set((state) => {
        if (!state.activeStoryId) return {};

        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return { ...story, characterSheet: text };
          }
          return story;
        });

        return {
          characterSheet: text,
          savedStories: updatedStories
        };
      }),

      updateMasterJournal: (text) => set((state) => {
        if (!state.activeStoryId) return {};

        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return { ...story, masterJournal: text };
          }
          return story;
        });

        return {
          masterJournal: text,
          savedStories: updatedStories
        };
      }),

      updateMasterFeedback: (text) => set((state) => {
        if (!state.activeStoryId) return {};

        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return { ...story, masterFeedback: text };
          }
          return story;
        });

        return {
          masterFeedback: text,
          savedStories: updatedStories
        };
      }),

      addLoreItem: (title, content) => set((state) => {
        if (!state.activeStoryId) return {};

        const newItem: LoreItem = {
          id: 'lore_' + Date.now(),
          title,
          content
        };

        const updatedLore = [...state.lorebook, newItem];

        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return { ...story, lorebook: updatedLore };
          }
          return story;
        });

        return {
          lorebook: updatedLore,
          savedStories: updatedStories
        };
      }),

      deleteLoreItem: (itemId) => set((state) => {
        if (!state.activeStoryId) return {};

        const updatedLore = state.lorebook.filter((item) => item.id !== itemId);

        const updatedStories = state.savedStories.map((story) => {
          if (story.id === state.activeStoryId) {
            return { ...story, lorebook: updatedLore };
          }
          return story;
        });

        return {
          lorebook: updatedLore,
          savedStories: updatedStories
        };
      }),

      updateLlmSettings: (url, key) => set(() => {
        return { llmUrl: url, llmKey: key };
      })
    }),
    {
      name: 'omnitale-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        llmUrl: state.llmUrl,
        llmKey: state.llmKey,
      }),
    }
  )
);