import axios from 'axios';
import { utils } from '../utils';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
	baseURL: process.env.API_URL + '/api',
	headers: {
		Accept: 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type',
	},
});
axiosInstance.interceptors.request.use(
	(config) => {
		let token = utils.getLocalStorageValue('token');
		if (token) {
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
// axiosInstance.interceptors.response.use(
// 	function (response) {
// 		if (!navigator.onLine) {
// 			alert('Offline \nYour network is unavailable, Check your data or wifi connection.');
// 		}
// 		return response;
// 	},
// 	function (error) {
// 		if (error.response?.data?.statusCode === 401) {
// 			if (error.response.data.status.includes('UNAUTHORIZED_REQUEST')) {
// 				// toast.error('Request is unauthorised');
// 				if (!window.location.href.includes('login')) {
// 					setTimeout(() => {
// 						toast.info('Redirecting to login page...', {
// 							onClose: () => (window.location.href = '/login'),
// 						});
// 					}, 2000);
// 				}

// 				utils.removeLocalStorageValue('token');
// 			}
// 		}
// 		return Promise.reject(error);
// 	}
// );


let hasShownUnauthorizedError = false; // Flag to track if 401 error has been shown
let errorTimeout; // Timeout to debounce 401 error handling

axiosInstance.interceptors.response.use(
	function (response) {
		if (!navigator.onLine) {
			alert('Offline \nYour network is unavailable, Check your data or wifi connection.');
		}
		return response;
	},
	function (error) {
		
		if (error.response?.data?.statusCode === 401 && error.response.data.status.includes('UNAUTHORIZED_REQUEST')) {
			if (!hasShownUnauthorizedError) {
				hasShownUnauthorizedError = true; // Set flag to true to prevent immediate rehandling

				
				if (!window.location.href.includes('login')) {
					toast.info('Redirecting to login page...', {
						onClose: () => {
							window.location.href = '/login';
						},
					});
				}

				// Remove the token from local storage
				utils.removeLocalStorageValue('token');

				// Set a timeout to reset the flag after 5000 ms
				errorTimeout = setTimeout(() => {
					hasShownUnauthorizedError = false; // Allow 401 handling again after timeout
				}, 5000);
			}
		}
		return Promise.reject(error);
	}
);


export default axiosInstance;
