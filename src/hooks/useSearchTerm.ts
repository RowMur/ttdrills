import { SEARCH_KEY } from "@/constants";
import { useSearchParams } from "next/navigation";

export const useSearchTerm = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_KEY) || "";
  return searchQuery;
};
