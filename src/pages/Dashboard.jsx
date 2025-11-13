import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import { toast } from 'sonner';

export default function Dashboard() {
	const [userDetails, setUserDetails] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUserDetails = sessionStorage.getItem('userDetails');
		if (storedUserDetails) {
			setUserDetails(JSON.parse(storedUserDetails));
		}
		// Display battery status only after the component is mounted
		displayBatteryStatus();
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('userDetails');
		toast.info('Logged out successfully!');
		navigate('/login');
	};

	const getOperatingSystem = () => {
		const platform = navigator.platform.toLowerCase();
		const userAgent = navigator.userAgent.toLowerCase();

		if (platform.includes('win')) return 'Windows';
		if (platform.includes('mac')) return 'Mac OS';
		if (platform.includes('linux')) return 'Linux';
		if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
		if (userAgent.includes('android')) return 'Android';
		return 'Unknown';
	};

	const displayBatteryStatus = () => {
		const levelElement = document.getElementById('battery-level');
		const chargingElement = document.getElementById('battery-charging');

		if (navigator.getBattery) {
			navigator
				.getBattery()
				.then((battery) => {
					const level = (battery.level * 100).toFixed(0);
					levelElement.textContent = `${level}%`;

					if (level > 80) {
						levelElement.style.color = 'green';
					} else if (level > 20) {
						levelElement.style.color = '#FEBE10';
					} else {
						levelElement.style.color = 'red';
					}

					const isCharging = battery.charging;
					chargingElement.textContent = isCharging ? 'Yes' : 'No';
					chargingElement.style.color = isCharging ? 'green' : '#FEBE10';

					battery.addEventListener('levelchange', () => {
						levelElement.textContent = `${(battery.level * 100).toFixed(0)}%`;
					});
					battery.addEventListener('chargingchange', () => {
						chargingElement.textContent = battery.charging ? 'Yes' : 'No';
						chargingElement.style.color = battery.charging
							? 'green'
							: '#FEBE10';
					});
				})
				.catch((error) => {
					levelElement.textContent = 'N/A';
					chargingElement.textContent = 'N/A';
					console.error('Error getting battery status:', error);
				});
		} else {
			levelElement.textContent = 'N/A';
			chargingElement.textContent = 'Not supported';
			console.warn('Battery Status API is not supported by this browser.');
		}
	};

	const isSafariOrIOS = () => {
		const ua = navigator.userAgent.toLowerCase();
		return (
			(/safari/.test(ua) && !/chrome/.test(ua)) || /iphone|ipad|ipod/.test(ua)
		);
	};

	return (
		<div className='flex flex-col h-screen w-screen bg-[#f7f9fc]'>
			<div className='flex justify-between items-center p-4 bg-blue-600 text-white'>
				<h2 className='text-xl font-semibold'>To-Do</h2>
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

			<div className='p-12 text-blue-600'>
				<h3
					className='text-2xl font-semibold mb-4 cursor-pointer'
					onClick={() => {
						toast.success(`Welcome ${userDetails?.fullName}!`, {
							description: `${new Date().toLocaleString()}`,
						});
					}}
				>
					Welcome to your Todos, {userDetails?.fullName}!
				</h3>
				<TodoList />
				<div className='flex justify-center gap-5'>
					<div className='flex justify-center gap-5 w-50VW rounded-2xl bg-white p-4 shadow-lg'>
						<p>
							<strong className='text-cyan-600'>OS: </strong>
							<span className='text-teal-900'>{getOperatingSystem()}</span>
						</p>

						{!isSafariOrIOS() && (
							<>
								<span className='text-gray-400'>|</span>
								<p className='text-cyan-600'>
									<strong>Battery: </strong>
									<span id='battery-level'>...</span>
								</p>
								<span className='text-gray-400'>|</span>
								<p className='text-cyan-600'>
									<strong>Charging: </strong>
									<span id='battery-charging'>...</span>
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
