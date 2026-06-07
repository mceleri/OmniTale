import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

export type Role = 'master' | 'player' | 'system_feedback';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface LoreItem {
  id: string;
  title: string;
  content: string;
}

export interface Story {
  id: string;
  type: 'tale' | 'template';
  title: string;
  genre: string;
  synopsis: string;
  dynamicState: {
    characterSheet: string;
    lorebook: string;
    masterJournal: string;
  };
  messages: Message[];
  updatedAt: number; // Used for sorting (last played or last edited)
  createdAt: number;
}

export interface StoryState {
  currentView: 'home' | 'story' | 'settings';
  stories: Story[];
  activeStoryId: string | null;
  // Active story state duplicates (for ease of direct binding in views)
  messages: Message[];
  characterSheet: string;
  lorebook: string;
  masterJournal: string;
  masterFeedback: string;
  
  // Settings
  llmUrl: string;
  llmKey: string;
  modelName: string;

  // Loading States
  isGeneratingStory: boolean;
  isUpdatingLorebook: boolean;
  isUpdatingJournal: boolean;
  
  // Actions
  setView: (view: 'home' | 'story' | 'settings') => void;
  selectStory: (storyId: string) => void;
  createStory: (title: string, synopsis: string, characterName: string, genre: string, type?: 'tale' | 'template', lorebook?: string) => void;
  updateStory: (storyId: string, title: string, synopsis: string, characterName: string, lorebook: string) => void;
  deleteStory: (storyId: string) => void;
  addMessage: (role: Role, content: string) => void;
  sendMessage: (content: string) => Promise<void>;
  updateCharacterSheet: (text: string) => void;
  updateMasterJournal: (text: string) => void;
  updateMasterFeedback: (text: string) => void;
  addLoreItem: (title: string, content: string) => void;
  deleteLoreItem: (itemId: string) => void;
  updateLlmSettings: (url: string, key: string, modelName: string) => void;
}

const initialStories: Story[] = [
  {
    id: 'eldoria',
    type: 'tale',
    title: 'The Whispers of Eldoria',
    genre: 'Fantasy',
    synopsis: 'You stand at the moss-covered gates of Eldoria, an ancient sanctuary lost to time. Inside, a soft violet light pulses, whispering your name.',
    dynamicState: {
      characterSheet: 'Name: Evelyn of Eldoria\nClass: Ranger / Scout\nLevel: 3\n\nAttributes:\n- Strength: 11\n- Dexterity: 16\n- Constitution: 12\n- Intelligence: 14\n- Wisdom: 15\n- Charisma: 10\n\nEquipment:\n- Recurve Bow of Elm\n- Leather Jerkin\n- Silver Elven Pendant\n- Ranger\'s Survival Kit',
      lorebook: JSON.stringify([
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
      ]),
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
    createdAt: 1717372800000, // 2024-06-03 mock date
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
      lorebook: JSON.stringify([
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
      ]),
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
      lorebook: JSON.stringify([
        {
          id: '1',
          title: 'Outpost Boreas',
          content: 'The deep-crust drilling station established by United Space Alliance on Europa. Hovering 4 kilometers below the ice sheet over a pitch-black abyss.'
        }
      ]),
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

// Custom StateStorage using idb-keyval
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await idbGet(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await idbDel(name);
  },
};

const fetchNarrative = async (
  url: string,
  key: string,
  modelName: string,
  systemPrompt: string,
  last10Messages: Message[]
): Promise<string> => {
  const endpoint = url || 'https://openrouter.ai/api/v1/chat/completions';
  
  // Map internal roles to API-compatible roles
  const mappedMessages = last10Messages.map((msg) => ({
    role: msg.role === 'player' ? 'user' : (msg.role === 'master' ? 'assistant' : 'system'),
    content: msg.content,
  }));

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...mappedMessages,
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content || choice?.text || '';
  return content.trim();
};

const triggerBackgroundUpdates = async (
  url: string,
  key: string,
  modelName: string,
  currentLorebook: string,
  currentJournal: string,
  last10Messages: Message[],
  set: any,
  get: any
) => {
  const recentMessagesText = last10Messages
    .map((msg) => `${msg.role === 'player' ? 'Player' : 'Master'}: ${msg.content}`)
    .join('\n\n');

  // Background update for Lorebook
  const updateLorebookPromise = (async () => {
    set({ isUpdatingLorebook: true });
    try {
      const lorePrompt = `Analyze the recent story events. Identify any newly introduced characters, locations, items, or important world facts. Output an updated markdown lorebook combining the old lore with the new facts. If nothing significant was added, reply strictly with 'NO_CHANGES'.`;
      const userContent = `[CURRENT LOREBOOK]\n${currentLorebook}\n\n[RECENT EVENTS]\n${recentMessagesText}`;

      const response = await fetchNarrative(url, key, modelName, lorePrompt, [
        { id: 'temp_lore', role: 'player', content: userContent }
      ]);

      const cleanedResponse = response.trim();
      if (cleanedResponse && cleanedResponse !== 'NO_CHANGES' && cleanedResponse !== "'NO_CHANGES'") {
        set((state: StoryState) => {
          const updatedStories = state.stories.map((s) => {
            if (s.id === state.activeStoryId) {
              return {
                ...s,
                dynamicState: {
                  ...s.dynamicState,
                  lorebook: response,
                },
              };
            }
            return s;
          });
          return {
            lorebook: response,
            stories: updatedStories,
          };
        });
      }
    } catch (err) {
      console.error('Error in background lorebook update:', err);
    } finally {
      set({ isUpdatingLorebook: false });
    }
  })();

  // Background update for Master Journal
  const updateJournalPromise = (async () => {
    set({ isUpdatingJournal: true });
    try {
      const journalPrompt = `Analyze the recent story events from a Game Master's perspective. Do NPC motivations, hidden threats, or secret plot mechanics need updating based on recent player actions? Output an updated Master Journal in brief bullet points. If no updates are needed, reply strictly with 'NO_CHANGES'.`;
      const userContent = `[CURRENT MASTER JOURNAL]\n${currentJournal}\n\n[RECENT EVENTS]\n${recentMessagesText}`;

      const response = await fetchNarrative(url, key, modelName, journalPrompt, [
        { id: 'temp_journal', role: 'player', content: userContent }
      ]);

      const cleanedResponse = response.trim();
      if (cleanedResponse && cleanedResponse !== 'NO_CHANGES' && cleanedResponse !== "'NO_CHANGES'") {
        set((state: StoryState) => {
          const updatedStories = state.stories.map((s) => {
            if (s.id === state.activeStoryId) {
              return {
                ...s,
                dynamicState: {
                  ...s.dynamicState,
                  masterJournal: response,
                },
              };
            }
            return s;
          });
          return {
            masterJournal: response,
            stories: updatedStories,
          };
        });
      }
    } catch (err) {
      console.error('Error in background master journal update:', err);
    } finally {
      set({ isUpdatingJournal: false });
    }
  })();

  await Promise.allSettled([updateLorebookPromise, updateJournalPromise]);
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set: any, get: any) => ({
      currentView: 'home',
      stories: initialStories,
      activeStoryId: null,
      messages: [],
      characterSheet: '',
      lorebook: '[]',
      masterJournal: '',
      masterFeedback: 'Keep the atmosphere dark, descriptive, and mysterious. Emphasize sensory details like damp air, ancient moss, and hums.',

      llmUrl: '',
      llmKey: '',
      modelName: 'google/gemini-2.5-flash',

      isGeneratingStory: false,
      isUpdatingLorebook: false,
      isUpdatingJournal: false,

      setView: (view: 'home' | 'story' | 'settings') => set({ currentView: view }),

      selectStory: (storyId: string) => set((state: StoryState) => {
        const story = state.stories.find((s: Story) => s.id === storyId);
        if (!story) return {};

        // Also update the updatedAt when a story is selected/played
        const updatedStories = state.stories.map((s: Story) => {
          if (s.id === storyId) {
            return { ...s, updatedAt: Date.now() };
          }
          return s;
        });

        return {
          currentView: 'story',
          activeStoryId: storyId,
          messages: story.messages,
          characterSheet: story.dynamicState.characterSheet,
          lorebook: story.dynamicState.lorebook,
          masterJournal: story.dynamicState.masterJournal,
          stories: updatedStories
        };
      }),

      createStory: (title: string, synopsis: string, characterName: string, genre: string, type: 'tale' | 'template' = 'tale', lorebook?: string) => set((state: StoryState) => {
        const newId = 'story_' + Date.now();
        const newStory: Story = {
          id: newId,
          type,
          title,
          genre,
          synopsis,
          dynamicState: {
            characterSheet: `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`,
            lorebook: lorebook !== undefined ? lorebook : JSON.stringify([
              {
                id: '1',
                title: 'The Journey Begins',
                content: `This is the lorebook for your journey in "${title}". Record locations, characters, and rules here.`
              }
            ]),
            masterJournal: `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`
          },
          messages: [
            {
              id: '1',
              role: 'master',
              content: `Welcome to ${title}, ${characterName}.\n\nYour journey is a blank page waiting to be written. The world stretches before you, rich with secrets, danger, and opportunity.\n\nDescribe your surroundings, your goal, or how you wish to take your first step into this story...`
            }
          ],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        const updatedStories = [newStory, ...state.stories];

        if (type === 'template') {
          return {
            stories: updatedStories,
            currentView: 'home',
            activeStoryId: null,
            messages: [],
            characterSheet: '',
            lorebook: '[]',
            masterJournal: ''
          };
        }

        return {
          stories: updatedStories,
          currentView: 'story',
          activeStoryId: newId,
          messages: newStory.messages,
          characterSheet: newStory.dynamicState.characterSheet,
          lorebook: newStory.dynamicState.lorebook,
          masterJournal: newStory.dynamicState.masterJournal
        };
      }),

      updateStory: (storyId: string, title: string, synopsis: string, characterName: string, lorebook: string) => set((state: StoryState) => {
        const updatedStories = state.stories.map((s: Story) => {
          if (s.id === storyId) {
            return {
              ...s,
              title,
              synopsis,
              dynamicState: {
                ...s.dynamicState,
                lorebook,
                characterSheet: `Name: ${characterName}\nAttributes:\n- Might: 10\n- Agility: 10\n- Intellect: 10\n- Grit: 10\n\nInventory:\n- Leather Satchel\n- Rations (3)`,
                masterJournal: `// AI Master Notes — ${title}\n// Act 1: The First Step\n- Character: ${characterName}\n- Introduce the primary conflict.\n- Build atmospheric world-building.`
              },
              messages: [
                {
                  id: '1',
                  role: 'master',
                  content: `Welcome to ${title}, ${characterName}.\n\nYour journey is a blank page waiting to be written. The world stretches before you, rich with secrets, danger, and opportunity.\n\nDescribe your surroundings, your goal, or how you wish to take your first step into this story...`
                }
              ],
              updatedAt: Date.now()
            };
          }
          return s;
        });

        const wasActive = state.activeStoryId === storyId;
        const updatedStory = updatedStories.find((s: Story) => s.id === storyId);

        return {
          stories: updatedStories,
          ...(wasActive && updatedStory ? {
            messages: updatedStory.messages,
            characterSheet: updatedStory.dynamicState.characterSheet,
            lorebook: updatedStory.dynamicState.lorebook,
            masterJournal: updatedStory.dynamicState.masterJournal
          } : {})
        };
      }),

      deleteStory: (storyId: string) => set((state: StoryState) => {
        const updatedStories = state.stories.filter((s: Story) => s.id !== storyId);
        
        const wasActive = state.activeStoryId === storyId;
        return {
          stories: updatedStories,
          ...(wasActive ? {
            activeStoryId: null,
            currentView: 'home',
            messages: [],
            characterSheet: '',
            lorebook: '[]',
            masterJournal: '',
            masterFeedback: ''
          } : {})
        };
      }),

      addMessage: (role: Role, content: string) => set((state: StoryState) => {
        if (!state.activeStoryId) return {};

        const newMessage: Message = {
          id: 'msg_' + Date.now() + Math.random().toString(36).substr(2, 4),
          role,
          content
        };

        const updatedMessages = [...state.messages, newMessage];

        // Update in stories list
        const updatedStories = state.stories.map((story: Story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              messages: updatedMessages,
              updatedAt: Date.now()
            };
          }
          return story;
        });

        // If player sent a message, schedule a mock master response to maintain game-like interactive feel!
        if (role === 'player') {
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
          stories: updatedStories
        };
      }),

      sendMessage: async (content: string) => {
        if (!content.trim()) return;

        // 1. Create and append the player's message
        const newMessage: Message = {
          id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
          role: 'player',
          content: content.trim()
        };

        set((state: StoryState) => {
          if (!state.activeStoryId) return {};
          const updatedMessages = [...state.messages, newMessage];
          const updatedStories = state.stories.map((story: Story) => {
            if (story.id === state.activeStoryId) {
              return {
                ...story,
                messages: updatedMessages,
                updatedAt: Date.now()
              };
            }
            return story;
          });
          return {
            messages: updatedMessages,
            stories: updatedStories,
            isGeneratingStory: true
          };
        });

        const currentState = get() as StoryState;
        const activeTale = currentState.stories.find(s => s.id === currentState.activeStoryId);
        if (!activeTale) {
          set({ isGeneratingStory: false });
          return;
        }

        try {
          // 2. Build Unified Narrative Prompt
          const lore = activeTale.dynamicState.lorebook;
          const charSheet = activeTale.dynamicState.characterSheet;
          const journal = activeTale.dynamicState.masterJournal;

          const UNIFIED_PROMPT = `You are the AI Game Master of an immersive text-based RPG. Your writing style is literary, descriptive, and atmospheric. Show, don't tell.\n\n[WORLD & LORE]\n${lore}\n\n[CHARACTER SHEET]\n${charSheet}\n\n[MASTER'S SECRET JOURNAL - DO NOT REVEAL TO PLAYER]\n${journal}\n\n[DIRECTIVES]\n1. If the conversation history is empty, START THE STORY: set the initial scene vividly, place the character in the world, and provide an initial hook or obstacle.\n2. If there is a history, resolve the player's last action fairly based on the world's logic, describe the consequences, and advance the plot.\n3. NEVER dictate the player character's thoughts, actions, or dialogue.\n4. Always conclude your turn by implicitly or explicitly passing the initiative back to the player.`;

          // Only the System Prompt + the LAST 10 MESSAGES from the array
          const last10Messages = activeTale.messages.slice(-10);

          const url = currentState.llmUrl;
          const key = currentState.llmKey;
          const model = currentState.modelName || 'google/gemini-2.5-flash';

          // 3. Fetch the narrative response
          const masterResponseText = await fetchNarrative(url, key, model, UNIFIED_PROMPT, last10Messages);

          const masterMessage: Message = {
            id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
            role: 'master',
            content: masterResponseText
          };

          set((state: StoryState) => {
            const finalMessages = [...state.messages, masterMessage];
            const updatedStories = state.stories.map((story: Story) => {
              if (story.id === state.activeStoryId) {
                return {
                  ...story,
                  messages: finalMessages,
                  updatedAt: Date.now()
                };
              }
              return story;
            });
            return {
              messages: finalMessages,
              stories: updatedStories,
              isGeneratingStory: false
            };
          });

          // 6. Check the amount of master messages in the active Tale.
          const updatedActiveTale = get().stories.find((s: Story) => s.id === currentState.activeStoryId);
          if (updatedActiveTale) {
            const masterMessagesCount = updatedActiveTale.messages.filter((m) => m.role === 'master').length;
            if (masterMessagesCount > 0 && masterMessagesCount % 5 === 0) {
              // Trigger background update functions
              triggerBackgroundUpdates(
                url,
                key,
                model,
                updatedActiveTale.dynamicState.lorebook,
                updatedActiveTale.dynamicState.masterJournal,
                updatedActiveTale.messages.slice(-10),
                set,
                get
              );
            }
          }
        } catch (error: any) {
          console.error('Narrative generation error:', error);
          const errorMsg: Message = {
            id: 'msg_err_' + Date.now(),
            role: 'system_feedback',
            content: `Error connecting to AI GM: ${error?.message || error}. Please check your connection or LLM settings in the top-right / settings menu.`
          };
          set((state: StoryState) => {
            const finalMessages = [...state.messages, errorMsg];
            const updatedStories = state.stories.map((story: Story) => {
              if (story.id === state.activeStoryId) {
                return {
                  ...story,
                  messages: finalMessages,
                  updatedAt: Date.now()
                };
              }
              return story;
            });
            return {
              messages: finalMessages,
              stories: updatedStories,
              isGeneratingStory: false
            };
          });
        }
      },

      updateCharacterSheet: (text: string) => set((state: StoryState) => {
        if (!state.activeStoryId) return {};

        const updatedStories = state.stories.map((story: Story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              dynamicState: {
                ...story.dynamicState,
                characterSheet: text
              },
              updatedAt: Date.now()
            };
          }
          return story;
        });

        return {
          characterSheet: text,
          stories: updatedStories
        };
      }),

      updateMasterJournal: (text: string) => set((state: StoryState) => {
        if (!state.activeStoryId) return {};

        const updatedStories = state.stories.map((story: Story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              dynamicState: {
                ...story.dynamicState,
                masterJournal: text
              },
              updatedAt: Date.now()
            };
          }
          return story;
        });

        return {
          masterJournal: text,
          stories: updatedStories
        };
      }),

      updateMasterFeedback: (text: string) => set(() => {
        return {
          masterFeedback: text
        };
      }),

      addLoreItem: (title: string, content: string) => set((state: StoryState) => {
        if (!state.activeStoryId) return {};

        let currentLore: LoreItem[] = [];
        try {
          currentLore = JSON.parse(state.lorebook);
          if (!Array.isArray(currentLore)) currentLore = [];
        } catch (e) {
          currentLore = [];
        }

        const newItem: LoreItem = {
          id: 'lore_' + Date.now(),
          title,
          content
        };

        const updatedLore = [...currentLore, newItem];
        const updatedLoreStr = JSON.stringify(updatedLore);

        const updatedStories = state.stories.map((story: Story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              dynamicState: {
                ...story.dynamicState,
                lorebook: updatedLoreStr
              },
              updatedAt: Date.now()
            };
          }
          return story;
        });

        return {
          lorebook: updatedLoreStr,
          stories: updatedStories
        };
      }),

      deleteLoreItem: (itemId: string) => set((state: StoryState) => {
        if (!state.activeStoryId) return {};

        let currentLore: LoreItem[] = [];
        try {
          currentLore = JSON.parse(state.lorebook);
          if (!Array.isArray(currentLore)) currentLore = [];
        } catch (e) {
          currentLore = [];
        }

        const updatedLore = currentLore.filter((item: LoreItem) => item.id !== itemId);
        const updatedLoreStr = JSON.stringify(updatedLore);

        const updatedStories = state.stories.map((story: Story) => {
          if (story.id === state.activeStoryId) {
            return {
              ...story,
              dynamicState: {
                ...story.dynamicState,
                lorebook: updatedLoreStr
              },
              updatedAt: Date.now()
            };
          }
          return story;
        });

        return {
          lorebook: updatedLoreStr,
          stories: updatedStories
        };
      }),

      updateLlmSettings: (url: string, key: string, modelName: string) => set(() => {
        return { llmUrl: url, llmKey: key, modelName: modelName };
      })
    }),
    {
      name: 'omnitale-storage-idb',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state: any) => ({
        stories: state.stories,
        llmUrl: state.llmUrl,
        llmKey: state.llmKey,
        modelName: state.modelName,
        currentView: state.currentView,
        activeStoryId: state.activeStoryId,
        messages: state.messages,
        characterSheet: state.characterSheet,
        lorebook: state.lorebook,
        masterJournal: state.masterJournal,
        masterFeedback: state.masterFeedback
      })
    }
  )
);
