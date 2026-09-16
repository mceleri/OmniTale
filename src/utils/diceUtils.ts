import {
  FateTier,
  FateOracleRoll,
  StochasticDimension,
  CampaignStochasticMatrix,
} from '../types/story';

/**
 * Generate a random integer between min and max inclusive.
 */
export const rollD100 = (): number => {
  return Math.floor(Math.random() * 100) + 1;
};

/**
 * Classifies a D100 roll into a standard narrative Fate Tier.
 */
export const classifyFateTier = (roll: number): {
  tier: FateTier;
  label: string;
  narrativeDirective: string;
} => {
  if (roll <= 10) {
    return {
      tier: 'very_unfavorable',
      label: 'Very Unfavorable / Disaster',
      narrativeDirective: '"No, and furthermore..." (Critical complication, failure, or major unforeseen hindrance)',
    };
  }
  if (roll <= 40) {
    return {
      tier: 'unfavorable',
      label: 'Unfavorable / Obstacle',
      narrativeDirective: '"No, but..." or "Yes, but at a steep cost" (Friction, partial failure, or costly progress)',
    };
  }
  if (roll <= 59) {
    return {
      tier: 'neutral',
      label: 'Neutral / Balanced',
      narrativeDirective: '"Yes, but..." (Status quo holds; balanced effort, standard resistance, or fair outcome)',
    };
  }
  if (roll <= 89) {
    return {
      tier: 'favorable',
      label: 'Favorable / Opportunity',
      narrativeDirective: '"Yes" (Clean success, positive circumstance, or helpful opening)',
    };
  }
  return {
    tier: 'very_favorable',
    label: 'Very Favorable / Triumph',
    narrativeDirective: '"Yes, and furthermore..." (Critical triumph, serendipitous advantage, or unexpected windfall)',
  };
};

/**
 * Rolls a Turn-by-Turn Fate Oracle D100.
 */
export const rollFateOracle = (): FateOracleRoll => {
  const value = rollD100();
  const classified = classifyFateTier(value);
  return {
    value,
    tier: classified.tier,
    label: classified.label,
    narrativeDirective: classified.narrativeDirective,
  };
};

/**
 * Classifies a dimension for the initial campaign stochastic matrix.
 */
const classifyDimension = (
  value: number,
  dimensionType: 'environment' | 'socialClimate' | 'resources' | 'entourage' | 'catalyst'
): StochasticDimension => {
  const classified = classifyFateTier(value);
  let guidance = '';

  switch (dimensionType) {
    case 'environment':
      switch (classified.tier) {
        case 'very_unfavorable':
          guidance = 'Severely degraded, structurally hazardous, under active municipal siege, or located in a dangerous, contaminated zone.';
          break;
        case 'unfavorable':
          guidance = 'Dilapidated, leaky, vulnerable to break-ins, cramped, noisy, or visibly worn out.';
          break;
        case 'neutral':
          guidance = 'Functional, modest, standard safety and shelter, typical for the district.';
          break;
        case 'favorable':
          guidance = 'Comfortable, well-maintained, easily defensible, discreet, or advantageous location.';
          break;
        case 'very_favorable':
          guidance = 'Prestigious, heavily fortified, pristine condition, tactically superior, or opulent.';
          break;
      }
      break;

    case 'socialClimate':
      switch (classified.tier) {
        case 'very_unfavorable':
          guidance = 'Paranoid witch-hunt, intense surveillance, aggressive bounties, or extreme hostility toward the protagonists.';
          break;
        case 'unfavorable':
          guidance = 'Cold suspicion, gossiping neighbors, frequent official patrols, or wary distrust toward outsiders.';
          break;
        case 'neutral':
          guidance = 'Civic indifference; citizens mind their own business; standard regulatory bureaucracy.';
          break;
        case 'favorable':
          guidance = 'Tolerant, communal solidarity, friendly local shopkeepers, or sympathetic local guards.';
          break;
        case 'very_favorable':
          guidance = 'Protected or beloved haven; high communal respect; authorities actively turn a blind eye or offer aid.';
          break;
      }
      break;

    case 'resources':
      switch (classified.tier) {
        case 'very_unfavorable':
          guidance = 'Crushing debt, empty vault, broken or confiscated tools, zero supplies, imminent default.';
          break;
        case 'unfavorable':
          guidance = 'Material scarcity, overdue payments, faulty gear, operating on bare emergency reserves.';
          break;
        case 'neutral':
          guidance = 'Adequate operational supplies, standard tools, modest cash reserves to cover basic upkeep.';
          break;
        case 'favorable':
          guidance = 'Healthy cash flow, well-stocked inventory, dependable trade connections, quality equipment.';
          break;
        case 'very_favorable':
          guidance = 'Abundant wealth, rare or masterwork materials, open credit lines, surplus specialized gear.';
          break;
      }
      break;

    case 'entourage':
      switch (classified.tier) {
        case 'very_unfavorable':
          guidance = 'Under severe external pressure or blackmailed; deeply terrified, compromised, or harboring bitter resentment.';
          break;
        case 'unfavorable':
          guidance = 'Anxious, distracted by personal debts or crises, cautious and reluctant to take any risks.';
          break;
        case 'neutral':
          guidance = 'Pragmatic, strictly professional, busy with own duties, reliable within reasonable bounds.';
          break;
        case 'favorable':
          guidance = 'High morale, eager to assist, shares useful rumors or leads, willing to do small favors.';
          break;
        case 'very_favorable':
          guidance = 'Fiercely loyal, proactive, brings gifts or high-value intelligence, ready to stand together in crisis.';
          break;
      }
      break;

    case 'catalyst':
      switch (classified.tier) {
        case 'very_unfavorable':
          guidance = 'An acute emergency has just struck right as the story opens (e.g. a surprise raid, an impossible deadline, a break-in, or an aggressive debt-collector at the door).';
          break;
        case 'unfavorable':
          guidance = 'A pressing dilemma or friction demands immediate attention (e.g. a vital delivery arrived damaged, a key contact went missing, or a threatening summons arrived).';
          break;
        case 'neutral':
          guidance = 'A steady, routine start with brewing undercurrents (standard operations, but rumors and subtle signs of impending trouble).';
          break;
        case 'favorable':
          guidance = 'A promising opportunity presents itself (e.g. an intriguing visitor with a well-paying request, an active festival, or a rival faction temporarily off-balance).';
          break;
        case 'very_favorable':
          guidance = 'A rare stroke of fortune or major opening (e.g. an influential patron seeks confidential help, an unexpected windfall or rare find, or a celebratory public holiday).';
          break;
      }
      break;
  }

  return {
    value,
    tier: classified.tier,
    label: classified.label,
    guidance,
  };
};

/**
 * Rolls the 5-Axis Stochastic Matrix for a new campaign initialization.
 */
export const rollCampaignStochasticMatrix = (): CampaignStochasticMatrix => {
  return {
    environment: classifyDimension(rollD100(), 'environment'),
    socialClimate: classifyDimension(rollD100(), 'socialClimate'),
    resources: classifyDimension(rollD100(), 'resources'),
    entourage: classifyDimension(rollD100(), 'entourage'),
    catalyst: classifyDimension(rollD100(), 'catalyst'),
  };
};

/**
 * Formats the Campaign Stochastic Matrix into a prompt block for the Master Journal generator.
 */
export const formatStochasticMatrixPrompt = (matrix: CampaignStochasticMatrix): string => {
  return `[CAMPAIGN STOCHASTIC MATRIX — INITIAL STARTING PARAMETERS]
The campaign opening MUST be grounded in the following 5 randomized structural axes (genre-agnostic):
1. LOCAL ENVIRONMENT & SHELTER: [Roll: ${matrix.environment.value}/100 - ${matrix.environment.label}]
   * Guideline: ${matrix.environment.guidance}
2. SOCIAL CLIMATE & COMMUNITY STANDING: [Roll: ${matrix.socialClimate.value}/100 - ${matrix.socialClimate.label}]
   * Guideline: ${matrix.socialClimate.guidance}
3. MATERIAL RESOURCES & LOGISTICS: [Roll: ${matrix.resources.value}/100 - ${matrix.resources.label}]
   * Guideline: ${matrix.resources.guidance}
4. ENTOURAGE & IMMEDIATE CONTACTS' DEMEANOR: [Roll: ${matrix.entourage.value}/100 - ${matrix.entourage.label}]
   * Guideline: ${matrix.entourage.guidance}
5. INCITING CATALYST / OPENING INCIDENT: [Roll: ${matrix.catalyst.value}/100 - ${matrix.catalyst.label}]
   * Guideline: ${matrix.catalyst.guidance}

CRITICAL INTEGRATION DIRECTIVE:
You MUST integrate these 5 concrete conditions directly into Act 1, the opening scenario, and the primary conflict hooks of the Master Journal. Do NOT ignore low rolls or smooth over difficulties with a generic peaceful shop opening! Reflect the material, social, and psychological realities dictated by these rolls.`;
};
