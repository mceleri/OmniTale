import React, { useState, useMemo } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import { Message } from '../types/story';
import { parseMarkdownToBlocks } from '../utils/markdownParser';
import { formatUnifiedPrompt } from '../utils/prompts/storyPrompts';
import { estimateTokens } from '../utils/tokenEstimator';
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  HelpCircle,
  Database,
  BarChart2
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { stories, activeStoryId, setView, masterFeedback } = useStoryStore();
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);
  const [chartFilter, setChartFilter] = useState<'all' | 'player' | 'master'>('all');
  const [chartViewMode, setChartViewMode] = useState<'individual' | 'cumulative'>('individual');
  const [activeTab, setActiveTab] = useState<'chart' | 'context' | 'lore'>('chart');
  const [searchTerm, setSearchTerm] = useState('');

  // Find the selected story
  const story = useMemo(() => {
    return stories.find((s) => s.id === activeStoryId);
  }, [stories, activeStoryId]);

  // If no story is loaded or selected, render an error state
  if (!story) {
    return (
      <div className="max-w-md lg:max-w-5xl mx-auto min-h-screen px-6 py-8 flex flex-col justify-center items-center">
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
  const feedbackText = story.dynamicState.masterFeedback !== undefined
    ? story.dynamicState.masterFeedback
    : (masterFeedback || '');

  // Token calculations
  const totalMessagesCount = story.messages.length;
  
  // Individual system items
  const loreTokens = estimateTokens(loreText);
  const charSheetTokens = estimateTokens(charSheetText);
  const journalTokens = estimateTokens(journalText);
  const feedbackTokens = estimateTokens(feedbackText);
  const coreInstructionTokens = 350; // Approximating base prompt text tokens in formatUnifiedPrompt

  // Unified system prompt size
  const totalSystemTokens = useMemo(() => {
    const fullUnifiedText = formatUnifiedPrompt(loreText, charSheetText, journalText, feedbackText);
    return estimateTokens(fullUnifiedText);
  }, [loreText, charSheetText, journalText, feedbackText]);

  // Entire message history token sum
  const messageTokensList = useMemo(() => {
    let cumulative = 0;
    return story.messages.map((m, idx) => {
      const isApiMetric = m.tokens !== undefined;
      const tokens = isApiMetric ? m.tokens! : estimateTokens(m.content);
      cumulative += tokens;

      // Calculate preceding active messages (last 10 up to this message, excluding this message itself)
      const precedingMessages = story.messages.slice(0, idx);
      const precedingActive = precedingMessages.slice(-9); // up to 9 preceding messages so that with the triggering user message it makes 10
      const precedingActiveTokens = precedingActive.reduce((sum, prevMsg) => {
        const prevTokens = prevMsg.tokens !== undefined ? prevMsg.tokens! : estimateTokens(prevMsg.content);
        return sum + prevTokens;
      }, 0);

      const estimatedPromptTokens = totalSystemTokens + precedingActiveTokens;
      const actualPromptTokens = m.promptTokens;
      const promptTokensToUse = actualPromptTokens !== undefined ? actualPromptTokens : estimatedPromptTokens;
      
      const callTokens = m.role === 'master' 
        ? (promptTokensToUse + tokens) 
        : promptTokensToUse;

      return {
        index: idx + 1,
        id: m.id,
        role: m.role,
        content: m.content,
        tokens,
        cumulativeTokens: cumulative,
        callTokens,
        promptTokensUsed: promptTokensToUse,
        chars: m.content.length,
        isActive: totalMessagesCount - idx <= 10, // Last 10 messages are sent to the LLM
        isApiMetric,
        promptTokens: m.promptTokens,
      };
    });
  }, [story.messages, totalMessagesCount, totalSystemTokens]);

  const totalMessageTokens = useMemo(() => {
    return messageTokensList.reduce((acc, curr) => acc + curr.tokens, 0);
  }, [messageTokensList]);

  // Tokens of messages sent to the LLM (last 10)
  const activeHistoryTokens = useMemo(() => {
    return messageTokensList
      .filter(m => m.isActive)
      .reduce((acc, curr) => acc + curr.tokens, 0);
  }, [messageTokensList]);

  // Older messages (above the last 10) that are NOT sent directly
  const archivedHistoryTokens = useMemo(() => {
    return messageTokensList
      .filter(m => !m.isActive)
      .reduce((acc, curr) => acc + curr.tokens, 0);
  }, [messageTokensList]);

  // Current Total Active Request Size (Prompt + Last 10 Messages)
  const activePromptSize = totalSystemTokens + activeHistoryTokens;

  // Lorebook aspects parsed
  const loreAspects = useMemo(() => {
    const blocks = parseMarkdownToBlocks(loreText);
    return blocks.map((b) => ({
      ...b,
      tokens: estimateTokens(b.content),
      chars: b.content.length
    })).sort((a, b) => b.tokens - a.tokens); // heaviest first
  }, [loreText]);

  // Filter messages for chart
  const filteredChartMessages = useMemo(() => {
    if (chartFilter === 'all') return messageTokensList;
    return messageTokensList.filter(m => m.role === chartFilter);
  }, [messageTokensList, chartFilter]);

  // Search/Filter messages for the table list below
  const searchedMessagesList = useMemo(() => {
    if (!searchTerm.trim()) return messageTokensList;
    return messageTokensList.filter(m => 
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messageTokensList, searchTerm]);

  // Prepare simple SVG chart parameters
  const chartHeight = 120;
  const chartWidth = 320;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;

  const maxVal = useMemo(() => {
    if (filteredChartMessages.length === 0) return 100;
    const values = filteredChartMessages.map(m => 
      chartViewMode === 'individual' ? m.tokens : m.callTokens
    );
    const max = Math.max(...values);
    return max < 50 ? 50 : Math.ceil(max / 50) * 50; // round up to multiple of 50
  }, [filteredChartMessages, chartViewMode]);

  const xStep = useMemo(() => {
    if (filteredChartMessages.length <= 1) return chartWidth - paddingLeft - paddingRight;
    return (chartWidth - paddingLeft - paddingRight) / (filteredChartMessages.length - 1);
  }, [filteredChartMessages.length]);

  // SVG Path generation for cumulative mode
  const areaPath = useMemo(() => {
    if (filteredChartMessages.length === 0 || chartViewMode !== 'cumulative') return '';
    let d = `M ${paddingLeft} ${chartHeight - paddingBottom}`;
    filteredChartMessages.forEach((msg, i) => {
      const x = paddingLeft + i * xStep;
      const val = msg.callTokens;
      const barHeight = ((chartHeight - paddingTop - paddingBottom) * val) / maxVal;
      const y = chartHeight - paddingBottom - barHeight;
      d += ` L ${x} ${y}`;
    });
    const lastX = paddingLeft + (filteredChartMessages.length - 1) * xStep;
    d += ` L ${lastX} ${chartHeight - paddingBottom} Z`;
    return d;
  }, [filteredChartMessages, chartViewMode, maxVal, xStep]);

  const linePath = useMemo(() => {
    if (filteredChartMessages.length === 0 || chartViewMode !== 'cumulative') return '';
    let d = '';
    filteredChartMessages.forEach((msg, i) => {
      const x = paddingLeft + i * xStep;
      const val = msg.callTokens;
      const barHeight = ((chartHeight - paddingTop - paddingBottom) * val) / maxVal;
      const y = chartHeight - paddingBottom - barHeight;
      if (i === 0) {
        d = `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    });
    return d;
  }, [filteredChartMessages, chartViewMode, maxVal, xStep]);

  return (
    <div className="max-w-md lg:max-w-5xl mx-auto min-h-screen px-4 py-6 flex flex-col justify-between">
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

        {/* Bento Grid Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          {/* Total Story Tokens */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Total Consumed</span>
              <span className="text-2xl font-mono font-bold text-zinc-100 mt-1 block">
                {(totalMessageTokens + totalSystemTokens).toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 mt-2 block leading-snug">
              Combined tokens in this story's static lore & full dialogue history.
            </span>
          </div>

          {/* Active LLM Context Window */}
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
              Size of the next API call (System Context + {Math.min(totalMessagesCount, 10)} active messages).
            </span>
          </div>

          {/* Message Count */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 flex gap-2.5 items-center">
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

          {/* Memory Compression Ratio */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 flex gap-2.5 items-center">
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
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            {/* Diagnostic Segmented Tabs */}
        <div className="flex border-b border-zinc-900 mb-4 bg-zinc-950/40 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition ${
              activeTab === 'chart'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Token Chart
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition ${
              activeTab === 'context'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Prompt Setup
          </button>
          <button
            onClick={() => setActiveTab('lore')}
            className={`flex-1 py-2 text-center text-xs font-semibold rounded-md transition ${
              activeTab === 'lore'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Lore Weight
          </button>
        </div>

        {/* Tab 1: Interactive Token Chart */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            {totalMessagesCount === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                <BarChart2 className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 px-6 leading-relaxed">
                  No dialogue messages found for this story yet. Start chatting to populate token diagnostics!
                </p>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4">
                {/* Chart Header + Filter */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                    Dialogue Token Size
                  </span>
                  
                  {/* Mini Filter controls */}
                  <div className="flex bg-zinc-900 border border-zinc-850 rounded p-0.5 text-[9px] font-semibold">
                    <button
                      onClick={() => setChartFilter('all')}
                      className={`px-2 py-0.5 rounded transition ${chartFilter === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setChartFilter('player')}
                      className={`px-2 py-0.5 rounded transition ${chartFilter === 'player' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Player
                    </button>
                    <button
                      onClick={() => setChartFilter('master')}
                      className={`px-2 py-0.5 rounded transition ${chartFilter === 'master' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      AI GM
                    </button>
                  </div>
                </div>

                {/* Mode Selector Toggle */}
                <div className="flex border border-zinc-850 bg-zinc-900 rounded-lg p-0.5 mb-4 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setChartViewMode('individual')}
                    className={`flex-1 py-1.5 text-center rounded transition ${
                      chartViewMode === 'individual'
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Individual Weight (Bars)
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewMode('cumulative')}
                    className={`flex-1 py-1.5 text-center rounded transition ${
                      chartViewMode === 'cumulative'
                        ? 'bg-zinc-800 text-purple-400 shadow-sm font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Call N Volume (Area)
                  </button>
                </div>

                {/* SVG Visual Chart */}
                <div className="relative">
                  {filteredChartMessages.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-zinc-500">
                      No messages match the active role filter.
                    </div>
                  ) : (
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                      {/* Gradients */}
                      <defs>
                        <linearGradient id="cumulative-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Horizontal Guide Lines */}
                      {[0, 0.5, 1].map((r, i) => {
                        const yVal = paddingTop + (chartHeight - paddingTop - paddingBottom) * r;
                        const labelVal = Math.round(maxVal * (1 - r));
                        return (
                          <g key={i} className="opacity-40">
                            <line 
                              x1={paddingLeft} 
                              y1={yVal} 
                              x2={chartWidth - paddingRight} 
                              y2={yVal} 
                              stroke="#27272a" 
                              strokeWidth="1" 
                              strokeDasharray="2,4"
                            />
                            <text 
                              x={paddingLeft - 6} 
                              y={yVal + 3} 
                              className="text-[8px] font-mono fill-zinc-600 text-right" 
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

                      {/* Individual Bar Plot mode */}
                      {chartViewMode === 'individual' && filteredChartMessages.map((msg, i) => {
                        const x = paddingLeft + i * xStep;
                        const barHeight = ((chartHeight - paddingTop - paddingBottom) * msg.tokens) / maxVal;
                        const y = chartHeight - paddingBottom - barHeight;
                        const isHovered = hoveredMessageIndex === i;

                        // Alternate colors based on role
                        const barColor = msg.role === 'player' ? 'fill-blue-500/80 hover:fill-blue-400' : (msg.role === 'master' ? 'fill-emerald-500/80 hover:fill-emerald-400' : 'fill-purple-500/80 hover:fill-purple-400');
                        const borderStroke = isHovered ? '#f4f4f5' : (msg.isActive ? '#3f3f46' : 'none');

                        return (
                          <g key={msg.id}>
                            <rect
                              x={x - 2.5}
                              y={y}
                              width="5"
                              height={Math.max(barHeight, 2)}
                              className={`transition-colors duration-150 cursor-pointer ${barColor}`}
                              stroke={borderStroke}
                              strokeWidth="1"
                              onMouseEnter={() => setHoveredMessageIndex(i)}
                              onMouseLeave={() => setHoveredMessageIndex(null)}
                            />
                            {/* X-Axis labels */}
                            {(i === 0 || i === filteredChartMessages.length - 1 || (filteredChartMessages.length > 5 && i % Math.ceil(filteredChartMessages.length / 4) === 0)) && (
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

                      {/* Cumulative Line/Area Plot mode */}
                      {chartViewMode === 'cumulative' && (
                        <>
                          <path d={areaPath} fill="url(#cumulative-gradient)" />
                          <path d={linePath} fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                          
                          {filteredChartMessages.map((msg, i) => {
                            const x = paddingLeft + i * xStep;
                            const barHeight = ((chartHeight - paddingTop - paddingBottom) * msg.callTokens) / maxVal;
                            const y = chartHeight - paddingBottom - barHeight;
                            const isHovered = hoveredMessageIndex === i;

                            return (
                              <g key={`point-${msg.id}`}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHovered ? 4 : 2.5}
                                  className="fill-purple-500 stroke-zinc-950 transition-all duration-150 cursor-pointer"
                                  strokeWidth={isHovered ? 1.5 : 1}
                                  onMouseEnter={() => setHoveredMessageIndex(i)}
                                  onMouseLeave={() => setHoveredMessageIndex(null)}
                                />
                                {/* Transparent wide hover sensor */}
                                <rect
                                  x={x - (filteredChartMessages.length > 1 ? xStep / 2 : 10)}
                                  y={paddingTop}
                                  width={filteredChartMessages.length > 1 ? xStep : 20}
                                  height={chartHeight - paddingTop - paddingBottom}
                                  className="fill-transparent cursor-pointer opacity-0"
                                  onMouseEnter={() => setHoveredMessageIndex(i)}
                                  onMouseLeave={() => setHoveredMessageIndex(null)}
                                />
                                {/* X-Axis labels */}
                                {(i === 0 || i === filteredChartMessages.length - 1 || (filteredChartMessages.length > 5 && i % Math.ceil(filteredChartMessages.length / 4) === 0)) && (
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
                        </>
                      )}
                    </svg>
                  )}
                </div>

                {/* Micro Tooltip display */}
                <div className="mt-4 border-t border-zinc-900 pt-3 min-h-[65px] flex items-center justify-center">
                  {hoveredMessageIndex !== null && filteredChartMessages[hoveredMessageIndex] ? (
                    <div className="w-full text-[10px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-zinc-300">
                          Message #{filteredChartMessages[hoveredMessageIndex].index} •{' '}
                          <span className={filteredChartMessages[hoveredMessageIndex].role === 'player' ? 'text-blue-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {filteredChartMessages[hoveredMessageIndex].role === 'player' ? 'Player' : 'AI GM'}
                          </span>
                        </span>
                        <div className="flex gap-2 font-mono items-center">
                          <span className="text-zinc-400">
                            Tokens:{' '}
                            <strong className="text-zinc-200">
                              {filteredChartMessages[hoveredMessageIndex].tokens}
                            </strong>{' '}
                            <span className={filteredChartMessages[hoveredMessageIndex].isApiMetric ? 'text-emerald-500 text-[8px]' : 'text-zinc-600 text-[8px]'}>
                              ({filteredChartMessages[hoveredMessageIndex].isApiMetric ? 'API' : 'Est'})
                            </span>
                          </span>
                          <span>•</span>
                          <span className={filteredChartMessages[hoveredMessageIndex].isActive ? 'text-emerald-500 font-medium' : 'text-zinc-500'}>
                            {filteredChartMessages[hoveredMessageIndex].isActive ? 'Active' : 'Archived'}
                          </span>
                        </div>
                      </div>

                      {/* Cumulative Stats */}
                      <div className="flex justify-between items-center text-[9px] text-zinc-400 mb-1.5 font-mono border-b border-zinc-900/40 pb-1">
                        <span>
                          Call N Prompt: <strong className="text-emerald-400">{filteredChartMessages[hoveredMessageIndex].promptTokensUsed.toLocaleString()} tok</strong>
                        </span>
                        <span>
                          Call N Total Consumed: <strong className="text-purple-400">{filteredChartMessages[hoveredMessageIndex].callTokens.toLocaleString()} tok</strong>
                        </span>
                      </div>

                      {/* Show exact prompt context window if it was recorded for this turn! */}
                      {filteredChartMessages[hoveredMessageIndex].promptTokens !== undefined && (
                        <div className="text-[9px] text-zinc-500 mb-1 font-mono">
                          API Prompt Context Size at this turn:{' '}
                          <strong className="text-emerald-500/90">{filteredChartMessages[hoveredMessageIndex].promptTokens}</strong> tokens
                        </div>
                      )}

                      <p className="text-zinc-400 line-clamp-1 italic bg-zinc-900/60 p-1 rounded font-serif px-2 border border-zinc-850">
                        "{filteredChartMessages[hoveredMessageIndex].content}"
                      </p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 italic flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Hover over any element in the chart to inspect message token weights and Call N usage.
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
                <p className="mb-2">
                  The LLM client keeps the request window optimized by only submitting the **last 10 messages** (your active dialogue). Older history (<strong className="text-amber-500 font-mono">{archivedHistoryTokens} tokens</strong> in this story) is omitted to save costs and avoid memory clutter.
                </p>
                <p>
                  To prevent the AI from losing long-term memories, the background manager triggers an AI sweep **every 5 exchanges** to distill recent dialogue into the **Lorebook** and the **AI Master Journal**, safely preserving crucial details!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lore Weight (Breakdown of static blocks) */}
        {activeTab === 'lore' && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                Lorebook Aspect Weight Distribution
              </span>

              {loreAspects.length === 0 ? (
                <p className="text-[10px] text-zinc-500 italic py-4 text-center">
                  No aspects or blocks parsed in this lorebook.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {loreAspects.map((aspect, i) => {
                    const pctOfLore = loreTokens > 0 ? (aspect.tokens / loreTokens) * 100 : 0;
                    return (
                      <div key={aspect.id || i} className="bg-zinc-900/40 border border-zinc-850/60 rounded-lg p-2.5 text-[10px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-zinc-200 truncate max-w-[180px]">
                            {aspect.title || 'Untitled Aspect'}
                          </span>
                          <span className="font-mono text-zinc-400">
                            <strong>{aspect.tokens}</strong> tok <span className="text-zinc-600">({Math.round(pctOfLore)}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${pctOfLore}%` }} 
                            className="bg-amber-600 h-full rounded-full" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
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
                  
                  {/* Detailed metadata link */}
                  <div className="mt-1.5 pt-1.5 border-t border-zinc-900/30 text-[8px] font-mono text-zinc-500 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Cumulative Dialogue: <strong className="text-purple-400">{(m.cumulativeTokens ?? 0).toLocaleString()} tok</strong></span>
                      <span>Total Est. Request (No windowing): <strong className="text-zinc-400">{((m.cumulativeTokens ?? 0) + totalSystemTokens).toLocaleString()} tok</strong></span>
                    </div>
                    {m.promptTokens !== undefined && (
                      <div className="flex justify-between border-t border-zinc-900/10 pt-1 text-[7.5px] text-zinc-500">
                        <span>Actual API request size at this turn (with optimization):</span>
                        <strong className="text-emerald-500/90">{m.promptTokens} tokens</strong>
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
