import { DRILLS } from "@/data";
import { Drill, Node } from "@/types";

/**
 * Extracts searchable text from a drill including name, strokes, spins, and placements
 */
function getDrillSearchableText(drill: Drill): string {
  const searchableTerms: string[] = [drill.name.toLowerCase()];

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
      searchableTerms.push("opponent", "defense", "block");
    } else {
      searchableTerms.push("attack", "offense");
    }
  });

  return searchableTerms.join(" ");
}

/**
 * Filters drills based on search terms, looking at name, strokes, spins, and placements
 */
export function filterDrills(searchTerm: string): Drill[] {
  if (!searchTerm.trim()) {
    return DRILLS;
  }

  const searchTermLower = searchTerm.toLowerCase();
  const searchWords = searchTermLower
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return DRILLS.filter((drill) => {
    const searchableText = getDrillSearchableText(drill);

    // Check if all search words are found in the drill's searchable text
    return searchWords.every((word) => searchableText.includes(word));
  });
}

/**
 * Gets a random drill from the filtered results based on search terms
 */
export function getRandomDrill(searchTerm: string): Drill | null {
  const filteredDrills = filterDrills(searchTerm);

  if (filteredDrills.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredDrills.length);
  return filteredDrills[randomIndex];
}

/**
 * Gets multiple random drills (useful for showing alternatives)
 */
export function getRandomDrills(
  searchTerm: string,
  count: number = 3
): Drill[] {
  const filteredDrills = filterDrills(searchTerm);

  if (filteredDrills.length === 0) {
    return [];
  }

  // If we have fewer drills than requested, return all
  if (filteredDrills.length <= count) {
    return [...filteredDrills].sort(() => Math.random() - 0.5);
  }

  // Randomly select the requested number of drills
  const shuffled = [...filteredDrills].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
