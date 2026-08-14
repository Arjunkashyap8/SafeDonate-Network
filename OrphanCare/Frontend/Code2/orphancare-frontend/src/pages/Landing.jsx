import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Welcome to OrphanCare</h1>
      <p className="mt-4 text-gray-600">Connecting donors and orphanages with care and compassion.</p>
      <div className="mt-6 flex justify-center gap-4">
        <button onClick={() => navigate('/auth/login')} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        <button onClick={() => navigate('/auth/register')} className="px-4 py-2 bg-green-600 text-white rounded">Get Started</button>
      </div>
    </div>
  );
}