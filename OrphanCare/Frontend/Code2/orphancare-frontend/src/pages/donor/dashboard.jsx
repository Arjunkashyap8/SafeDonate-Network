import React, { useEffect, useState } from 'react';
import { getRequirements } from '../../services/donorService';


export default function DonorDashboard() {
const [requirements, setRequirements] = useState([]);


useEffect(() => {
getRequirements().then(setRequirements);
}, []);


return (
<div className="p-8">
<h1 className="text-2xl font-bold">Welcome Donor</h1>
<h2 className="mt-6 text-xl font-semibold">Available Requirements</h2>
<ul className="mt-2 space-y-2">
{requirements.map((r) => (
<li key={r.id} className="border p-2 rounded">
<strong>{r.title}</strong> — {r.orphanage_name}
</li>
))}
</ul>
</div>
);
}