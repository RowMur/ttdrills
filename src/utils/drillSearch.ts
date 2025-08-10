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
 * Calculates search relevance score based on term matching
 */
function calculateSearchRelevanceScore(
  drill: Drill,
  searchTerm: string
): number {
  if (!searchTerm.trim()) return 0;

  const searchTermLower = searchTerm.toLowerCase();
  const searchWords = searchTermLower
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const searchableText = getDrillSearchableText(drill);

  let score = 0;

  // Exact phrase match (highest priority)
  if (searchableText.includes(searchTermLower)) {
    score += 100;
  }

  // Word-by-word matching
  searchWords.forEach((word) => {
    // Name matches (highest relevance)
    if (drill.name.toLowerCase().includes(word)) {
      score += 50;
    }

    // Description matches
    if (drill.description.toLowerCase().includes(word)) {
      score += 30;
    }

    // Objectives matches
    drill.objectives.forEach((obj) => {
      if (obj.toLowerCase().includes(word)) {
        score += 25;
      }
    });

    // Tips matches
    drill.tips.forEach((tip) => {
      if (tip.toLowerCase().includes(word)) {
        score += 20;
      }
    });

    // Category matches
    drill.categories.forEach((cat) => {
      if (
        cat.toLowerCase().includes(word) ||
        categoryDisplay[cat].toLowerCase().includes(word)
      ) {
        score += 15;
      }
    });

    // Difficulty matches
    if (
      drill.difficulty.toLowerCase().includes(word) ||
      difficultyDisplay[drill.difficulty].toLowerCase().includes(word)
    ) {
      score += 10;
    }

    // General text match
    if (searchableText.includes(word)) {
      score += 5;
    }
  });

  return score;
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
