import React, { useState, useContext } from 'react';
import { login } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
const [form, setForm] = useState({ email: '', password: '' });
const [error, setError] = useState('');
const { login } = useContext(AuthContext);
const navigate = useNavigate();


const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
e.preventDefault();
const res = await login(form);
if (res?.token) {
login(res.user, res.token);
navigate(res.user.role === 'orphanage' ? '/orphanage/dashboard' : '/donor/dashboard');
} else setError('Invalid credentials');
};


return (
<div className="p-8 max-w-md mx-auto">
<h2 className="text-2xl font-semibold mb-4">Login</h2>
<form onSubmit={handleSubmit} className="space-y-4">
<input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full" />
<input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border p-2 w-full" />
<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
</form>
{error && <p className="mt-4 text-red-600">{error}</p>}
</div>
);
}