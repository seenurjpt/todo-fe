import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Signup() {
	const [form, setForm] = useState({ fullName: '', email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_BASE_URL}/auth/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(form),
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Signup failed');

			alert('Signup successful! You can log in now.');
			toast.success(data.message);
			setTimeout(() => {
				navigate('/login');
				setLoading(false);
			}, 1000);
		} catch (err) {
			toast.error(err.message);
			setLoading(false);
		}
	};

	return (
		<div class='flex justify-center items-center h-screen w-screen bg-image p-4 sm:p-6 md:p-8'>
			<form
				onSubmit={handleSubmit}
				class='bg-white/40 p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md flex flex-col'
			>
				<h2 class='text-center text-2xl mb-6 text-gray-700'>Create Account</h2>
				{error && <p class='text-red-500 text-center mb-4'>{error}</p>}

				<input
					name='fullName'
					placeholder='Name'
					value={form.fullName}
					onChange={handleChange}
					required
					class='mb-4 p-3 border border-white rounded-md text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<input
					name='email'
					placeholder='Email'
					value={form.email}
					onChange={handleChange}
					required
					class='mb-4 p-3 border border-white rounded-md text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					value={form.password}
					onChange={handleChange}
					required
					class='mb-4 p-3 border border-white rounded-md text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<button
					type='submit'
					disabled={loading}
					class={`w-full p-3 text-white rounded-md text-lg font-semibold transition-all ${
						loading
							? 'bg-blue-500 cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700'
					}`}
				>
					{loading ? 'Signing up...' : 'Sign Up'}
				</button>

				<p class='mt-4 text-center'>
					Already have an account?
					<Link
						to='/login'
						class='text-blue-600 underline'
					>
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}
