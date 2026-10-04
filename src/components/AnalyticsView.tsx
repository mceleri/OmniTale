import React, { useState, useMemo } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { formatUnifiedPrompt } from '../utils/prompts/storyPrompts';
import { estimateTokens } from '../utils/tokenEstimator';
import { 
  ArrowLeft, 
  Layers, 
  CheckCircle, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  HelpCircle,
  Database,
  BarChart2,
  Scale,
  BookOpen
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { stories, activeStoryId, setView, masterFeedback } = useStoryStore();
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);
  const [breakdownView, setBreakdownView] = useState<'combined' | 'split' | 'narrator' | 'judge'>('combined');
  const [activeTab, setActiveTab] = useState<'chart' | 'context'>('chart');
  const [searchTerm, setSearchTerm] = useState('');

  // Find the selected story
  const story = useMemo(() => {
    return stories.find((s) => s.id === activeStoryId);
  }, [stories, activeStoryId]);

  // If no story is loaded or selected, render an error state
  if (!story) {
    return (
      <div className="max-w-md lg:max-w-none lg:w-full mx-auto min-h-screen px-6 py-8 flex flex-col justify-center items-center">
        <p className="text-zinc-400 text-sm mb-4">No active story selected for analysis.</p>
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    );
  }

  // Raw inputs for unified prompt
  const loreText = story.dynamicState.lorebook || '';
  const charSheetText = story.dynamicState.characterSheet || '';
  const journalText = story.dynamicState.masterJournal || '';
  const feedbackText = story.dynamicState.masterFeedback !== undefined
    ? story.dynamicState.masterFeedback
    : (masterFeedback || '');

  // Token calculations
  const totalMessagesCount = story.messages.length;
  
  // Individual system items
  const loreTokens = estimateTokens(loreText);
  const charSheetTokens = estimateTokens(charSheetText);
  const journalTokens = estimateTokens(journalText);
  const coreInstructionTokens = 350; // Base prompt text tokens in formatUnifiedPrompt

  // Unified system prompt size with full 5-section canvas accuracy
  const totalSystemTokens = useMemo(() => {
    const sections = {
      setting: story.dynamicState.setting,
      characterSheet: story.dynamicState.characterSheet,
      factions: story.dynamicState.factions,
      conflicts: story.dynamicState.conflicts,
      historicalFacts: story.dynamicState.historicalFacts,
      lorebook: story.dynamicState.lorebook,
    };
    const fullUnifiedText = formatUnifiedPrompt(
      loreText,
      charSheetText,
      journalText,
      feedbackText,
      story.language,
      story.narrativePropensity,
      sections,
      undefined,
      story.dynamicState.stochasticMatrix
    );
    return estimateTokens(fullUnifiedText);
  }, [loreText, charSheetText, journalText, feedbackText, story]);

  // Entire message history token metrics with Judge & Narrator (In + Out) decomposition
  const messageTokensList = useMemo(() => {
    let cumulative = 0;
    return story.messages.map((m, idx) => {
      const isApiMetric = m.tokens !== undefined;
      const tokens = isApiMetric ? m.tokens! : estimateTokens(m.content);
      cumulative += tokens;

      // Calculate preceding active messages (last 10 up to this message)
      const precedingMessages = story.messages.slice(0, idx);
      const precedingActive = precedingMessages.slice(-9);
      const precedingActiveTokens = precedingActive.reduce((sum, prevMsg) => {
        const prevTokens = prevMsg.tokens !== undefined ? prevMsg.tokens! : estimateTokens(prevMsg.content);
        return sum + prevTokens;
      }, 0);

      const estimatedPromptTokens = totalSystemTokens + precedingActiveTokens;
      const actualPromptTokens = m.promptTokens;
      const promptTokensToUse = actualPromptTokens !== undefined ? actualPromptTokens : estimatedPromptTokens;
      
      // Detailed Stage Tokens decomposition (Judge vs Narrator)
      let judgeIn = 0;
      let judgeOut = 0;
      let judgeTotal = 0;
      let narratorIn = 0;
      let narratorOut = 0;
      let narratorTotal = 0;

      if (m.role === 'master') {
        if (m.judgeTokens) {
          judgeIn = m.judgeTokens.promptTokens;
          judgeOut = m.judgeTokens.completionTokens;
          judgeTotal = m.judgeTokens.totalTokens;
        } else if (m.judgeNote) {
          judgeOut = estimateTokens(m.judgeNote);
          judgeIn = Math.round(promptTokensToUse * 0.45);
          judgeTotal = judgeIn + judgeOut;
        }

        if (m.narratorTokens) {
          narratorIn = m.narratorTokens.promptTokens;
          narratorOut = m.narratorTokens.completionTokens;
          narratorTotal = m.narratorTokens.totalTokens;
        } else {
          narratorIn = Math.max(0, promptTokensToUse - judgeIn);
          narratorOut = tokens;
          narratorTotal = narratorIn + narratorOut;
        }
      } else {
        // Player turn input
        narratorIn = tokens;
        narratorOut = 0;
        narratorTotal = tokens;
      }

      const callTokensTotal = m.role === 'master' 
        ? (judgeTotal + narratorTotal) 
        : tokens;

      return {
        index: idx + 1,
        id: m.id,
        role: m.role,
        content: m.content,
        tokens,
        cumulativeTokens: cumulative,
        callTokensTotal,
        promptTokensUsed: promptTokensToUse,
        judgeIn,
        judgeOut,
        judgeTotal,
        narratorIn,
        narratorOut,
        narratorTotal,
        chars: m.content.length,
        isActive: totalMessagesCount - idx <= 10,
        isApiMetric,
        promptTokens: m.promptTokens,
        judgeNote: m.judgeNote,
      };
    });
  }, [story.messages, totalMessagesCount, totalSystemTokens]);

  const masterMessagesList = useMemo(() => {
    return messageTokensList.filter(m => m.role === 'master');
  }, [messageTokensList]);

  // Total tokens consumed across all turns (all in + out)
  const totalConsumedTokens = useMemo(() => {
    const sumMasterCalls = masterMessagesList.reduce((acc, curr) => acc + curr.callTokensTotal, 0);
    const sumPlayerInputs = messageTokensList
      .filter(m => m.role === 'player')
      .reduce((acc, curr) => acc + curr.tokens, 0);
    return sumMasterCalls + sumPlayerInputs;
  }, [masterMessagesList, messageTokensList]);

  // Tokens of messages sent to the LLM (last 10)
  const activeHistoryTokens = useMemo(() => {
    return messageTokensList
      .filter(m => m.isActive)
      .reduce((acc, curr) => acc + curr.tokens, 0);
  }, [messageTokensList]);

  // Current Total Active Request Size (Prompt + Last 10 Messages)
  const activePromptSize = totalSystemTokens + activeHistoryTokens;

  // Search/Filter messages for the table list below
  const searchedMessagesList = useMemo(() => {
    if (!searchTerm.trim()) return messageTokensList;
    return messageTokensList.filter(m => 
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messageTokensList, searchTerm]);

  // Prepare simple SVG chart parameters
  const chartHeight = 130;
  const chartWidth = 340;
  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 15;
  const paddingBottom = 22;

  // Data points for Call N chart (master turns)
  const chartData = masterMessagesList.length > 0 ? masterMessagesList : messageTokensList;

  const maxVal = useMemo(() => {
    if (chartData.length === 0) return 100;
    let values: number[] = [];
    if (breakdownView === 'combined' || breakdownView === 'split') {
      values = chartData.map(m => m.callTokensTotal);
    } else if (breakdownView === 'judge') {
      values = chartData.map(m => Math.max(m.judgeTotal, 20));
    } else if (breakdownView === 'narrator') {
      values = chartData.map(m => m.narratorTotal);
    }
    const max = Math.max(...values, 50);
    return Math.ceil(max / 50) * 50;
  }, [chartData, breakdownView]);

  const xStep = useMemo(() => {
    if (chartData.length <= 1) return chartWidth - paddingLeft - paddingRight;
    return (chartWidth - paddingLeft - paddingRight) / (chartData.length - 1);
  }, [chartData.length]);

  // Helper function to build SVG paths
  const buildSvgPath = (getValue: (m: typeof chartData[0]) => number) => {
    if (chartData.length === 0) return { area: '', line: '' };
    let area = `M ${paddingLeft} ${chartHeight - paddingBottom}`;
    let line = '';

    chartData.forEach((msg, i) => {
      const x = paddingLeft + i * xStep;
      const val = getValue(msg);
      const barHeight = ((chartHeight - paddingTop - paddingBottom) * val) / maxVal;
      const y = chartHeight - paddingBottom - barHeight;
      if (i === 0) {
        line = `M ${x} ${y}`;
      } else {
        line += ` L ${x} ${y}`;
      }
      area += ` L ${x} ${y}`;
    });

    const lastX = paddingLeft + (chartData.length - 1) * xStep;
    area += ` L ${lastX} ${chartHeight - paddingBottom} Z`;
    return { area, line };
  };

  const totalPath = useMemo(() => buildSvgPath(m => m.callTokensTotal), [chartData, maxVal, xStep]);
  const narratorPath = useMemo(() => buildSvgPath(m => m.narratorTotal), [chartData, maxVal, xStep]);
  const judgePath = useMemo(() => buildSvgPath(m => m.judgeTotal), [chartData, maxVal, xStep]);

  return (
    <div className="max-w-md lg:max-w-none lg:w-full mx-auto min-h-screen px-4 lg:px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Navigation & Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setView('home')}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
            title="Go back to Home"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <div>
            <h1 className="text-xl font-serif font-medium text-zinc-100">Tale Analytics</h1>
            <p className="text-[10px] font-sans text-zinc-400 truncate max-w-[280px]">
              Analyzing tokens & memory for: <span className="text-zinc-200 font-semibold">{story.title}</span>
            </p>
          </div>
        </div>

        {/* Bento Grid Metrics Summary (4 Core Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {/* 1. Total Consumed */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Total Consumed</span>
              <span className="text-2xl font-mono font-bold text-zinc-100 mt-1 block">
                {totalConsumedTokens.toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 mt-2 block leading-snug">
              Total prompt + completion tokens consumed across all turns (Judge + Narrator).
            </span>
          </div>

          {/* 2. Active Prompt */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-emerald-500 uppercase tracking-wider block font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Prompt
              </span>
              <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">
                {activePromptSize.toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 mt-2 block leading-snug">
              Context window size of the next API call (System + {Math.min(totalMessagesCount, 10)} active messages).
            </span>
          </div>

          {/* 3. Messages */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 rounded-lg shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block font-semibold uppercase tracking-wider">Messages</span>
                <span className="text-sm font-semibold text-zinc-200 font-mono">
                  {totalMessagesCount} ({messageTokensList.filter(m => m.isActive).length} active)
                </span>
              </div>
            </div>
            <span className="text-[9px] text-zinc-400 mt-2 block leading-snug">
              {masterMessagesList.length} AI responses • {totalMessagesCount - masterMessagesList.length} player turns.
            </span>
          </div>

          {/* 4. Memory Size */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 rounded-lg shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block font-semibold uppercase tracking-wider">Memory Size</span>
                <span className="text-sm font-semibold text-zinc-200 font-mono">
                  {(loreTokens + journalTokens).toLocaleString()} tok
                </span>
              </div>
            </div>
            <span className="text-[9px] text-zinc-400 mt-2 block leading-snug">
              Persistent memory: Lorebook ({loreTokens} tok) + AI Journal ({journalTokens} tok).
            </span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            {/* Segmented Tabs (Simplified: Call N Volume & Prompt Setup) */}
            <div className="flex border-b border-zinc-900 mb-4 bg-zinc-950/40 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'chart'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Call N Volume</span>
              </button>
              <button
                onClick={() => setActiveTab('context')}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'context'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Prompt Setup</span>
              </button>
            </div>

            {/* Tab 1: Call N Volume Chart with Decomposition */}
            {activeTab === 'chart' && (
              <div className="space-y-4">
                {totalMessagesCount === 0 ? (
                  <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                    <BarChart2 className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400 px-6 leading-relaxed">
                      No dialogue messages found for this story yet. Start chatting to populate Call N token volume!
                    </p>
                  </div>
                ) : (
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4">
                    {/* Chart Header + Decomposition Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                          Call N Volume (In + Out Tokens)
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          Total combined tokens per master turn (Judge + Narrator).
                        </span>
                      </div>
                      
                      {/* Decomposition toggle buttons */}
                      <div className="flex bg-zinc-900 border border-zinc-850 rounded-lg p-0.5 text-[9px] font-semibold">
                        <button
                          onClick={() => setBreakdownView('combined')}
                          className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                            breakdownView === 'combined'
                              ? 'bg-zinc-800 text-purple-300 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Total Call Volume (Judge in+out + Narrator in+out)"
                        >
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                          <span>Total</span>
                        </button>
                        <button
                          onClick={() => setBreakdownView('split')}
                          className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                            breakdownView === 'split'
                              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Decomposed View: Judge & Narrator separately"
                        >
                          <span>Split</span>
                        </button>
                        <button
                          onClick={() => setBreakdownView('judge')}
                          className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                            breakdownView === 'judge'
                              ? 'bg-zinc-800 text-amber-300 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Judge (In + Out)"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span>Judge</span>
                        </button>
                        <button
                          onClick={() => setBreakdownView('narrator')}
                          className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                            breakdownView === 'narrator'
                              ? 'bg-zinc-800 text-emerald-300 shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Narrator (In + Out)"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>Narrator</span>
                        </button>
                      </div>
                    </div>

                    {/* SVG Visual Chart */}
                    <div className="relative">
                      {chartData.length === 0 ? (
                        <div className="text-center py-6 text-[10px] text-zinc-500">
                          No turns recorded.
                        </div>
                      ) : (
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="total-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="narrator-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="judge-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Horizontal Guide Lines */}
                          {[0, 0.5, 1].map((r, i) => {
                            const yVal = paddingTop + (chartHeight - paddingTop - paddingBottom) * r;
                            const labelVal = Math.round(maxVal * (1 - r));
                            return (
                              <g key={i}>
                                <line 
                                  x1={paddingLeft} 
                                  y1={yVal} 
                                  x2={chartWidth - paddingRight} 
                                  y2={yVal} 
                                  stroke="#27272a" 
                                  strokeWidth="1" 
                                  strokeDasharray="2,4"
                                  opacity="0.5"
                                />
                                <text 
                                  x={paddingLeft - 5} 
                                  y={yVal + 3} 
                                  className="text-[8px] font-mono fill-zinc-500 text-right" 
                                  textAnchor="end"
                                >
                                  {labelVal}
                                </text>
                              </g>
                            );
                          })}

                          {/* X-Axis baseline */}
                          <line 
                            x1={paddingLeft} 
                            y1={chartHeight - paddingBottom} 
                            x2={chartWidth - paddingRight} 
                            y2={chartHeight - paddingBottom} 
                            stroke="#27272a" 
                            strokeWidth="1" 
                          />

                          {/* Render Curves according to active breakdown view */}
                          {breakdownView === 'combined' && (
                            <>
                              <path d={totalPath.area} fill="url(#total-gradient)" />
                              <path d={totalPath.line} fill="none" stroke="#c084fc" strokeWidth="1.8" />
                            </>
                          )}

                          {breakdownView === 'split' && (
                            <>
                              <path d={narratorPath.area} fill="url(#narrator-gradient)" />
                              <path d={narratorPath.line} fill="none" stroke="#34d399" strokeWidth="1.6" />
                              <path d={judgePath.area} fill="url(#judge-gradient)" />
                              <path d={judgePath.line} fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3,2" />
                              <path d={totalPath.line} fill="none" stroke="#c084fc" strokeWidth="1.2" opacity="0.6" />
                            </>
                          )}

                          {breakdownView === 'narrator' && (
                            <>
                              <path d={narratorPath.area} fill="url(#narrator-gradient)" />
                              <path d={narratorPath.line} fill="none" stroke="#34d399" strokeWidth="1.8" />
                            </>
                          )}

                          {breakdownView === 'judge' && (
                            <>
                              <path d={judgePath.area} fill="url(#judge-gradient)" />
                              <path d={judgePath.line} fill="none" stroke="#fbbf24" strokeWidth="1.8" />
                            </>
                          )}

                          {/* Interactive data points & hover sensors */}
                          {chartData.map((msg, i) => {
                            const x = paddingLeft + i * xStep;
                            let targetVal = msg.callTokensTotal;
                            if (breakdownView === 'judge') targetVal = msg.judgeTotal;
                            if (breakdownView === 'narrator') targetVal = msg.narratorTotal;

                            const barHeight = ((chartHeight - paddingTop - paddingBottom) * targetVal) / maxVal;
                            const y = chartHeight - paddingBottom - barHeight;
                            const isHovered = hoveredMessageIndex === i;

                            return (
                              <g key={`point-${msg.id}`}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHovered ? 4.5 : 2.5}
                                  className={`transition-all duration-150 cursor-pointer ${
                                    breakdownView === 'judge'
                                      ? 'fill-amber-400 stroke-zinc-950'
                                      : breakdownView === 'narrator'
                                      ? 'fill-emerald-400 stroke-zinc-950'
                                      : 'fill-purple-400 stroke-zinc-950'
                                  }`}
                                  strokeWidth={isHovered ? 1.8 : 1}
                                  onMouseEnter={() => setHoveredMessageIndex(i)}
                                  onMouseLeave={() => setHoveredMessageIndex(null)}
                                />
                                
                                {/* Wide transparent sensor for touch & mouse */}
                                <rect
                                  x={x - (chartData.length > 1 ? xStep / 2 : 10)}
                                  y={paddingTop}
                                  width={chartData.length > 1 ? xStep : 20}
                                  height={chartHeight - paddingTop - paddingBottom}
                                  className="fill-transparent cursor-pointer opacity-0"
                                  onMouseEnter={() => setHoveredMessageIndex(i)}
                                  onMouseLeave={() => setHoveredMessageIndex(null)}
                                />

                                {/* X-Axis label */}
                                {(i === 0 || i === chartData.length - 1 || (chartData.length > 5 && i % Math.ceil(chartData.length / 4) === 0)) && (
                                  <text
                                    x={x}
                                    y={chartHeight - 6}
                                    className="text-[7px] font-mono fill-zinc-500"
                                    textAnchor="middle"
                                  >
                                    #{msg.index}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      )}
                    </div>

                    {/* Micro Tooltip display & Decomposition inspector */}
                    <div className="mt-4 border-t border-zinc-900 pt-3 min-h-[75px] flex items-center justify-center">
                      {hoveredMessageIndex !== null && chartData[hoveredMessageIndex] ? (
                        <div className="w-full text-[10px]">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                              <span>Turn #{chartData[hoveredMessageIndex].index}</span>
                              <span className="text-zinc-500">•</span>
                              <span className="text-purple-400 font-bold">
                                Total (In + Out): {chartData[hoveredMessageIndex].callTokensTotal.toLocaleString()} tok
                              </span>
                            </span>
                            <span className={chartData[hoveredMessageIndex].isActive ? 'text-emerald-500 font-mono text-[9px]' : 'text-zinc-500 font-mono text-[9px]'}>
                              {chartData[hoveredMessageIndex].isActive ? 'Active Window' : 'Archived'}
                            </span>
                          </div>

                          {/* Structured Decomposition breakdown (Judge vs Narrator) */}
                          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono bg-zinc-900/60 p-2 rounded-lg border border-zinc-850 mb-1.5">
                            <div className="flex flex-col">
                              <span className="text-amber-400 font-semibold flex items-center gap-1">
                                <Scale className="w-3 h-3" />
                                Giudice (Judge): {chartData[hoveredMessageIndex].judgeTotal.toLocaleString()} tok
                              </span>
                              <span className="text-zinc-400 text-[8px] pl-4">
                                In (Prompt): {chartData[hoveredMessageIndex].judgeIn} • Out: {chartData[hoveredMessageIndex].judgeOut}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                Narratore (Narrator): {chartData[hoveredMessageIndex].narratorTotal.toLocaleString()} tok
                              </span>
                              <span className="text-zinc-400 text-[8px] pl-4">
                                In (Prompt): {chartData[hoveredMessageIndex].narratorIn} • Out: {chartData[hoveredMessageIndex].narratorOut}
                              </span>
                            </div>
                          </div>

                          <p className="text-zinc-400 line-clamp-1 italic bg-zinc-900/30 p-1 rounded font-serif px-2 border border-zinc-900">
                            "{chartData[hoveredMessageIndex].content}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-500 italic flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          Hover over any turn in the chart to inspect the complete In + Out breakdown for Judge and Narrator.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Context Window Composition Simulation */}
            {activeTab === 'context' && (
              <div className="space-y-4">
                <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    Prompt Structure Breakdown
                  </span>

                  {/* Progress bar stack representing the context prompt size */}
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-zinc-900 rounded-lg overflow-hidden flex border border-zinc-800">
                      <div 
                        style={{ width: `${Math.max(5, (coreInstructionTokens / activePromptSize) * 100)}%` }} 
                        className="bg-zinc-600 h-full" 
                        title="System Instructions"
                      />
                      <div 
                        style={{ width: `${Math.max(5, (loreTokens / activePromptSize) * 100)}%` }} 
                        className="bg-amber-600 h-full" 
                        title="Lorebook"
                      />
                      <div 
                        style={{ width: `${Math.max(5, (charSheetTokens / activePromptSize) * 100)}%` }} 
                        className="bg-indigo-600 h-full" 
                        title="Character Stats"
                      />
                      <div 
                        style={{ width: `${Math.max(5, (journalTokens / activePromptSize) * 100)}%` }} 
                        className="bg-teal-600 h-full" 
                        title="Master Journal"
                      />
                      <div 
                        style={{ width: `${Math.max(5, (activeHistoryTokens / activePromptSize) * 100)}%` }} 
                        className="bg-emerald-600 h-full animate-pulse" 
                        title="Active History (Last 10)"
                      />
                    </div>

                    {/* Legend Breakdown items */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-2">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2.5 h-2.5 bg-zinc-600 rounded-sm shrink-0" />
                        <span className="truncate">Core Prompt:</span>
                        <strong className="text-zinc-200 font-mono ml-auto shrink-0">{coreInstructionTokens} tok</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2.5 h-2.5 bg-amber-600 rounded-sm shrink-0" />
                        <span className="truncate">Lorebook:</span>
                        <strong className="text-zinc-200 font-mono ml-auto shrink-0">{loreTokens} tok</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm shrink-0" />
                        <span className="truncate">Character Sheet:</span>
                        <strong className="text-zinc-200 font-mono ml-auto shrink-0">{charSheetTokens} tok</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2.5 h-2.5 bg-teal-600 rounded-sm shrink-0" />
                        <span className="truncate">AI Master Journal:</span>
                        <strong className="text-zinc-200 font-mono ml-auto shrink-0">{journalTokens} tok</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 col-span-2 border-t border-zinc-900 mt-1 pt-1">
                        <span className="w-2.5 h-2.5 bg-emerald-600 rounded-sm shrink-0 animate-pulse" />
                        <span>Dialogue (Last 10 msgs):</span>
                        <strong className="text-emerald-400 font-mono ml-auto shrink-0">{activeHistoryTokens} tok</strong>
                      </div>
                    </div>
                  </div>

                  {/* Information section on memory compression */}
                  <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg text-[9px] leading-relaxed text-zinc-400">
                    <p className="font-semibold text-zinc-200 mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Context Window Optimization
                    </p>
                    <p>
                      The LLM client maintains optimal context by submitting only the **last 10 messages**. Older exchanges are automatically synthesized into the **Lorebook** and **AI Master Journal** to preserve state and reduce cost.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Message Inspector (Searchable log of all messages) */}
          <div className="lg:col-span-5 mt-6 lg:mt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-zinc-400" />
                Dialogue Message List
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                {searchedMessagesList.length} of {totalMessagesCount} shown
              </span>
            </div>

            {/* Search bar */}
            {totalMessagesCount > 0 && (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in dialogue..."
                className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 placeholder-zinc-600 mb-3"
              />
            )}

            {/* List scrollable section */}
            {searchedMessagesList.length === 0 ? (
              <div className="text-center py-6 text-[10px] text-zinc-500 border border-dashed border-zinc-850 rounded-xl">
                {searchTerm ? 'No messages matches your search criteria.' : 'Dialogue log is empty.'}
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {searchedMessagesList.map((m) => (
                  <div 
                    key={m.id}
                    className={`border rounded-xl p-3 text-[10px] flex flex-col justify-between transition-colors ${
                      m.isActive 
                        ? 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900' 
                        : 'bg-zinc-950/20 border-zinc-900/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.role === 'player' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        <span className={m.role === 'player' ? 'text-blue-400' : 'text-emerald-400'}>
                          {m.role === 'player' ? 'Player' : 'AI GM'}
                        </span>
                      </span>
                      <div className="flex gap-2 items-center font-mono text-zinc-500 text-[9px]">
                        <span className="flex items-center gap-0.5">
                          <strong>{m.tokens}</strong>{' '}
                          <span className={`text-[8px] ${m.isApiMetric ? 'text-emerald-500' : 'text-zinc-650'}`}>
                            ({m.isApiMetric ? 'API' : 'Est'})
                          </span>
                        </span>
                        <span>•</span>
                        <span className={m.isActive ? 'text-emerald-500/80 font-semibold' : 'text-zinc-600'}>
                          {m.isActive ? 'Active' : 'Archived'}
                        </span>
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-serif break-words line-clamp-3">
                      "{m.content}"
                    </p>

                    {m.judgeNote && (
                      <div className="mt-2 p-2 bg-zinc-950 border border-amber-900/40 rounded-lg text-[9px] font-mono text-amber-300/90 leading-relaxed">
                        <span className="font-bold text-amber-400">⚖️ Judge Ruling:</span> {m.judgeNote}
                      </div>
                    )}
                    
                    {/* Detailed metadata */}
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-900/30 text-[8px] font-mono text-zinc-500 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span>Cumulative Dialogue: <strong className="text-purple-400">{(m.cumulativeTokens ?? 0).toLocaleString()} tok</strong></span>
                        {m.role === 'master' && (
                          <span>Call Total: <strong className="text-zinc-300">{m.callTokensTotal.toLocaleString()} tok</strong></span>
                        )}
                      </div>
                      {m.role === 'master' && (m.judgeTotal > 0 || m.narratorTotal > 0) && (
                        <div className="flex justify-between border-t border-zinc-900/20 pt-1 text-[7.5px] text-zinc-500">
                          <span>Giudice: <strong className="text-amber-400/90">{m.judgeTotal} tok</strong></span>
                          <span>Narratore: <strong className="text-emerald-400/90">{m.narratorTotal} tok</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-zinc-900 text-center text-[10px] text-zinc-500">
        OmniTale Diagnostic Engine • Real-time Context Consolidation View
      </div>
    </div>
  );
};
