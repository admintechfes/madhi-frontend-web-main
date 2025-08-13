import './app.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { muiTheme } from './config/theme';
import Navigation from './config/Routes';
import { Provider } from 'react-redux';
import { store } from './config/store';
import Layout from './components/Layout';

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={muiTheme}>
				<BrowserRouter>
					<Layout>
						<Navigation />
					</Layout>
				</BrowserRouter>
			</ThemeProvider>
		</Provider>
	);
}

export default App;