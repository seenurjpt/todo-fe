// src/App.js
import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard'; // import Dashboard component
import './App.css';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }) {
	// Check if the accessToken exists in sessionStorage
	const accessToken = sessionStorage.getItem('accessToken');

	// If no token, redirect to login page
	if (!accessToken) {
		return <Navigate to='/login' />;
	}

	// If token exists, allow access to the children route (Dashboard in this case)
	return children;
}

function RedirectIfLoggedIn({ children }) {
	// Check if the user is logged in by looking for the accessToken
	const accessToken = sessionStorage.getItem('accessToken');

	// If the user is logged in, redirect them to the dashboard
	if (accessToken) {
		return <Navigate to='/dashboard' />;
	}

	// If not logged in, allow them to access the children route (Login/Signup)
	return children;
}

export default function App() {
	return (
		<Router>
			<Routes>
				{/* Redirect logged-in users to dashboard if they try to access login/signup */}
				<Route
					path='/login'
					element={
						<RedirectIfLoggedIn>
							<Login />
						</RedirectIfLoggedIn>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectIfLoggedIn>
							<Signup />
						</RedirectIfLoggedIn>
					}
				/>

				{/* Protected Dashboard Route */}
				<Route
					path='/dashboard'
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>

				{/* Redirect any unknown path to login */}
				<Route
					path='*'
					element={<Navigate to='/login' />}
				/>
			</Routes>
			<Toaster
				position='top-center'
				richColors
			/>
		</Router>
	);
}
