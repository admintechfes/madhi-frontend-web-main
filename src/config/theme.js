import { createTheme } from '@mui/material';

// These colors can be called from any file
export const colors = {
	primaryColor: '#FFC40C',
	secondaryColor: '#F39C35',
	primaryTextColor: '#666666',
	secondaryTextColor: '#222222',
	backgroundprimaryColor: 'rgba(56, 146, 255, 0.20)',
	errorColor: '#EB5757',
	backgroundErrorColor: 'rgba(235, 87, 87, 0.20)',
	whiteColor: '#FFFFFF',
	outlinecolor: '#FAFAFA',
	backgroundColor: '#FAFCFE',
	backgroundDarkGrey:"#F7F7F7",
	backgroundPrimary:"rgba(255, 196, 12, 0.24)",
};

export const muiTheme = createTheme({
	palette: {
		primary: {
			main: colors.primaryColor,
			light: colors.backgroundprimaryColor,
		},
		secondary: {
			main: colors.secondaryColor,
		},
		text: {
			primary: colors.primaryTextColor,
			secondary: colors.secondaryTextColor,
		},
		error: {
			main: colors.errorColor,
			light: colors.backgroundErrorColor,
		},
		warning:{
			main: '#CCCCCC',
		}
	},
	typography: {
		useNextVariants: true,
		h1: {
			color: colors.primaryTextColor,
			fontSize: '33px',
			textTransform: 'capitalize',
			fontFamily: 'roboto',
			fontWeight: 600,
		},
		h2: {
			color: colors.primaryTextColor,
			fontSize: '30px',
			fontFamily: 'roboto',
		},
		h3: {
			color: colors.primaryTextColor,
			fontSize: '24px',
			fontFamily: 'roboto',
			lineHeight: 'inherit',
		},
		h4: {
			color: colors.primaryTextColor,
			fontSize: '20px',
			fontFamily: 'roboto',
		},
		h5: {
			color: colors.primaryTextColor,
			fontSize: '18px',
			fontFamily: 'roboto',
		},
		p: {
			color: colors.secondaryTextColor,
			fontSize: '16px',
			fontFamily: 'roboto',
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: '8px',
					boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.1),  0px 10px 30px 0px rgba(0, 0, 0, 0.05)'
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					fontFamily: 'roboto',
					background: '#FFFFFF',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				'.MuiInputLabel': {
					fontWeight: 200,
				},
				root: {
					borderRadius: '5px',
					label: {
						fontWeight: 200,
					},

					input: {
						color: colors.secondaryTextColor,
						outline: colors.secondaryTextColor,
						'&::placeholder': {
							color: colors.secondaryTextColor,
						},

						'input[type=number]::-webkit-outer-spin-button': {
							margin: 0,
						},
					},
				},
			},
		},
		MuiButtonBase: {
			styleOverrides: {
				root: {
					padding: '10px',
					fontWeight: 500,
					fontFamily: 'roboto',
					'& .MuiButton-root': {
						color: 'pink',
						letterSpacing: '.1em',
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					fontSize: '15px',
					textTransform: 'capitalize',
					fontFamily: 'roboto',
					borderRadius: '4px',
					
				},
				contained: {
					fontSize: '15px',
          color:'white',  
					textTransform: 'capitalize',
					fontFamily: 'roboto',
					borderRadius: '4px',
					boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.1),  0px 10px 30px 0px rgba(0, 0, 0, 0.05)'
					
				},
				outlined: {
					fontSize: '15px',
					textTransform: 'capitalize',
					fontFamily: 'roboto',
					background: 'none',
					borderRadius: '4px',
				},

				text: {
					color: colors.primaryColor,
					fontSize: '15px',
					background: 'none',
					textTransform: 'capitalize',
					fontFamily: 'roboto',
					borderRadius: '4px',
					'&:hover': {
						background: 'none',
					},
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					color: colors.primaryTextColor,
					fontFamily: 'roboto',
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					paddingTop: '3px',
					paddingBottom: '3px',
					'&:hover': {
						background: colors.backgroundPrimary,
						borderRadius: '4px',
					},
				},
			},
		},

		MuiTableCell: {
			styleOverrides: {
				root: {
					border: 0,
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:hover':{
						background: 'white',
					},
					"&.Mui-selected" : {
						background: 'white',
              '&:hover': {
								background: 'white'
							}    
					}
				},
			},
		},
		MuiTableSortLabel: {
			styleOverrides: {
				root: {
					padding: '16px',
					fontFamily: 'roboto',
					fontSize: '12px',
					color: '#999',
					fontWeight: 400,
				},
			},
		},
		MuiLoadingButton: {
			styleOverrides: {
				root: {
					'&:disabled': {
						backgroundColor: colors.primaryColor,
					},
				},
				
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {
					padding: '9.5px 14px',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					borderRadius: '0px',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					color: colors.primaryTextColor,
					backgroundColor: '#FFF',
					borderRadius: '4px',
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: '#99999',
					},
				},
			},
		},
		MuiStack: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
	},
});
