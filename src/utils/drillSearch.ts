import { DRILLS, difficultyDisplay, categoryDisplay } from "@/data";
import { Drill, Node } from "@/types";

/**
 * Calculates a quality score for a drill based on completeness and detail
 */
function calculateDrillQualityScore(drill: Drill): number {
  let score = 0;

  // Base score for having a drill
  score += 10;

  // Description quality (0-20 points)
  if (drill.description) {
    const descLength = drill.description.length;
    if (descLength > 200) score += 20;
    else if (descLength > 100) score += 15;
    else if (descLength > 50) score += 10;
    else if (descLength > 20) score += 5;
  }

  // Objectives quality (0-15 points)
  const validObjectives = drill.objectives.filter(
    (obj) => obj.trim().length > 10
  );
  score += Math.min(validObjectives.length * 5, 15);

  // Tips quality (0-15 points)
  const validTips = drill.tips.filter((tip) => tip.trim().length > 10);
  score += Math.min(validTips.length * 5, 15);

  // Video demonstration bonus (0-10 points)
  if (drill.videoUrl) {
    score += 10;
  }

  // Duration information (0-5 points)
  if (drill.duration) {
    score += 5;
  }

  // Drill complexity (0-10 points) - more shots = more complex
  const shotCount = Object.keys(drill.graph.nodes).length;
  if (shotCount >= 8) score += 10;
  else if (shotCount >= 6) score += 8;
  else if (shotCount >= 4) score += 6;
  else if (shotCount >= 2) score += 4;

  // Creator quality (0-5 points) - system drills get bonus
  if (drill.creatorId === "system") {
    score += 5;
  }

  return score;
}

/**
 * Enhanced search relevance scoring with improved phrase matching and shot-specific detection
 */
function calculateSearchRelevanceScore(
  drill: Drill,
  searchTerm: string
): number {
  const searchTermLower = searchTerm.toLowerCase();
  const searchWords = searchTermLower
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const searchableText = getDrillSearchableText(drill);

  let score = 0;

  // Exact phrase match (highest priority)
  if (searchableText.includes(searchTermLower)) {
    score += 200;
  }

  // Shot-specific phrase matching (e.g., "backhand down the line", "forehand topspin")
  const shotPhrases = extractShotPhrases(searchTermLower);
  const drillShots = extractDrillShots(drill);

  shotPhrases.forEach((phrase) => {
    if (drillShots.some((shot) => shot.includes(phrase))) {
      score += 150; // High score for exact shot matches
    }
  });

  // Multi-word phrase matching (words that should appear together)
  const multiWordPhrases = extractMultiWordPhrases(searchTermLower);
  multiWordPhrases.forEach((phrase) => {
    if (searchableText.includes(phrase)) {
      score += 100;
    }
  });

  // Word-by-word matching with proximity scoring
  const wordScores = searchWords.map((word) => {
    let wordScore = 0;

    // Name matches (highest relevance)
    if (drill.name.toLowerCase().includes(word)) {
      wordScore += 50;
    }

    // Description matches
    if (drill.description.toLowerCase().includes(word)) {
      wordScore += 30;
    }

    // Objectives matches
    drill.objectives.forEach((obj) => {
      if (obj.toLowerCase().includes(word)) {
        wordScore += 25;
      }
    });

    // Tips matches
    drill.tips.forEach((tip) => {
      if (tip.toLowerCase().includes(word)) {
        wordScore += 20;
      }
    });

    // Category matches
    drill.categories.forEach((cat) => {
      if (
        cat.toLowerCase().includes(word) ||
        categoryDisplay[cat].toLowerCase().includes(word)
      ) {
        wordScore += 15;
      }
    });

    // Difficulty matches
    if (
      drill.difficulty.toLowerCase().includes(word) ||
      difficultyDisplay[drill.difficulty].toLowerCase().includes(word)
    ) {
      wordScore += 10;
    }

    // General text match
    if (searchableText.includes(word)) {
      wordScore += 5;
    }

    return wordScore;
  });

  // Add word scores with proximity bonus
  const totalWordScore = wordScores.reduce((sum, score) => sum + score, 0);
  score += totalWordScore;

  // Proximity bonus: if multiple words are found close together, boost score
  if (searchWords.length > 1) {
    const proximityBonus = calculateProximityBonus(searchableText, searchWords);
    score += proximityBonus;
  }

  return score;
}

/**
 * Extracts shot-specific phrases from search terms
 */
function extractShotPhrases(searchTerm: string): string[] {
  const phrases: string[] = [];

  // Common shot patterns
  const shotPatterns = [
    /(backhand|forehand)\s+(down\s+the\s+line|crosscourt|middle)/,
    /(backhand|forehand)\s+(topspin|backspin|block|push)/,
    /(topspin|backspin|block|push)\s+(to\s+)?(backhand|forehand|middle)/,
    /(down\s+the\s+line|crosscourt)\s+(backhand|forehand)/,
  ];

  shotPatterns.forEach((pattern) => {
    const match = searchTerm.match(pattern);
    if (match) {
      phrases.push(match[0]);
    }
  });

  return phrases;
}

/**
 * Extracts multi-word phrases that should be matched together
 */
function extractMultiWordPhrases(searchTerm: string): string[] {
  const phrases: string[] = [];

  // Look for 2-3 word combinations
  const words = searchTerm.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
  }
  for (let i = 0; i < words.length - 2; i++) {
    phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  return phrases;
}

/**
 * Extracts all possible shot descriptions from a drill
 */
function extractDrillShots(drill: Drill): string[] {
  const shots: string[] = [];

  Object.values(drill.graph.nodes).forEach((node: Node) => {
    const { ball } = node;

    // Create shot descriptions
    const stroke = ball.stroke;
    const spin = ball.spin;
    const direction = ball.placement.direction;
    const depth = ball.placement.depth;

    // Basic shot combinations
    shots.push(`${stroke} ${spin}`);
    shots.push(`${stroke} to ${direction}`);
    shots.push(`${spin} to ${direction}`);

    // Direction-specific phrases
    if (direction === "backhand") {
      shots.push(`${stroke} backhand`);
      shots.push(`${spin} backhand`);
    } else if (direction === "forehand") {
      shots.push(`${stroke} forehand`);
      shots.push(`${spin} forehand`);
    }

    // Depth-specific phrases
    if (depth === "long") {
      shots.push(`${stroke} long`);
      shots.push(`${spin} long`);
    }

    // Common table tennis terms
    if (direction === "backhand" && depth === "long") {
      shots.push(`${stroke} down the line`);
      shots.push(`${spin} down the line`);
    }
    if (direction === "forehand" && depth === "long") {
      shots.push(`${stroke} crosscourt`);
      shots.push(`${spin} crosscourt`);
    }

    // Spin-specific terms
    if (spin === "top") {
      shots.push(`${stroke} topspin`);
      shots.push(`topspin ${stroke}`);
    } else if (spin === "back") {
      shots.push(`${stroke} backspin`);
      shots.push(`backspin ${stroke}`);
    } else if (spin === "block") {
      shots.push(`${stroke} block`);
      shots.push(`block ${stroke}`);
    }
  });

  return shots.map((shot) => shot.toLowerCase());
}

/**
 * Calculates proximity bonus for words that appear close together
 */
function calculateProximityBonus(text: string, words: string[]): number {
  if (words.length < 2) return 0;

  let bonus = 0;
  const textWords = text.split(/\s+/);

  // Find positions of each word
  const wordPositions: number[][] = words.map((word) => {
    const positions: number[] = [];
    textWords.forEach((textWord, index) => {
      if (textWord.includes(word)) {
        positions.push(index);
      }
    });
    return positions;
  });

  // Calculate minimum distance between any pair of words
  let minDistance = Infinity;
  for (let i = 0; i < wordPositions.length; i++) {
    for (let j = i + 1; j < wordPositions.length; j++) {
      for (const pos1 of wordPositions[i]) {
        for (const pos2 of wordPositions[j]) {
          const distance = Math.abs(pos1 - pos2);
          if (distance < minDistance) {
            minDistance = distance;
          }
        }
      }
    }
  }

  // Award bonus based on proximity (closer = higher bonus)
  if (minDistance < Infinity) {
    if (minDistance <= 2) bonus += 50; // Very close
    else if (minDistance <= 5) bonus += 30; // Close
    else if (minDistance <= 10) bonus += 15; // Moderate
  }

  return bonus;
}

/**
 * Extracts searchable text from a drill including name, strokes, spins, placements, and metadata
 */
function getDrillSearchableText(drill: Drill): string {
  const searchableTerms: string[] = [
    drill.name.toLowerCase(),
    drill.description.toLowerCase(),
  ];

  // Add objectives
  drill.objectives.forEach((objective) => {
    searchableTerms.push(objective.toLowerCase());
  });

  // Add tips
  drill.tips.forEach((tip) => {
    searchableTerms.push(tip.toLowerCase());
  });

  // Add difficulty
  searchableTerms.push(drill.difficulty.toLowerCase());
  searchableTerms.push(difficultyDisplay[drill.difficulty].toLowerCase());

  // Add categories
  drill.categories.forEach((category) => {
    searchableTerms.push(category.toLowerCase());
    searchableTerms.push(categoryDisplay[category].toLowerCase());
    // Add alternative terms for categories
    if (category === "serve-receive") {
      searchableTerms.push("serve", "receive", "return", "service");
    }
    if (category === "match-play") {
      searchableTerms.push("match", "game", "competition");
    }
  });

  // Extract terms from all nodes in the drill
  Object.values(drill.graph.nodes).forEach((node: Node) => {
    const { ball } = node;

    // Add stroke types
    searchableTerms.push(ball.stroke.toLowerCase());

    // Add spin types
    searchableTerms.push(ball.spin.toLowerCase());
    if (ball.spin === "top") searchableTerms.push("topspin");
    if (ball.spin === "back") searchableTerms.push("backspin");
    if (ball.spin === "no") searchableTerms.push("float");

    // Add placement directions
    searchableTerms.push(ball.placement.direction.toLowerCase());
    if (ball.placement.direction === "forehand") searchableTerms.push("fh");
    if (ball.placement.direction === "backhand") searchableTerms.push("bh");

    // Add placement depths
    searchableTerms.push(ball.placement.depth.toLowerCase());
    if (ball.placement.depth === "halflong") searchableTerms.push("half-long");

    // Add opponent/player context
    if (ball.isOpponent) {
      searchableTerms.push("opponent", "defense", "defensive");
    } else {
      searchableTerms.push("attack", "offense", "offensive");
    }
  });

  return searchableTerms.join(" ");
}

/**
 * Enhanced drill search with intelligent scoring and sorting
 */
export function searchDrillsWithScoring(
  searchTerm: string,
  drills: Drill[] = DRILLS
): Array<{
  drill: Drill;
  score: number;
  relevanceScore: number;
  qualityScore: number;
}> {
  if (!searchTerm.trim()) {
    // When no search term, return all drills sorted by quality
    return drills
      .map((drill) => ({
        drill,
        score: calculateDrillQualityScore(drill),
        relevanceScore: 0,
        qualityScore: calculateDrillQualityScore(drill),
      }))
      .sort((a, b) => b.score - a.score);
  }

  const searchTermLower = searchTerm.toLowerCase();
  const searchWords = searchTermLower
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const scoredDrills = drills
    .map((drill) => {
      const searchableText = getDrillSearchableText(drill);

      // Check if all search words are found in the drill's searchable text
      const matchesSearch = searchWords.every((word) =>
        searchableText.includes(word)
      );

      if (!matchesSearch) {
        return null;
      }

      const relevanceScore = calculateSearchRelevanceScore(drill, searchTerm);
      const qualityScore = calculateDrillQualityScore(drill);

      // Combined score: 70% relevance, 30% quality
      const combinedScore = relevanceScore * 0.7 + qualityScore * 0.3;

      return {
        drill,
        score: combinedScore,
        relevanceScore,
        qualityScore,
      };
    })
    .filter(Boolean) as Array<{
    drill: Drill;
    score: number;
    relevanceScore: number;
    qualityScore: number;
  }>;

  // Sort by combined score (highest first)
  return scoredDrills.sort((a, b) => b.score - a.score);
}

/**
 * Filters drills based on search terms, looking at name, strokes, spins, and placements
 * @deprecated Use searchDrillsWithScoring for better results
 */
export function filterDrills(searchTerm: string): Drill[] {
  return searchDrillsWithScoring(searchTerm).map((result) => result.drill);
}

/**
 * Gets a random drill from the filtered results based on search terms
 */
export function getRandomDrill(searchTerm: string): Drill | null {
  const scoredDrills = searchDrillsWithScoring(searchTerm);

  if (scoredDrills.length === 0) {
    return null;
  }

  // Weighted random selection - higher scored drills have higher chance
  const totalScore = scoredDrills.reduce((sum, item) => sum + item.score, 0);
  let random = Math.random() * totalScore;

  for (const item of scoredDrills) {
    random -= item.score;
    if (random <= 0) {
      return item.drill;
    }
  }

  // Fallback to first drill
  return scoredDrills[0].drill;
}

/**
 * Gets multiple random drills (useful for showing alternatives)
 */
export function getRandomDrills(
  searchTerm: string,
  count: number = 3
): Drill[] {
  const scoredDrills = searchDrillsWithScoring(searchTerm);

  if (scoredDrills.length === 0) {
    return [];
  }

  // If we have fewer drills than requested, return all
  if (scoredDrills.length <= count) {
    return scoredDrills.map((result) => result.drill);
  }

  // Weighted random selection for multiple drills
  const selectedDrills: Drill[] = [];
  const availableDrills = [...scoredDrills];

  for (let i = 0; i < count; i++) {
    const totalScore = availableDrills.reduce(
      (sum, item) => sum + item.score,
      0
    );
    let random = Math.random() * totalScore;

    for (let j = 0; j < availableDrills.length; j++) {
      random -= availableDrills[j].score;
      if (random <= 0) {
        selectedDrills.push(availableDrills[j].drill);
        availableDrills.splice(j, 1);
        break;
      }
    }
  }

  return selectedDrills;
}

/**
 * Test function to verify search improvements
 * This can be called from the browser console for testing
 */
export function testSearchImprovements() {
  const testCases = [
    "backhand down the line",
    "forehand topspin",
    "backhand block",
    "topspin to backhand",
    "serve receive",
    "attack defense",
  ];

  console.log("Testing improved search algorithm:");

  testCases.forEach((searchTerm) => {
    const results = searchDrillsWithScoring(searchTerm);
    console.log(`\nSearch: "${searchTerm}"`);
    console.log(`Found ${results.length} drills`);

    if (results.length > 0) {
      console.log("Top 3 results:");
      results.slice(0, 3).forEach((result, index) => {
        console.log(
          `${index + 1}. ${result.drill.name} (score: ${result.score.toFixed(
            1
          )})`
        );
      });
    }
  });
}

/**
 * Detailed test showing shot-specific matching improvements
 */
export function testShotSpecificSearch() {
  console.log("=== Testing Shot-Specific Search Improvements ===");

  // Test "backhand down the line" search
  const backhandDownLineResults = searchDrillsWithScoring(
    "backhand down the line"
  );
  console.log(
    `\n"backhand down the line" search found ${backhandDownLineResults.length} drills`
  );

  if (backhandDownLineResults.length > 0) {
    console.log("Top results:");
    backhandDownLineResults.slice(0, 5).forEach((result, index) => {
      console.log(`${index + 1}. ${result.drill.name}`);
      console.log(
        `   Score: ${result.score.toFixed(
          1
        )} (Relevance: ${result.relevanceScore.toFixed(1)})`
      );

      // Show why this drill matched
      const drillShots = extractDrillShots(result.drill);
      const matchingShots = drillShots.filter(
        (shot) => shot.includes("backhand") && shot.includes("down the line")
      );
      if (matchingShots.length > 0) {
        console.log(`   Matching shots: ${matchingShots.join(", ")}`);
      }
    });
  }

  // Test "forehand topspin" search
  const forehandTopspinResults = searchDrillsWithScoring("forehand topspin");
  console.log(
    `\n"forehand topspin" search found ${forehandTopspinResults.length} drills`
  );

  if (forehandTopspinResults.length > 0) {
    console.log("Top results:");
    forehandTopspinResults.slice(0, 3).forEach((result, index) => {
      console.log(`${index + 1}. ${result.drill.name}`);
      console.log(
        `   Score: ${result.score.toFixed(
          1
        )} (Relevance: ${result.relevanceScore.toFixed(1)})`
      );
    });
  }
}
