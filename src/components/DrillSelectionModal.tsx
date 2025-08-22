"use client";

import { useState, useEffect } from "react";
import { Drill } from "@/types";
import { Button } from "./Button";
import { Search } from "lucide-react";

interface DrillSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrillSelect: (drill: Drill) => void;
  selectedDrills: Drill[];
}

export function DrillSelectionModal({
  isOpen,
  onClose,
  onDrillSelect,
  selectedDrills,
}: DrillSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load all drills from database when modal opens
      fetchDrills("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setLoading(true);
      fetchDrills(searchTerm);
    } else {
      fetchDrills("");
    }
  }, [searchTerm]);

  const fetchDrills = async (searchTerm: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/drills?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDrills(data.drills || []);
      } else {
        console.error("Failed to fetch drills");
        setDrills([]);
      }
    } catch (error) {
      console.error("Error fetching drills:", error);
      setDrills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrillSelect = (drill: Drill) => {
    onDrillSelect(drill);
    setSearchTerm("");
  };

  const isDrillSelected = (drill: Drill) => {
    return selectedDrills.some((selected) => selected.id === drill.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text">Select Drills</h2>
            <p className="text-text-muted mt-1">
              Choose the drills you practiced in this session
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-text"
          >
            ✕
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for drills..."
              className="w-full pl-10 pr-4 py-2 bg-surface-light border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Drills List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-text-muted">Searching...</div>
            </div>
          ) : drills.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-text-muted">No drills found</div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {drills.map((drill) => (
                <div
                  key={drill.slug}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isDrillSelected(drill)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-surface-light"
                  }`}
                  onClick={() => handleDrillSelect(drill)}
                >
                  <div className="flex justify-between flex-wrap items-start mb-2">
                    <h3 className="font-medium text-text">{drill.name}</h3>
                    {isDrillSelected(drill) && (
                      <span className="text-primary text-sm text-nowrap">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">
                    {drill.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-surface-light text-text-muted text-xs rounded">
                      {drill.difficulty}
                    </span>
                    {drill.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-surface-light text-text-muted text-xs rounded"
                      >
                        {category}
                      </span>
                    ))}
                    {drill.categories.length > 2 && (
                      <span className="px-2 py-1 bg-surface-light text-text-muted text-xs rounded">
                        +{drill.categories.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between items-center">
          <div className="text-text-muted">
            {selectedDrills.length} drill
            {selectedDrills.length !== 1 ? "s" : ""} selected
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
