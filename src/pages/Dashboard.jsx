import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import { toast } from 'sonner';

export default function Dashboard() {
	const [userDetails, setUserDetails] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Get user details from sessionStorage
		const storedUserDetails = sessionStorage.getItem('userDetails');
		if (storedUserDetails) {
			setUserDetails(JSON.parse(storedUserDetails)); // Parse and store it in state
		}
	}, [navigate]);

	// Handle logout by clearing sessionStorage and redirecting to login
	const handleLogout = () => {
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('userDetails'); // Remove user details from session
		toast.info('Logged out successfully!');
		navigate('/login'); // Redirect to login page
	};

	function getOperatingSystem() {
		const platform = navigator.platform.toLowerCase();
		const userAgent = navigator.userAgent.toLowerCase();

		if (platform.includes('win')) return 'Windows';
		if (platform.includes('mac')) return 'Mac OS';
		if (platform.includes('linux')) return 'Linux';
		if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
		if (userAgent.includes('android')) return 'Android';
		return 'Unknown';
	}

	function displayBatteryStatus() {
		// 1. Find the HTML elements
		const levelElement = document.getElementById('battery-level');
		const chargingElement = document.getElementById('battery-charging');

		function updateBatteryUI(battery) {
			// --- 1. Update Battery Level & Color ---
			const level = (battery.level * 100).toFixed(0);
			levelElement.textContent = `${level}%`;

			// Apply color logic for battery level
			if (level > 80) {
				levelElement.style.color = 'green';
			} else if (level > 20) {
				// This covers >20 and <=80
				levelElement.style.color = 'yellow';
			} else {
				// This covers <= 20
				levelElement.style.color = 'red';
			}

			// --- 2. Update Charging Status & Color ---
			const isCharging = battery.charging;
			chargingElement.textContent = isCharging ? 'Yes' : 'No';

			// Apply color logic for charging status
			if (isCharging) {
				chargingElement.style.color = 'green';
			} else {
				chargingElement.style.color = 'yellow';
			}
		}

		// 2. Check if the Battery API is supported
		if (navigator.getBattery) {
			navigator
				.getBattery()
				.then((battery) => {
					// 3. Update the UI with the initial values
					updateBatteryUI(battery);

					// 4. Set up event listeners to auto-update the UI
					battery.addEventListener('levelchange', () => {
						updateBatteryUI(battery);
					});

					battery.addEventListener('chargingchange', () => {
						updateBatteryUI(battery);
					});
				})
				.catch((error) => {
					// Handle cases where the API fails
					levelElement.textContent = 'N/A';
					chargingElement.textContent = 'N/A';
					console.error('Error getting battery status:', error);
				});
		} else {
			// Handle cases where the browser doesn't support the API
			levelElement.textContent = 'N/A';
			chargingElement.textContent = 'Not supported';
			console.warn('Battery Status API is not supported by this browser.');
		}
	}
	displayBatteryStatus();

	return (
		<div className='flex flex-col h-screen w-screen bg-[#f7f9fc]'>
			{/* Navbar */}
			<div className='flex justify-between items-center p-4 bg-blue-600 text-white'>
				<h2 className='text-xl font-semibold'>To-Do</h2>

				{/* Display user info in the navbar */}
				{userDetails && (
					<div className='text-white flex items-center gap-4 font-semibold'>
						<span className='text-base mb-1'>{userDetails.fullName}</span>
						<button
							className='bg-gray-100 text-blue-600 py-2 px-4 rounded-lg text-base font-medium hover:bg-gray-200'
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className='p-12 text-blue-600'>
				<h3
					className='text-2xl font-semibold mb-4 cursor-pointer'
					onClick={() => {
						toast.success(`Welcome ${userDetails?.fullName}!`, {
							description: `${new Date().toLocaleString()}`,
						});
						toast.error(`Welcome ${userDetails?.fullName}!`, {
							description: `${new Date().toLocaleString()}`,
						});
						toast.info(`Welcome ${userDetails?.fullName}!`, {
							description: `${new Date().toLocaleString()}`,
						});
					}}
				>
					Welcome to your Todos, {userDetails?.fullName}!
				</h3>
				<TodoList />

				<div className='flex justify-center gap-5'>
					<p>
						<strong className='text-cyan-600'>OS: </strong>{' '}
						<span className='text-teal-900'>{getOperatingSystem()}</span>
					</p>
					<span>|</span>
					<p className='text-cyan-600'>
						<strong>Battery: </strong>
						<span id='battery-level'>...</span>
					</p>
					<span>|</span>
					<p className='text-cyan-600'>
						<strong>Charging: </strong>
						<span id='battery-charging'>...</span>
					</p>
				</div>
			</div>
		</div>
	);
}
