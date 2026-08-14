import React from "react";

export default function RequirementCard({ r, onDonate }) {
  return (
    <div className="border rounded p-3 bg-white">
      <h3 className="font-semibold">{r.title}</h3>
      <p className="text-sm">{r.description}</p>
      <p className="text-xs mt-2">Orphanage: {r.orphanage_name}</p>
      <div className="mt-2 flex gap-2">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => onDonate && onDonate(r)}
        >
          Donate
        </button>
      </div>
    </div>
  );
}
