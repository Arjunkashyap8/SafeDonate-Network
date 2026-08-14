import React, { useState } from 'react';
import { register } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


export default function RegisterPage() {
const [formData, setFormData] = useState({ email: '', password: '', role: 'donor' });
const [message, setMessage] = useState('');
const navigate = useNavigate();


const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
e.preventDefault();
const res = await register(formData);
if (res) {
setMessage(res.message);
navigate('/auth/verify');
}
};


return (
<div className="p-8 max-w-md mx-auto">
<h2 className="text-2xl font-semibold mb-4">Create Account</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
<input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 w-full" />
<select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full">
<option value="donor">Donor</option>
<option value="orphanage">Orphanage</option>
</select>
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
</form>
{message && <p className="mt-4 text-green-600">{message}</p>}
</div>
);
}