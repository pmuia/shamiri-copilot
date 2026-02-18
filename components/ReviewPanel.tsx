"use client";

import { useState } from "react";

export default function ReviewPanel({
  sessionId,
  currentStatus,
}: {
  sessionId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        finalStatus: status,
        notes,
      }),
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <h2 className="font-semibold">Supervisor Validation</h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="SAFE">Mark Safe</option>
        <option value="FLAGGED">Confirm Risk</option>
        <option value="PROCESSED">Processed</option>
      </select>

      <textarea
        placeholder="Add supervisor notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded p-2"
      />

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Submit Review"}
      </button>
    </div>
  );
}
