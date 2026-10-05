import random
from typing import Dict, Optional, Union, Any
from .types import FateTier, FateOracleRoll, StochasticDimension, CampaignStochasticMatrix

def roll_d100() -> int:
    """Generate a random integer between 1 and 100 inclusive."""
    return random.randint(1, 100)

def classify_fate_tier(roll: int) -> Dict[str, str]:
    """Classifies a D100 roll into a standard narrative Fate Tier."""
    if roll <= 10:
        return {
            'tier': 'very_unfavorable',
            'label': 'Very Unfavorable / Severe Complication',
            'narrative_directive': '"No, and furthermore..." (Acute complication or failure strictly proportional to the action stakes. NEVER invent explosive retcons, instant death traps, or retroactive curses on mundane/safe actions).',
        }
    if roll <= 40:
        return {
            'tier': 'unfavorable',
            'label': 'Unfavorable / Obstacle',
            'narrative_directive': '"No, but..." or "Yes, but with grounded friction" (Partial progress or modest obstacle. In safe, routine, or conversational scenes, translates to minor delays, fatigue, or awkwardness, NOT lethal ambushes or sudden emergencies).',
        }
    if roll <= 59:
        return {
            'tier': 'neutral',
            'label': 'Neutral / Balanced',
            'narrative_directive': '"Yes, but..." (Status quo holds; balanced effort, standard resistance, or fair outcome without manufactured drama).',
        }
    if roll <= 89:
        return {
            'tier': 'favorable',
            'label': 'Favorable / Opportunity',
            'narrative_directive': '"Yes" (Clean success, positive circumstance, or helpful opening).',
        }
    return {
        'tier': 'very_favorable',
        'label': 'Very Favorable / Triumph',
        'narrative_directive': '"Yes, and furthermore..." (Critical triumph, serendipitous advantage, or unexpected windfall).',
    }

def roll_fate_oracle() -> FateOracleRoll:
    """Rolls a Turn-by-Turn Fate Oracle D100."""
    value = roll_d100()
    classified = classify_fate_tier(value)
    return FateOracleRoll(
        value=value,
        tier=classified['tier'],  # type: ignore
        label=classified['label'],
        narrative_directive=classified['narrative_directive']
    )

def classify_dimension(
    value: int,
    dimension_type: str
) -> StochasticDimension:
    """Classifies a dimension for the initial campaign stochastic matrix."""
    classified = classify_fate_tier(value)
    tier = classified['tier']
    guidance = ''

    if dimension_type == 'environment':
        if tier == 'very_unfavorable':
            guidance = 'Severely degraded, structurally hazardous, under active municipal siege, or located in a dangerous, contaminated zone.'
        elif tier == 'unfavorable':
            guidance = 'Dilapidated, leaky, vulnerable to break-ins, cramped, noisy, or visibly worn out.'
        elif tier == 'neutral':
            guidance = 'Functional, modest, standard safety and shelter, typical for the district.'
        elif tier == 'favorable':
            guidance = 'Comfortable, well-maintained, easily defensible, discreet, or advantageous location.'
        else:
            guidance = 'Prestigious, heavily fortified, pristine condition, tactically superior, or opulent.'

    elif dimension_type == 'social_climate':
        if tier == 'very_unfavorable':
            guidance = 'Paranoid witch-hunt, intense surveillance, aggressive bounties, or extreme hostility toward the protagonists.'
        elif tier == 'unfavorable':
            guidance = 'Cold suspicion, gossiping neighbors, frequent official patrols, or wary distrust toward outsiders.'
        elif tier == 'neutral':
            guidance = 'Civic indifference; citizens mind their own business; standard regulatory bureaucracy.'
        elif tier == 'favorable':
            guidance = 'Tolerant, communal solidarity, friendly local shopkeepers, or sympathetic local guards.'
        else:
            guidance = 'Protected or beloved haven; high communal respect; authorities actively turn a blind eye or offer aid.'

    elif dimension_type == 'resources':
        if tier == 'very_unfavorable':
            guidance = 'Crushing debt, empty vault, broken or confiscated tools, zero supplies, imminent default.'
        elif tier == 'unfavorable':
            guidance = 'Material scarcity, overdue payments, faulty gear, operating on bare emergency reserves.'
        elif tier == 'neutral':
            guidance = 'Adequate operational supplies, standard tools, modest cash reserves to cover basic upkeep.'
        elif tier == 'favorable':
            guidance = 'Healthy cash flow, well-stocked inventory, dependable trade connections, quality equipment.'
        else:
            guidance = 'Abundant wealth, rare or masterwork materials, open credit lines, surplus specialized gear.'

    elif dimension_type == 'entourage':
        if tier == 'very_unfavorable':
            guidance = 'Under severe external pressure or blackmailed; deeply terrified, compromised, or harboring bitter resentment.'
        elif tier == 'unfavorable':
            guidance = 'Anxious, distracted by personal debts or crises, cautious and reluctant to take any risks.'
        elif tier == 'neutral':
            guidance = 'Pragmatic, strictly professional, busy with own duties, reliable within reasonable bounds.'
        elif tier == 'favorable':
            guidance = 'High morale, eager to assist, shares useful rumors or leads, willing to do small favors.'
        else:
            guidance = 'Fiercely loyal, proactive, brings gifts or high-value intelligence, ready to stand together in crisis.'

    elif dimension_type == 'catalyst':
        if tier == 'very_unfavorable':
            guidance = 'An acute emergency has just struck right as the story opens (e.g. a surprise raid, an impossible deadline, a break-in, or an aggressive debt-collector at the door).'
        elif tier == 'unfavorable':
            guidance = 'A pressing dilemma or friction demands immediate attention (e.g. a vital delivery arrived damaged, a key contact went missing, or a threatening summons arrived).'
        elif tier == 'neutral':
            guidance = 'A steady, routine start with brewing undercurrents (standard operations, but rumors and subtle signs of impending trouble).'
        elif tier == 'favorable':
            guidance = 'A promising opportunity presents itself (e.g. an intriguing visitor with a well-paying request, an active festival, or a rival faction temporarily off-balance).'
        else:
            guidance = 'A rare stroke of fortune or major opening (e.g. an influential patron seeks confidential help, an unexpected windfall or rare find, or a celebratory public holiday).'

    return StochasticDimension(
        value=value,
        tier=tier,  # type: ignore
        label=classified['label'],
        guidance=guidance
    )

def create_stochastic_dimension(
    tier_or_value: Union[FateTier, int, str],
    dimension_type: str
) -> StochasticDimension:
    """Resolves a stochastic dimension from either a specific tier override, numerical roll, or 'random'."""
    if tier_or_value == 'random':
        return classify_dimension(roll_d100(), dimension_type)
    if isinstance(tier_or_value, int):
        return classify_dimension(tier_or_value, dimension_type)
    
    tier_map: Dict[str, int] = {
        'very_unfavorable': 5,
        'unfavorable': 25,
        'neutral': 50,
        'favorable': 75,
        'very_favorable': 95,
    }
    val = tier_map.get(str(tier_or_value), 50)
    return classify_dimension(val, dimension_type)

def roll_campaign_stochastic_matrix(overrides: Optional[Dict[str, Any]] = None) -> CampaignStochasticMatrix:
    """Rolls the 5-Axis Stochastic Matrix for a new campaign initialization."""
    ov = overrides or {}
    return CampaignStochasticMatrix(
        environment=create_stochastic_dimension(ov.get('environment', 'random'), 'environment'),
        social_climate=create_stochastic_dimension(ov.get('social_climate', 'random'), 'social_climate'),
        resources=create_stochastic_dimension(ov.get('resources', 'random'), 'resources'),
        entourage=create_stochastic_dimension(ov.get('entourage', 'random'), 'entourage'),
        catalyst=create_stochastic_dimension(ov.get('catalyst', 'random'), 'catalyst')
    )

def format_stochastic_matrix_prompt(matrix: CampaignStochasticMatrix) -> str:
    """Formats the Campaign Stochastic Matrix into a prompt block for the Master Journal generator."""
    return f"""[CAMPAIGN STOCHASTIC MATRIX — INITIAL STARTING PARAMETERS]
The campaign opening MUST be grounded in the following 5 randomized structural axes (genre-agnostic):
1. LOCAL ENVIRONMENT & SHELTER: [Roll: {matrix.environment.value}/100 - {matrix.environment.label}]
   * Guideline: {matrix.environment.guidance}
2. SOCIAL CLIMATE & COMMUNITY STANDING: [Roll: {matrix.social_climate.value}/100 - {matrix.social_climate.label}]
   * Guideline: {matrix.social_climate.guidance}
3. MATERIAL RESOURCES & LOGISTICS: [Roll: {matrix.resources.value}/100 - {matrix.resources.label}]
   * Guideline: {matrix.resources.guidance}
4. ENTOURAGE & IMMEDIATE CONTACTS' DEMEANOR: [Roll: {matrix.entourage.value}/100 - {matrix.entourage.label}]
   * Guideline: {matrix.entourage.guidance}
5. INCITING CATALYST / OPENING INCIDENT: [Roll: {matrix.catalyst.value}/100 - {matrix.catalyst.label}]
   * Guideline: {matrix.catalyst.guidance}

CRITICAL INTEGRATION DIRECTIVE:
You MUST integrate these 5 concrete conditions directly into Act 1, the opening scenario, and the primary conflict hooks of the Master Journal. Do NOT ignore low rolls or smooth over difficulties with a generic peaceful shop opening! Reflect the material, social, and psychological realities dictated by these rolls."""
