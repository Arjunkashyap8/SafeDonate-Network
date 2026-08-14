import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createDonation } from '../../services/donorService';


export default function CreateDonation() {
const { id } = useParams();
const [message, setMessage] = useState('');
const [status, setStatus] = useState('');


const handleSubmit = async (e) => {
e.preventDefault();
const res = await createDonation({ requirement: id, donation_message: message });
setStatus(res?.message || 'Error');
};


return (
<div className="p-8 max-w-md mx-auto">
<h2 className="text-2xl font-semibold mb-4">Make a Donation</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<textarea placeholder="Donation message..." value={message} onChange={(e) => setMessage(e.target.value)} className="border p-2 w-full" />
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
</form>
{status && <p className="mt-4 text-green-600">{status}</p>}
</div>
);
}