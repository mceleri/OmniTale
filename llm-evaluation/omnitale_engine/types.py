from dataclasses import dataclass, field
from typing import List, Dict, Optional, Literal, Any

Role = Literal['master', 'player', 'system_feedback']
NarratorStyle = Literal['cinematic', 'balanced', 'literary']
NarrativePropensity = Literal['cinematic', 'balanced', 'literary', 'character_driven', 'plot_driven']
FateTier = Literal['very_unfavorable', 'unfavorable', 'neutral', 'favorable', 'very_favorable']

@dataclass
class LoreBlock:
    id: str
    title: str
    content: str

@dataclass
class FateOracleRoll:
    value: int  # 1-100
    tier: FateTier
    label: str
    narrative_directive: str

@dataclass
class StochasticDimension:
    value: int  # 1-100
    tier: FateTier
    label: str
    guidance: str

@dataclass
class CampaignStochasticMatrix:
    environment: StochasticDimension
    social_climate: StochasticDimension
    resources: StochasticDimension
    entourage: StochasticDimension
    catalyst: StochasticDimension

@dataclass
class StageTokens:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    latency_sec: float = 0.0
    tokens_per_sec: float = 0.0

@dataclass
class TurnMetric:
    turn_index: int
    role: str
    stage: str  # 'player', 'turn_0', 'judge', 'narrator', 'lorebook_update', 'journal_update'
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    latency_sec: float
    tokens_per_sec: float
    context_tokens_cumulative: int
    ram_used_mb: float = 0.0
    vram_used_mb: Optional[float] = None
    fate_roll_value: Optional[int] = None
    fate_tier: Optional[str] = None
    pacing_tag: Optional[str] = None
    notes: Optional[str] = None

@dataclass
class Message:
    id: str
    role: Role
    content: str
    tokens: int = 0
    prompt_tokens: Optional[int] = None
    judge_note: Optional[str] = None
    fate_roll: Optional[FateOracleRoll] = None
    stochastic_matrix: Optional[CampaignStochasticMatrix] = None
    judge_tokens: Optional[StageTokens] = None
    narrator_tokens: Optional[StageTokens] = None
    timestamp: float = 0.0

@dataclass
class PromptSections:
    setting: str = ""
    character_sheet: str = ""
    factions: str = ""
    conflicts: str = ""
    historical_facts: str = ""
    lorebook: str = ""

@dataclass
class DynamicState:
    character_sheet: str
    lorebook: str
    master_journal: str
    master_feedback: str = ""
    setting: str = ""
    factions: str = ""
    conflicts: str = ""
    historical_facts: str = ""
    judge_scratchpad: List[str] = field(default_factory=list)
    stochastic_matrix: Optional[CampaignStochasticMatrix] = None
    default_starting_intent: str = ""
    starting_intent: str = ""

@dataclass
class PlayerPersona:
    short_term_goal: str = ""
    long_term_goal: str = ""
    mindset: str = ""
    playstyle: str = "balanced"  # 'cautious_investigator', 'bold_adventurer', 'diplomatic_socialite', 'cynical_mercenary', 'balanced'
    flaws_and_fears: str = ""
    scratchpad: List[str] = field(default_factory=list)

@dataclass
class Story:
    id: str
    type: Literal['tale', 'template']
    title: str = ""
    genre: str = ""
    synopsis: str = ""
    language: str = "English"
    narrative_propensity: NarrativePropensity = "balanced"
    dynamic_state: DynamicState = field(default_factory=lambda: DynamicState(character_sheet="", lorebook="", master_journal=""))
    player_persona: PlayerPersona = field(default_factory=PlayerPersona)
    messages: List[Message] = field(default_factory=list)
    created_at: float = 0.0
    updated_at: float = 0.0
