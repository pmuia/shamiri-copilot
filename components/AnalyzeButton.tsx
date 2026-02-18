"use client";

import { useState } from "react";

export default function AnalyzeButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      await fetch(`/api/analyze/${id}`, {
        method: "POST",
      });

      window.location.reload();
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      className="text-sm text-blue-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Analyzing..." : "Analyze"}
    </button>
  );
}
