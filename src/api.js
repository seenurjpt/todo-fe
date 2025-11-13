// src/api.js
import axios from 'axios';
import { toast } from 'sonner';

// Create an Axios instance
const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL, // Set the base URL for your API
	headers: {
		'Content-Type': 'application/json', // Default content type
	},
});

// Add a request interceptor to include the Bearer token
api.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem('accessToken'); // Get token from sessionStorage
		if (token) {
			// Add Bearer token if it exists
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		// Handle request error
		return Promise.reject(error);
	},
);

// Add a response interceptor for error handling
api.interceptors.response.use(
	(response) => response.data, // Directly return the data from the response
	(error) => {
		const message = error.response?.data?.message || 'Something went wrong!';
		if (message.toLowerCase().includes('expired')) {
			sessionStorage.clear();
			toast.error(message);
			setTimeout(() => {
				window.location.replace('/login');
			}, 2000);
		}
		return Promise.reject(new Error(message));
	},
);

export default api;
