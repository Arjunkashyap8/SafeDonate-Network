import React from "react";

export default function DonationCard({ d, onMarkComplete }) {
  return (
    <div className="border rounded p-3 bg-white">
      <h4 className="font-medium">
        Requirement: {d.requirement_title || d.requirement}
      </h4>
      <p className="text-sm">Message: {d.donation_message}</p>
      <p className="text-xs">Status: {d.status}</p>
      {onMarkComplete && d.status !== "completed" && (
        <button
          onClick={() => {
            console.log("**pending**");
          }}
        >
          Complete
        </button>
      )}
    </div>
  );
}
