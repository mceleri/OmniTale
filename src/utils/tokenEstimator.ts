/**
 * Token estimation helper designed to support multiple languages elegantly.
 * While English text averages 3.8 chars/token or words * 1.3, this helper dynamically
 * detects CJK, Cyrillic, and Arabic scripts to provide far more accurate estimates
 * when API metadata is not yet cached.
 */
export const estimateTokens = (text: string | undefined | null): number => {
  if (!text) return 0;
  
  // Detect scripts to adapt the estimation model
  const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  if (hasCJK) {
    // For CJK, each character is roughly 1.1 tokens
    return Math.ceil(chars * 1.1);
  }
  
  if (hasCyrillic || hasArabic) {
    // Non-latin alphabetic scripts tend to be around 2 characters per token
    return Math.ceil(chars / 2.0);
  }
  
  // For European and Latin-based scripts:
  // Romance languages, German, and English have slightly different structures.
  // We use a highly robust, slightly conservative Latin estimate of
  // ~3.2 characters per token, and ~1.35 * word count.
  const charEst = chars / 3.2;
  const wordEst = words * 1.35;
  
  return Math.ceil((charEst + wordEst) / 2);
};
