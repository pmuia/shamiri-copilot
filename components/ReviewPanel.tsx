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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitReview = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!status) {
        setError("Please select a status.");
        return;
      }

      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          finalStatus: status,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <h2 className="font-semibold">Supervisor Validation</h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={loading}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="SAFE">Mark Safe</option>
        <option value="FLAGGED">Confirm Risk</option>
        <option value="PROCESSED">Processed</option>
      </select>

      <textarea
        placeholder="Add supervisor notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
        className="w-full border rounded p-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {success && (
        <p className="text-green-600 text-sm">Review submitted successfully.</p>
      )}

      <button
        onClick={submitReview}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Submit Review"}
      </button>
    </div>
  );
}
