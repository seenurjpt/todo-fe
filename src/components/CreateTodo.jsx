import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the Axios instance
import { toast } from 'sonner';

export default function CreateTodo({ todoToEdit, closeModal }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [tag, setTag] = useState('personal');
	const [status, setStatus] = useState('pending');
	const [error, setError] = useState('');
	const [isEditMode, setIsEditMode] = useState(false);

	useEffect(() => {
		if (todoToEdit) {
			setIsEditMode(true);
			setTitle(todoToEdit.title);
			setDescription(todoToEdit.description);
			setTag(todoToEdit.tag[0]); // Assuming only one tag
			setStatus(todoToEdit.status[0]); // Assuming only one status
		}
	}, [todoToEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
		if (!userDetails) {
			setError('No user found. Please login.');
			return;
		}

		const todoData = {
			userId: userDetails.userId,
			title,
			description,
			tag: [tag], // Assuming you send it as an array
			status: [status], // Assuming you send it as an array
		};

		try {
			if (isEditMode) {
				// Edit Todo
				await api.put(`/todo/update/${todoToEdit._id}`, todoData);
        toast.success('Todo updated successfully!')
			} else {
        // Create Todo
				await api.post('/todo/create', todoData);
        toast.success('Todo created successfully!')
			}

			// After creating or editing, close modal and refresh the Todo List
			closeModal();
		} catch (err) {
			toast.error('Something went wrong. Please try again.');
		}
	};

	return (
		<div className='fixed inset-0 bg-blur bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm'>
			<div className='bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative animate-fadeIn'>
				<button
					className='absolute top-4 right-4 text-4xl text-gray-600 hover:text-gray-900 transition-transform transform rotate-0 hover:rotate-90'
					onClick={closeModal}
				>
					&times;
				</button>
				<h2 className='text-2xl font-bold text-gray-700 text-center mb-6'>
					{isEditMode ? 'Edit Todo' : 'Create Todo'}
				</h2>
				{error && (
					<div className='text-red-600 bg-red-100 border-red-300 border p-3 rounded-lg text-center mb-6'>
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					{/* Title Input */}
					<div className='mb-4 text-left'>
						<label
							htmlFor='title'
							className='block font-semibold text-gray-600 mb-2'
						>
							Title:
						</label>
						<input
							id='title'
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Enter todo title'
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300'
						/>
					</div>

					{/* Description Textarea */}
					<div className='mb-4 text-left'>
						<label
							htmlFor='description'
							className='block font-semibold text-gray-600 mb-2'
						>
							Description:
						</label>
						<textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Describe your task here...'
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 resize-y'
						/>
					</div>

					{/* Tag Selection */}
					<div className='mb-4'>
						<label className='block font-semibold text-gray-600'>Tag:</label>
						<div className='flex gap-3 justify-between mt-2'>
							<div
								className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer border-2 ${
									tag === 'personal'
										? 'bg-blue-500 text-white border-blue-500'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => setTag('personal')}
							>
								Personal
							</div>
							<div
								className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer border-2 ${
									tag === 'work'
										? 'bg-blue-500 text-white border-blue-500'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => setTag('work')}
							>
								Work
							</div>
						</div>
					</div>

					{/* Status Selection */}
					<div className='mb-6'>
						<label className='block font-semibold text-gray-600'>Status:</label>
						<div className='flex gap-3 justify-between mt-2'>
							<div
								className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer border-2 ${
									status === 'pending'
										? 'bg-blue-500 text-white border-blue-500'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => setStatus('pending')}
							>
								Pending
							</div>
							<div
								className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer border-2 ${
									status === 'in-progress'
										? 'bg-blue-500 text-white border-blue-500'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => setStatus('in-progress')}
							>
								In Progress
							</div>
							<div
								className={`flex-1 text-center py-2 px-4 rounded-lg cursor-pointer border-2 ${
									status === 'completed'
										? 'bg-blue-500 text-white border-blue-500'
										: 'bg-gray-100 border-gray-300'
								}`}
								onClick={() => setStatus('completed')}
							>
								Completed
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='w-full p-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all'
					>
						{isEditMode ? 'Save Changes' : 'Create Todo'}
					</button>
				</form>
			</div>
		</div>
	);
}
