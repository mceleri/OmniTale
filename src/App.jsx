import React, { useState, useEffect } from 'react';

// Storie predefinite integrate nell'app
const PRESET_STORIES = [
  {
    id: 'eldoria',
    title: 'Il Portale di Eldoria',
    genre: 'Fantasy',
    emoji: '🧙‍♂️',
    description: 'Esplora le rovine di un antico tempio e decidi il destino di un portale magico risvegliato dopo millenni.',
    startNode: 'start',
    nodes: {
      start: {
        text: 'Ti trovi di fronte alle rovine ricoperte di muschio del tempio di Eldoria. Al centro della stanza principale, un portale circolare emana una pulsante luce azzurra. Senti un sussurro lontano nella tua mente.',
        emoji: '🏛️',
        options: [
          { text: 'Avvicinati ed estendi la mano verso la luce', nextNode: 'touch_light' },
          { text: 'Esamina le antiche rune incise sull\'arco di pietra', nextNode: 'read_runes' },
          { text: 'Resta indietro e lancia una pietra nel portale', nextNode: 'throw_stone' }
        ]
      },
      touch_light: {
        text: 'Non appena le tue dita sfiorano la luce fredda del portale, vieni risucchiato in un vortice di stelle! Ti ritrovi sospeso in una foresta fluttuante nel cielo. Davanti a te c\'è un essere celestiale fatto di pura luce.',
        emoji: '✨',
        options: [
          { text: 'Chiedi all\'essere dove ti trovi', nextNode: 'ask_celestial' },
          { text: 'Usa la tua spada per difenderti', nextNode: 'attack_celestial' }
        ]
      },
      read_runes: {
        text: 'Studi attentamente le rune. Riesci a decifrare il testo: "Colui che cerca il potere deve offrire una scintilla della sua anima, colui che cerca la conoscenza deve solo guardare oltre". All\'improvviso, una parte dell\'arco si sposta rivelando uno scomparto segreto.',
        emoji: '📜',
        options: [
          { text: 'Apri lo scomparto segreto', nextNode: 'open_compartment' },
          { text: 'Ignora lo scomparto e attraversa il portale', nextNode: 'touch_light' }
        ]
      },
      throw_stone: {
        text: 'La pietra attraversa il portale e scompare senza fare rumore. Un secondo dopo, la pietra viene "sputata" fuori ad altissima velocità, colpendoti di striscio alla spalla. Il portale inizia a cambiare colore, diventando di un rosso cupo e minaccioso.',
        emoji: '🪨',
        options: [
          { text: 'Scappa subito dal tempio', nextNode: 'escape_run' },
          { text: 'Cerca di calmare il portale versandoci sopra dell\'acqua benedetta', nextNode: 'holy_water' }
        ]
      },
      ask_celestial: {
        text: 'L\'essere sorride telepaticamente. "Benvenuto nel Giardino dei Sogni. Hai dimostrato curiosità anziché violenza. Ti faccio dono della Gemma dell\'Anima". Ti svegli di colpo davanti alle rovine, ma in mano stringi una gemma splendente. La tua avventura è appena iniziata! [Vittoria: Fine della Demo]',
        emoji: '💎',
        options: []
      },
      attack_celestial: {
        text: 'Attacchi la creatura, ma la tua lama attraversa il suo corpo di luce come se fosse fumo. L\'essere sospira tristemente e agita una mano. Ti ritrovi all\'istante fuori dal tempio, mentre l\'ingresso crolla su se stesso, sigillando il portale per sempre. [Sconfitta: Fine della Demo]',
        emoji: '⚔️',
        options: []
      },
      open_compartment: {
        text: 'Nello scomparto trovi un antico amuleto d\'oro a forma di drago. Quando lo indossi, il portale si stabilizza ed emana una luce calda e dorata. Attraversandolo, vieni incoronato re di una civiltà perduta. [Vittoria Leggendaria: Fine della Demo]',
        emoji: '👑',
        options: []
      },
      escape_run: {
        text: 'Corri a perdifiato fuori dalle rovine. Dietro di te, senti un\'esplosione magica scuotere la terra. Guardandoti indietro, vedi che il tempio è svanito, lasciando solo un cratere fumante. Sei salvo, ma il mistero rimarrà irrisolto. [Fine Neutrale]',
        emoji: '🏃‍♂️',
        options: []
      },
      holy_water: {
        text: 'Versi l\'acqua. Un sibilo assordante riempie la stanza e il fumo rosso si dissolve, spegnendo completamente il portale. Il tempio torna nel silenzio. Hai evitato un cataclisma, ma a quale prezzo? [Fine Sicura]',
        emoji: '🧪',
        options: []
      }
    }
  },
  {
    id: 'space_drift',
    title: 'Codice Alfa: Deriva Spaziale',
    genre: 'Fantascienza',
    emoji: '🚀',
    description: 'Ti svegli dal sonno criogenico a bordo della nave cargo Aurora. Gli allarmi suonano e l\'intelligenza di bordo è offline.',
    startNode: 'start',
    nodes: {
      start: {
        text: 'Il vetro della capsula criogenica si apre con un sibilo. L\'aria è gelida. Le luci rosse di emergenza lampeggiano nel corridoio. Il computer di bordo mostra un messaggio d\'errore: "ERRORE CRITICO: Supporto Vitale al 12%".',
        emoji: '🥶',
        options: [
          { text: 'Dirigiti subito verso la cabina di pilotaggio', nextNode: 'bridge' },
          { text: 'Ispeziona la sala macchine per riparare il generatore', nextNode: 'engine_room' },
          { text: 'Cerca un kit di emergenza nell\'armadietto medico', nextNode: 'medical_bay' }
        ]
      },
      bridge: {
        text: 'La cabina di pilotaggio ha il parabrezza parzialmente crepato, rivelando lo spettacolo mozzafiato e terribile del vuoto cosmico. La console comandi risponde a stento. Vedi un segnale radio debole provenire da un asteroide vicino.',
        emoji: '🛸',
        options: [
          { text: 'Invia una trasmissione di SOS usando l\'energia d\'emergenza', nextNode: 'send_sos' },
          { text: 'Avvia i motori di manovra manuali per stabilizzare l\'orbita', nextNode: 'thrusters' }
        ]
      },
      engine_room: {
        text: 'La sala macchine è piena di fumo denso e radioattivo. Il reattore principale a fusione sta vibrando pericolosamente. Per stabilizzarlo, devi inserire manualmente una sequenza di sblocco sulla console circondata dal fumo.',
        emoji: '⚙️',
        options: [
          { text: 'Indossa una tuta protettiva parzialmente danneggiata ed entra nel fumo', nextNode: 'wear_suit' },
          { text: 'Tenta di bypassare il sistema dalla console esterna (richiede hacking)', nextNode: 'hack_console' }
        ]
      },
      medical_bay: {
        text: 'Nell\'armadietto trovi un kit medico completo con tre iniezioni di adrenalina, una torcia a fusione e una scheda magnetica con la scritta "ACCESSO REATTORE".',
        emoji: '🎒',
        options: [
          { text: 'Prendi gli oggetti e vai in sala macchine usando la scheda', nextNode: 'engine_room_card' },
          { text: 'Prendi gli oggetti e corri in cabina di pilotaggio', nextNode: 'bridge' }
        ]
      },
      send_sos: {
        text: 'Invii l\'SOS. Pochi minuti dopo, una gigantesca nave mercantile intercetta il messaggio e ti aggancia con il raggio traente. Sei salvo! La tua odissea nello spazio è finita. [Vittoria: Fine della Demo]',
        emoji: '📡',
        options: []
      },
      thrusters: {
        text: 'I motori di manovra esplodono a causa del sovraccarico! La nave inizia a roteare vorticosamente su se stessa fino a spezzarsi. Ti ritrovi alla deriva nello spazio profondo. [Sconfitta]',
        emoji: '💥',
        options: []
      },
      wear_suit: {
        text: 'La tuta regge appena il tempo necessario. Inserisci il codice di sblocco e il reattore torna a ruggire dolcemente. Le luci della nave tornano bianche e l\'aria pulita riempie i corridoi. Ce l\'hai fatta! [Vittoria Tecnologica]',
        emoji: '🧑‍🚀',
        options: []
      },
      hack_console: {
        text: 'Fai un errore nel bypass del codice. Il sistema di sicurezza rileva un\'intrusione e sigilla l\'intera sala macchine, espellendo l\'aria nello spazio per prevenire incendi. Senza energia, la nave si spegne lentamente. [Sconfitta]',
        emoji: '💻',
        options: []
      },
      engine_room_card: {
        text: 'Grazie alla scheda magnetica di sicurezza, sblocchi una console d\'emergenza sicura fuori dal fumo. Attivi il protocollo di raffreddamento automatico in un secondo! La nave è salva e perfettamente funzionante. [Vittoria Perfetta]',
        emoji: '💳',
        options: []
      }
    }
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('play');
  
  // Stati per il Gioco
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('omnitale_custom_stories');
    const parsed = saved ? JSON.parse(saved) : [];
    return [...PRESET_STORIES, ...parsed];
  });
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState('');
  const [history, setHistory] = useState([]);

  // Stati per la Creazione
  const [creatorStoryTitle, setCreatorStoryTitle] = useState('');
  const [creatorStoryDesc, setCreatorStoryDesc] = useState('');
  const [creatorStoryGenre, setCreatorStoryGenre] = useState('Fantasy');
  const [creatorStoryEmoji, setCreatorStoryEmoji] = useState('📖');
  const [creatorNodes, setCreatorNodes] = useState({
    start: {
      text: 'La tua fantastica storia inizia qui. Scrivi la prima descrizione!',
      emoji: '🌟',
      options: []
    }
  });
  const [selectedCreatorNodeKey, setSelectedCreatorNodeKey] = useState('start');
  const [newNodeText, setNewNodeText] = useState('');
  const [newNodeEmoji, setNewNodeEmoji] = useState('🎭');
  const [optionText, setOptionText] = useState('');
  const [optionTargetNode, setOptionTargetNode] = useState('');

  // Sincronizza modifiche alle storie salvate su LocalStorage
  const handleSaveCustomStory = () => {
    if (!creatorStoryTitle.trim()) {
      alert('Inserisci un titolo per la tua storia!');
      return;
    }

    const newStory = {
      id: 'custom_' + Date.now(),
      title: creatorStoryTitle,
      genre: creatorStoryGenre,
      emoji: creatorStoryEmoji,
      description: creatorStoryDesc || 'Una fantastica storia creata dall\'utente.',
      startNode: 'start',
      nodes: creatorNodes
    };

    const currentSaved = JSON.parse(localStorage.getItem('omnitale_custom_stories') || '[]');
    const updated = [...currentSaved, newStory];
    localStorage.setItem('omnitale_custom_stories', JSON.stringify(updated));
    
    setStories([...PRESET_STORIES, ...updated]);
    alert('Storia creata con successo! Ora la trovi nella scheda "Gioca"!');
    
    // Reset moduli
    setCreatorStoryTitle('');
    setCreatorStoryDesc('');
    setCreatorNodes({
      start: {
        text: 'La tua fantastica storia inizia qui. Scrivi la prima descrizione!',
        emoji: '🌟',
        options: []
      }
    });
    setSelectedCreatorNodeKey('start');
    setActiveTab('play');
  };

  const handleAddNode = () => {
    const nodeName = prompt("Inserisci un identificativo univoco per il nuovo nodo (es: 'incontro_drago', 'caverna_buia'):");
    if (!nodeName) return;
    const cleanKey = nodeName.trim().toLowerCase().replace(/\s+/g, '_');
    
    if (creatorNodes[cleanKey]) {
      alert('Questo identificativo esiste già!');
      return;
    }

    setCreatorNodes(prev => ({
      ...prev,
      [cleanKey]: {
        text: 'Scrivi qui la descrizione di questa situazione...',
        emoji: '❓',
        options: []
      }
    }));
    setSelectedCreatorNodeKey(cleanKey);
  };

  const handleUpdateNodeContent = (text, emoji) => {
    setCreatorNodes(prev => ({
      ...prev,
      [selectedCreatorNodeKey]: {
        ...prev[selectedCreatorNodeKey],
        text,
        emoji
      }
    }));
  };

  const handleAddOptionToNode = () => {
    if (!optionText.trim() || !optionTargetNode.trim()) {
      alert('Compila sia il testo della scelta sia il nodo di destinazione!');
      return;
    }

    setCreatorNodes(prev => {
      const currentOptions = prev[selectedCreatorNodeKey].options || [];
      return {
        ...prev,
        [selectedCreatorNodeKey]: {
          ...prev[selectedCreatorNodeKey],
          options: [...currentOptions, { text: optionText, nextNode: optionTargetNode }]
        }
      };
    });

    setOptionText('');
    setOptionTargetNode('');
  };

  const handleRemoveOption = (indexToRemove) => {
    setCreatorNodes(prev => {
      const currentOptions = prev[selectedCreatorNodeKey].options || [];
      return {
        ...prev,
        [selectedCreatorNodeKey]: {
          ...prev[selectedCreatorNodeKey],
          options: currentOptions.filter((_, idx) => idx !== indexToRemove)
        }
      };
    });
  };

  // Funzioni di Gioco
  const startStory = (story) => {
    setSelectedStory(story);
    setCurrentNodeId(story.startNode);
    setHistory([]);
  };

  const selectOption = (nextNodeId) => {
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = [...history];
      const last = prev.pop();
      setCurrentNodeId(last);
      setHistory(prev);
    }
  };

  const resetStory = () => {
    if (selectedStory) {
      setCurrentNodeId(selectedStory.startNode);
      setHistory([]);
    }
  };

  const deleteCustomStory = (storyId, e) => {
    e.stopPropagation();
    if (!confirm('Sei sicuro di voler eliminare questa storia creata da te?')) return;
    
    const currentSaved = JSON.parse(localStorage.getItem('omnitale_custom_stories') || '[]');
    const updated = currentSaved.filter(s => s.id !== storyId);
    localStorage.setItem('omnitale_custom_stories', JSON.stringify(updated));
    
    setStories([...PRESET_STORIES, ...updated]);
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(null);
    }
  };

  const activeNode = selectedStory ? selectedStory.nodes[currentNodeId] : null;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar principale */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedStory(null); setActiveTab('play'); }}>
            <span className="text-4xl">📖</span>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
                OMNITALE
              </h1>
              <p className="text-xs text-slate-400 font-mono">Interactive Storyteller Engine</p>
            </div>
          </div>
          
          <nav className="flex gap-2">
            <button 
              onClick={() => { setActiveTab('play'); setSelectedStory(null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'play' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              🎮 Gioca
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'create' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              🛠️ Crea Storie
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'about' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
            >
              ℹ️ Info
            </button>
          </nav>
        </div>
      </header>

      {/* Contenuto Principale */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        {activeTab === 'play' && (
          <div>
            {!selectedStory ? (
              // Sezione Selezione Storia
              <div>
                <div className="text-center mb-10 max-w-xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Scegli la tua avventura</h2>
                  <p className="text-slate-400">Immergiti in storie ramificate dove ogni tua singola scelta determina la trama e porta a finali completamente unici.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.map((story) => (
                    <div 
                      key={story.id}
                      onClick={() => startStory(story)}
                      className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-4xl p-2 bg-slate-800/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            {story.emoji || '🔮'}
                          </span>
                          <span className="px-3 py-1 bg-slate-800 text-cyan-400 text-xs font-mono rounded-full uppercase tracking-wider">
                            {story.genre}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors mb-2">{story.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{story.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
                        <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Inizia l'avventura &rarr;
                        </span>
                        {story.id.startsWith('custom_') && (
                          <button 
                            onClick={(e) => deleteCustomStory(story.id, e)}
                            className="text-red-400 hover:text-red-300 p-2 text-sm rounded-lg hover:bg-red-950/20"
                            title="Elimina questa storia personalizzata"
                          >
                            🗑️ Elimina
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Sezione Schermata di Gioco Attivo
              <div className="max-w-3xl mx-auto">
                {/* Header della storia attiva */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    &larr; Elenco Storie
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedStory.emoji}</span>
                    <span className="font-bold text-slate-300">{selectedStory.title}</span>
                  </div>
                  <button 
                    onClick={resetStory}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    🔄 Ricomincia
                  </button>
                </div>

                {/* Card Narrativa del Nodo Corrente */}
                {activeNode ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                    
                    {/* Icona o Emoji di Scena */}
                    <div className="text-6xl text-center mb-6 select-none animate-bounce">
                      {activeNode.emoji || selectedStory.emoji}
                    </div>

                    {/* Testo Narrativo */}
                    <div className="text-lg md:text-xl text-slate-200 leading-relaxed text-center mb-8 max-w-2xl mx-auto font-sans">
                      {activeNode.text}
                    </div>

                    {/* Opzioni / Scelte */}
                    <div className="space-y-4">
                      {activeNode.options && activeNode.options.length > 0 ? (
                        activeNode.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectOption(option.nextNode)}
                            className="w-full text-left px-6 py-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all duration-200 hover:scale-[1.01] flex items-center justify-between group"
                          >
                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                              {option.text}
                            </span>
                            <span className="text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              &rarr;
                            </span>
                          </button>
                        ))
                      ) : (
                        // Schermata di Fine Storia (nessuna opzione successiva)
                        <div className="text-center pt-6">
                          <div className="text-emerald-400 font-mono text-sm mb-4 uppercase tracking-wider">
                            ✨ Avventura Completata ✨
                          </div>
                          <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                              onClick={resetStory}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg"
                            >
                              Gioca Ancora 🔄
                            </button>
                            <button
                              onClick={() => setSelectedStory(null)}
                              className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-white font-semibold rounded-xl transition-all"
                            >
                              Altre Storie &larr;
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pulsante Indietro (History) */}
                    {history.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-start">
                        <button
                          onClick={goBack}
                          className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 transition-colors"
                        >
                          ↩️ Torna alla scelta precedente
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
                    <p className="text-red-400 font-mono mb-4">Errore: Questo nodo della storia non esiste o non è stato ancora collegato.</p>
                    <button onClick={() => setSelectedStory(null)} className="px-4 py-2 bg-slate-800 rounded-lg text-white">Torna indietro</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold mb-2">Crea la tua Storia Interattiva</h2>
              <p className="text-slate-400">Scrivi nodi narrativi personalizzati e collegali tra di loro usando scelte dinamiche. Verrà salvata localmente nel browser!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pannello Configurazione e Nodi */}
              <div className="lg:col-span-1 space-y-6">
                {/* Meta informazioni della storia */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-lg text-emerald-400 border-b border-slate-800 pb-2">1. Info Storia</h3>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Titolo</label>
                    <input 
                      type="text" 
                      placeholder="es: Il Tempio d'Oro" 
                      value={creatorStoryTitle}
                      onChange={(e) => setCreatorStoryTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Genere</label>
                      <select 
                        value={creatorStoryGenre}
                        onChange={(e) => setCreatorStoryGenre(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-sm focus:border-cyan-500 outline-none text-white"
                      >
                        <option value="Fantasy">Fantasy</option>
                        <option value="Fantascienza">Sci-Fi</option>
                        <option value="Horror">Horror</option>
                        <option value="Giallo">Giallo</option>
                        <option value="Storico">Storico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Emoji Icona</label>
                      <input 
                        type="text" 
                        placeholder="🐉" 
                        value={creatorStoryEmoji}
                        onChange={(e) => setCreatorStoryEmoji(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-center focus:border-cyan-500 outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Breve Descrizione</label>
                    <textarea 
                      rows="2"
                      placeholder="Una breve introduzione che incuriosisca il lettore..."
                      value={creatorStoryDesc}
                      onChange={(e) => setCreatorStoryDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                </div>

                {/* Lista Nodi Creati */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-lg text-cyan-400">2. Mappa dei Nodi</h3>
                    <button 
                      onClick={handleAddNode}
                      className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded hover:bg-cyan-500 hover:text-slate-950 transition-all font-semibold"
                    >
                      + Nuovo Nodo
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {Object.keys(creatorNodes).map((nodeKey) => (
                      <button
                        key={nodeKey}
                        onClick={() => setSelectedCreatorNodeKey(nodeKey)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between border transition-all ${selectedCreatorNodeKey === nodeKey ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'}`}
                      >
                        <span className="truncate">{nodeKey === 'start' ? '🟢 start' : `📍 ${nodeKey}`}</span>
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                          {(creatorNodes[nodeKey].options || []).length} scelte
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pulsante Pubblica definitivo */}
                <button
                  onClick={handleSaveCustomStory}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-base uppercase tracking-wider rounded-xl hover:from-emerald-400 hover:to-cyan-400 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-cyan-950/30"
                >
                  💾 Salva e Pubblica Storia
                </button>
              </div>

              {/* Editore del Nodo Selezionato */}
              <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-xl text-white">3. Modifica Nodo Attivo</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Stai modificando il nodo: <span className="text-cyan-400">{selectedCreatorNodeKey}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Emoji:</span>
                    <input 
                      type="text" 
                      value={creatorNodes[selectedCreatorNodeKey]?.emoji || '🔮'}
                      onChange={(e) => handleUpdateNodeContent(creatorNodes[selectedCreatorNodeKey].text, e.target.value)}
                      className="w-10 bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-sm focus:border-cyan-500 outline-none text-white"
                      title="Emoji di scena"
                    />
                  </div>
                </div>

                {/* Descrizione scenica */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Descrizione del Nodo (cosa succede in questa scena?)</label>
                  <textarea
                    rows="4"
                    value={creatorNodes[selectedCreatorNodeKey]?.text || ''}
                    onChange={(e) => handleUpdateNodeContent(e.target.value, creatorNodes[selectedCreatorNodeKey].emoji)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none text-slate-100 placeholder-slate-600 font-sans"
                    placeholder="Esempio: Cammini nell'oscurità e trovi uno scrigno dorato sulla sinistra e un tunnel buio sulla destra..."
                  ></textarea>
                </div>

                {/* Gestione Scelte e Collegamenti */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-slate-300 border-t border-slate-800/80 pt-4">Aggiungi Scelte per questo nodo</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Testo della Scelta (cosa clicca il giocatore)</label>
                      <input 
                        type="text" 
                        placeholder="es: Apri lo scrigno" 
                        value={optionText}
                        onChange={(e) => setOptionText(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:border-cyan-500 outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Destinazione (ID del nodo a cui porta)</label>
                      <select 
                        value={optionTargetNode}
                        onChange={(e) => setOptionTargetNode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-2 text-xs focus:border-cyan-500 outline-none text-white"
                      >
                        <option value="">Seleziona un nodo...</option>
                        {Object.keys(creatorNodes).map(key => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddOptionToNode}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs border border-emerald-500/30 rounded-lg transition-all"
                      >
                        + Aggiungi Scelta
                      </button>
                    </div>
                  </div>

                  {/* Scelte correnti in lista */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono text-slate-400">Scelte collegate correnti:</label>
                    {creatorNodes[selectedCreatorNodeKey]?.options && creatorNodes[selectedCreatorNodeKey].options.length > 0 ? (
                      <div className="space-y-2">
                        {creatorNodes[selectedCreatorNodeKey].options.map((opt, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-950/20 border border-slate-800/80 p-3 rounded-lg text-xs">
                            <span className="font-medium text-slate-300">"{opt.text}" &rarr; <span className="text-cyan-400 font-mono">{opt.nextNode}</span></span>
                            <button 
                              onClick={() => handleRemoveOption(i)}
                              className="text-red-400 hover:text-red-300 font-semibold hover:bg-red-950/20 px-2 py-1 rounded"
                            >
                              Rimuovi
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
                        Questo è un nodo finale. Il gioco terminerà qui mostrando i pulsanti di reset. Aggiungi delle scelte per continuare la storia da qui.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl mx-auto bg-slate-900/30 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Informazioni su OmniTale</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
              <p>
                <strong>OmniTale</strong> è una piattaforma interattiva per la lettura e creazione di avventure testuali in stile <em>Librogame</em> o <em>Choose Your Own Adventure</em>.
              </p>
              <p>
                La nostra missione è dare la possibilità a chiunque di strutturare storie non lineari ad albero in modo semplice, visivo e immediato, combinando narrazione classica e interattività web.
              </p>
              <h3 className="text-lg font-bold text-white pt-2">Tecnologia dell'App:</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-xs md:text-sm">
                <li>Core: React (Hooks, LocalStorage)</li>
                <li>CSS: Tailwind CSS (Utility classes)</li>
                <li>Builder: Vite</li>
                <li>CI/CD: GitHub Actions (build & deploy automatico su GitHub Pages)</li>
              </ul>
              <h3 className="text-lg font-bold text-white pt-2">Come Creare Nuove Storie:</h3>
              <p>
                Vai nella scheda <strong>"Crea Storie"</strong>, compila le informazioni generali, aggiungi i nodi della tua storia, e crea collegamenti (scelte) tra di essi. Ricordati che ogni scelta deve puntare ad un nodo esistente! Una volta completata, fai clic su "Salva e Pubblica" per renderla immediatamente disponibile per essere giocata.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center md:flex md:justify-between md:items-center text-slate-500 text-xs font-mono">
          <p>&copy; {new Date().getFullYear()} OmniTale. Realizzato con passione con AI Studio.</p>
          <p className="mt-2 md:mt-0">Deploy automatico con GitHub Actions su GitHub Pages</p>
        </div>
      </footer>
    </div>
  );
}

export default App;