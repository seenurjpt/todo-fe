// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
	if (!isOpen) return null; // Don't render the modal if it's closed

	return (
		<div
			className='fixed inset-0 bg-blur bg-opacity-80 flex justify-center items-center z-50'
			onClick={closeModal}
		>
			<div
				className='bg-white p-6 rounded-lg w-full max-w-lg shadow-4xl relative'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					className='absolute top-4 right-4 text-2xl text-gray-700 bg-transparent border-none cursor-pointer'
					onClick={closeModal}
				>
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
