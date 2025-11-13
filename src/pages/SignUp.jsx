import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Signup() {
	const [form, setForm] = useState({ fullName: '', email: '', password: '' });
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
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
			}, 1000);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className='flex justify-center items-center h-screen w-screen bg-image'>
			<form
				onSubmit={handleSubmit}
				className='bg-white/40 p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col'
			>
				<h2 className='text-center text-2xl mb-6 text-gray-700'>
					Create Account
				</h2>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

				<input
					name='fullName'
					placeholder='Name'
					value={form.fullName}
					onChange={handleChange}
					required
					className='mb-4 p-3 border border-white rounded-md text-gray-800 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<input
					name='email'
					placeholder='Email'
					value={form.email}
					onChange={handleChange}
					required
					className='mb-4 p-3 border border-white rounded-md text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<input
					type='password'
					name='password'
					placeholder='Password'
					value={form.password}
					onChange={handleChange}
					required
					className='mb-4 p-3 border border-white rounded-md text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white/30'
				/>

				<button
					type='submit'
					className='w-full p-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-all'
				>
					Sign Up
				</button>

				<p className='mt-4 text-center'>
					Already have an account?{' '}
					<Link
						to='/login'
						className='text-blue-600 underline'
					>
						Login
					</Link>
				</p>
			</form>
		</div>
	);
}
