import React, { useEffect, useState } from "react";
import {
  getOrphanageProfile,
  getRequirements,
} from "../../services/orphanageService";

export default function OrphanageDashboard() {
  const [profile, setProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    getOrphanageProfile().then(setProfile);
    getRequirements().then(setRequirements);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {profile?.orphanage_name}</h1>
      <p className="mt-2">{profile?.description}</p>
      <h2 className="mt-6 text-xl font-semibold">Your Requirements</h2>
      <ul className="mt-2 space-y-2">
        {requirements.map((r) => (
          <li key={r.id} className="border p-2 rounded">
            <strong>{r.title}</strong> — {r.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
