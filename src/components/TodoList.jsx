// src/pages/TodoList.js
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api'; // Import the Axios instance
import Modal from '../components/Modal'; // Import the Modal component
import CreateTodo from './CreateTodo'; // Import the CreateTodo component
import {
	FaPlus,
	FaTrash,
	FaCheckCircle,
	FaSpinner,
	FaClock,
	FaEdit,
	FaRegTrashAlt,
	FaTag,
	FaCalendarAlt,
	FaInfoCircle,
	FaFilter, // Added filter icon
} from 'react-icons/fa';
import { toast } from 'sonner';
import Loader from './loaders/Loader';
import Loader2 from './loaders/Loader2';
import Loader3 from './loaders/Loader3';
import Loader4 from './loaders/Loader4';
import Loader5 from './loaders/Loader5';

export default function TodoList() {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [todoToEdit, setTodoToEdit] = useState(null);
	const [selectedTodos, setSelectedTodos] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [paginationData, setPaginationData] = useState({
		totalTodos: 0,
		totalPages: 0,
		currentPage: 0,
		itemsPerPage: 0,
	});

	const [todosPerPage] = useState(5); // Number of todos per page
	const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

	// Filter states
	const [filterStatus, setFilterStatus] = useState(''); // '', 'pending', 'in-progress', 'completed'
	const [filterTag, setFilterTag] = useState(''); // '' or a specific tag

	const fetchTodos = () => {
		api
			.get(
				`/todo/getAll/${userDetails?.userId}?tag=${filterTag}&status=${filterStatus}&count=4&offset=${currentPage}`,
			)
			.then((data) => {
				setTodos(data.response);
				setPaginationData(data.pagination);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				toast.error(err.message);
				setLoading(false);
			});
	};

	useEffect(() => {
		if (!userDetails) {
			setError('No user found. Please login.');
			setLoading(false);
			return;
		}
		fetchTodos();
	}, [filterStatus, filterTag, currentPage]);

	const openModalForCreate = () => {
		setTodoToEdit(null);
		setIsModalOpen(true);
	};

	const openModalForEdit = (todo) => {
		setTodoToEdit(todo);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		fetchTodos();
	};

	const handleDeleteTodo = async (todoId) => {
		try {
			await api.delete(`/todo/delete/${todoId}`);
			fetchTodos();
			toast.success('Todo removed successfully!');
		} catch (err) {
			toast.error('Error deleting todo');
		}
	};

	const handleMassDelete = async () => {
		try {
			await api.delete('/todo/delete-multiple-todos', {
				data: { todoIds: selectedTodos },
			});
			setSelectedTodos([]);
			fetchTodos();
			toast.success('Selected todos removed successfully!');
		} catch (err) {
			toast.error('Error deleting selected todos');
		}
	};

	const handleStatusChange = async (todoId, newStatus) => {
		try {
			await api.patch(`/todo/update-status/${todoId}`, { status: [newStatus] });
			fetchTodos();
			toast.success('Status updated successfully!');
		} catch (err) {
			toast.err('Error updating status');
		}
	};

	const handleMassStatusUpdate = async (newStatus) => {
		try {
			await api.put('/todo/update-multiple-todos-status', {
				todoIds: selectedTodos,
				status: [newStatus],
			});
			setSelectedTodos([]);
			fetchTodos();
			toast.success('Selected todos status updated successfully!');
		} catch (err) {
			toast.error('Error updating status for selected todos');
		}
	};

	const handleToggleSelectTodo = (todoId) => {
		setSelectedTodos((prevSelected) =>
			prevSelected.includes(todoId)
				? prevSelected.filter((id) => id !== todoId)
				: [...prevSelected, todoId],
		);
	};

	// --- Filtering Logic ---
	const filteredTodos = useMemo(() => {
		return todos;
	}, [todos, filterStatus, filterTag, currentPage]);

	// Reset currentPage when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filterStatus, filterTag]);

	// --- Pagination Logic (now based on filteredTodos) ---
	const indexOfLastTodo = currentPage * todosPerPage;
	const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
	const totalPages = paginationData.totalPages;

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const loaders = [
		<Loader />,
		<Loader2 />,
		<Loader3 />,
		<Loader4 />,
		<Loader5 />,
	];

	// Randomly pick one loader
	const randomLoader = loaders[Math.floor(Math.random() * loaders.length)];
	if (loading)
		return (
			<div className='flex justify-center items-center w-full h-[60vh]'>
				{randomLoader}
			</div>
		);
	if (error) return <div className='error-message'>Error: {error}</div>;

	return (
		<div className='max-w-7xl mx-auto my-10 p-8 bg-white rounded-lg shadow-lg'>
			<h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>
				Todo List
			</h2>
			<div className='flex flex-col sm:flex-row justify-between mb-8 gap-4'>
				{/* Create New Todo / Bulk Actions */}
				{!selectedTodos.length ? (
					<button
						className='flex items-center bg-blue-600 text-white py-2 px-1 md:py-2 md:px-6 rounded-lg text-xs md:text-lg font-semibold shadow-md hover:bg-blue-700 transition-all'
						onClick={openModalForCreate}
					>
						<FaPlus className='mr-2' /> Create New Todo
					</button>
				) : (
					<div className='flex flex-wrap gap-4'>
						<button
							className='bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:bg-red-700 transition-all flex items-center'
							onClick={handleMassDelete}
							title='Delete Selected Todos'
						>
							<FaRegTrashAlt className='mr-2' /> Delete Selected (
							{selectedTodos.length})
						</button>
						<button
							className='bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:bg-green-700 transition-all flex items-center'
							onClick={() => handleMassStatusUpdate('completed')}
							title='Mark Selected as Completed'
						>
							<FaCheckCircle className='mr-2' /> Mark as Completed
						</button>
						<button
							className='bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:bg-orange-700 transition-all flex items-center'
							onClick={() => handleMassStatusUpdate('in-progress')}
							title='Mark Selected as In Progress'
						>
							<FaSpinner className='mr-2' /> Mark as In Progress
						</button>
						<button
							className='bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-700 transition-all flex items-center'
							onClick={() => handleMassStatusUpdate('pending')}
							title='Mark Selected as Pending'
						>
							<FaClock className='mr-2' /> Mark as Pending
						</button>
					</div>
				)}

				{/* Filter Options */}
				<div className='flex flex-wrap items-center gap-4 ml-auto'>
					<div className='flex items-center gap-2'>
						<FaFilter className='text-gray-500' />
						<label
							htmlFor='status-filter'
							className='sr-only'
						>
							Filter by Status
						</label>
						<select
							id='status-filter'
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
						>
							<option value=''>All Statuses</option>
							<option value='pending'>Pending</option>
							<option value='in-progress'>In Progress</option>
							<option value='completed'>Completed</option>
						</select>
					</div>
					<div className='flex items-center gap-2'>
						<FaTag className='text-gray-500' />
						<label
							htmlFor='tag-filter'
							className='sr-only'
						>
							Filter by Tag
						</label>
						<select
							id='tag-filter'
							value={filterTag}
							onChange={(e) => setFilterTag(e.target.value)}
							className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
						>
							<option value=''>All Tags</option>
							<option value='perosnal'>Personal</option>
							<option value='work'>Work</option>
						</select>
					</div>
				</div>
			</div>

			{filteredTodos.length === 0 &&
			(filterStatus !== '' || filterTag !== '') ? (
				<div className='text-center text-gray-500 py-10'>
					<FaInfoCircle
						size={40}
						className='mx-auto mb-4'
					/>
					<p>No todos match your current filter criteria.</p>
					<button
						className='mt-4 text-blue-600 hover:underline'
						onClick={() => {
							setFilterStatus('');
							setFilterTag('');
						}}
					>
						Clear Filters
					</button>
				</div>
			) : filteredTodos.length === 0 ? (
				<div className='text-center text-gray-500 py-10'>
					<FaInfoCircle
						size={40}
						className='mx-auto mb-4'
					/>
					<p>No todos yet! Click "Create New Todo" to get started.</p>
				</div>
			) : (
				<>
					<div className='overflow-x-auto shadow-md rounded-lg'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										<input
											type='checkbox'
											onChange={(e) =>
												e.target.checked
													? setSelectedTodos(
															filteredTodos.map((todo) => todo._id),
													  )
													: setSelectedTodos([])
											}
											checked={
												selectedTodos.length === filteredTodos.length &&
												filteredTodos.length > 0
											}
											className='scale-125 accent-blue-600 cursor-pointer'
										/>
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Title
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Description
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Status
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Tags
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Created At
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredTodos.map((todo) => (
									<tr key={todo._id}>
										<td className='px-6 py-4 whitespace-nowrap '>
											<input
												type='checkbox'
												checked={selectedTodos.includes(todo._id)}
												onChange={() => handleToggleSelectTodo(todo._id)}
												className='scale-125 accent-blue-600 cursor-pointer'
											/>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{todo.title}
										</td>
										<td className='px-6 py-4 text-sm text-gray-500'>
											{todo.description}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<select
												value={todo.status[0]}
												onChange={(e) =>
													handleStatusChange(todo._id, e.target.value)
												}
												className={`px-3 py-1 text-sm font-medium rounded-lg border cursor-pointer${
													todo.status[0] === 'pending'
														? 'bg-gray-100 border-gray-300 text-gray-700'
														: todo.status[0] === 'in-progress'
														? 'bg-orange-100 border-orange-400 text-orange-700'
														: 'bg-green-100 border-green-400 text-green-700'
												}`}
											>
												<option value='pending'>Pending</option>
												<option value='in-progress'>In Progress</option>
												<option value='completed'>Completed</option>
											</select>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<FaTag className='inline mr-1 text-gray-400' />{' '}
											{todo.tag.join(', ')}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<FaCalendarAlt className='inline mr-1 text-gray-400' />{' '}
											{new Date(todo.createdAt).toLocaleDateString()}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
											<div className='flex justify-center gap-8'>
												<button
													onClick={() => openModalForEdit(todo)}
													className='text-blue-600 hover:text-blue-900 cursor-pointer'
													title='Edit Todo'
												>
													<FaEdit size={18} />
												</button>
												<button
													onClick={() => handleDeleteTodo(todo._id)}
													className='text-red-600 hover:text-red-900 cursor-pointer'
													title='Delete Todo'
												>
													<FaRegTrashAlt size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<nav
						className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'
						aria-label='Pagination'
					>
						<div className='hidden sm:block'>
							{/* <p className='text-sm text-gray-700'>
								Showing{' '}
								<span className='font-medium'>
									{Math.min(indexOfFirstTodo + 1, filteredTodos.length)}
								</span>{' '}
								to{' '}
								<span className='font-medium'>
									{Math.min(indexOfLastTodo, filteredTodos.length)}
								</span>{' '}
								of{' '}
								<span className='font-medium'>{paginationData.totalTodos}</span>{' '}
								results
								{filterStatus !== '' || filterTag !== '' ? ' (filtered)' : ''}
							</p> */}

							<p className='text-sm text-gray-700 font-medium'>
								{' '}
								{`Page : ${paginationData.currentPage}/${paginationData.totalPages}`}
							</p>
						</div>
						<div className='flex-1 flex justify-between sm:justify-end'>
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Previous
							</button>
							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={
									currentPage === totalPages || filteredTodos.length === 0
								}
								className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Next
							</button>
						</div>
					</nav>
				</>
			)}

			<Modal
				isOpen={isModalOpen}
				closeModal={closeModal}
			>
				<CreateTodo
					todoToEdit={todoToEdit}
					closeModal={closeModal}
				/>
			</Modal>
		</div>
	);
}
