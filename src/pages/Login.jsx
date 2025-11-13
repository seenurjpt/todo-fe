import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		setError('');
		try {
			const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/sign-in`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Login failed');

			sessionStorage.setItem('accessToken', data?.accessToken);
			sessionStorage.setItem('userDetails', JSON.stringify(data?.userDetails));
			toast.success(data.message);
			setTimeout(() => {
				navigate('/dashboard');
				setLoading(false);
			}, 800);
		} catch (err) {
			toast.error(err.message);
			setLoading(false);
		}
	};

	return (
		<div className='flex justify-center items-center h-screen w-screen bg-image2'>
			<form
				onSubmit={handleSubmit}
				className='bg-white/40 p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col'
			>
				<h2 className='text-center text-2xl mb-6 text-gray-700'>
					Welcome Back
				</h2>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}

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
					disabled={loading}
					className={`w-full p-3 text-white rounded-md text-lg font-semibold  transition-all ${loading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
						}`}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>

				<p className='mt-4 text-center'>
					Don’t have an account?{' '}
					<Link
						to='/signup'
						className='text-blue-600 underline'
					>
						Sign Up
					</Link>
				</p>
			</form>
		</div>
	);
}
