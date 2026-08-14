import React, { useState } from 'react';
import { verifyOtp } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


export default function VerifyOtp() {
const [form, setForm] = useState({ email: '', otp: '' });
const [msg, setMsg] = useState('');
const navigate = useNavigate();


const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
e.preventDefault();
const res = await verifyOtp(form);
if (res) {
setMsg(res.message);
navigate('/auth/login');
}
};


return (
<div className="p-8 max-w-md mx-auto">
<h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
<input name="otp" placeholder="OTP" value={form.otp} onChange={handleChange} className="border p-2 w-full" />
<button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Verify</button>
</form>
{msg && <p className="mt-4 text-green-600">{msg}</p>}
</div>
);
}