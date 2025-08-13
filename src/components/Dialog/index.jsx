import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';

export default function FormDialog(props) {
	// const {children, maxWidth, open, close, hideClose, loading, title, allowDelete, openLoader, hasOwnProperty, cancelButton, actionButton, delete} = props
	return (
		<div>
			<Dialog maxWidth={props.maxWidth || 'xs'} fullWidth open={props.open} onClose={() => props.close()}>
				<Grid container justifyContent={'space-between'} onClick={() => props.close()}>
					<DialogTitle sx={{ padding: '16px' }} className="!tw-font-bold tw-text-secondaryText">
						{props.title}
					</DialogTitle>
					{!props.hideClose && (
						<IconButton sx={{ padding: '16px' }} disableRipple>
							<CloseIcon />
						</IconButton>
					)}
				</Grid>
				<DialogContent style={{ padding: '16px' }}>{props.children}</DialogContent>
			</Dialog>
		</div>
	);
}


export  function FormDialog2(props) {
	// const {children, maxWidth, open, close, hideClose, loading, title, allowDelete, openLoader, hasOwnProperty, cancelButton, actionButton, delete} = props
	return (
		<div>
			<Dialog maxWidth={props.maxWidth || 'xs'} fullWidth open={props.open} onClose={() => props.close()} 
       PaperProps={{
        style: {
          width: props.maxWidth || '4000px', // Custom width applied here (4000px)
          maxWidth: 'none', // Override the default maxWidth
        },
      }}>
				<Grid container justifyContent={'space-between'} onClick={() => props.close()}>
					<DialogTitle sx={{ padding: '16px' }} className="!tw-font-bold tw-text-secondaryText">
						{props.title}
					</DialogTitle>
					{!props.hideClose && (
						<IconButton sx={{ padding: '16px' }} disableRipple>
							<CloseIcon />
						</IconButton>
					)}
				</Grid>
				<DialogContent style={{ padding: '16px' }}>{props.children}</DialogContent>
			</Dialog>
		</div>
	);
}

export function InfoDialog(props) {
	return (
		<div>
			<Dialog maxWidth={props.maxWidth || 'xs'} fullWidth open={props.open} onClose={() => props.close()}>
				<DialogContent style={{ padding: '16px' }}>{props.children}</DialogContent>
			</Dialog>
		</div>
	);
}

export function DeleteDialog(props) {
	// const loader = useSelector((state) => state.loader.openLoader);
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<Dialog maxWidth="xs" fullWidth="true" open={props.open} onClose={() => props.close()}>
				<DialogTitle className="!tw-p-4">
					<div className='tw-flex tw-items-center tw-justify-between'>
						<p className='tw-font-bold'>{props.title}</p>
						{!props.hideClose && (
						<IconButton sx={{padding:'4px'}} disableRipple onClick={()=>props.close()}>
							<CloseIcon />
						</IconButton>
					)}
					</div>
				</DialogTitle>

				{!props.loading ? (
					<>
						<DialogContent>{props.children}</DialogContent>
						<DialogActions style={{ padding:'16px' }}>
							{props.hasOwnProperty('allowDelete') && props.allowDelete == false ? (
								<Button className="uppercase" style={{ marginTop: 0 }} variant="contained" disableRipple disableElevation color="primary" onClick={() => props.close()}>
									{'OK'}
								</Button>
							) : (
								<>
									{/* <Button className="uppercase" style={{ marginTop: 0 }} variant="text" disableRipple disableElevation onClick={() => props.close()}>
										{props.cancelButton || 'Cancel'}
									</Button> */}
									<LoadingButton loading={false} className="uppercase tw-w-full" style={{ marginTop: 0, backgroundColor:"#FF6E66" }} variant="contained" disableRipple disableElevation onClick={() => props.delete()}>
										{props.actionButton || 'Yes, Delete'}
									</LoadingButton>
								</>
							)}
						</DialogActions>
					</>
				) : (
					<>
						<DialogContent>
							<div style={{ textAlign: 'center', paddingTop: '16px' }}>
								<CircularProgress />
								<div>Checking for related data...</div>
							</div>
						</DialogContent>
						<DialogActions style={{ paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
							<Button color="primary" className="uppercase" style={{ marginTop: 0 }} variant="contained" disableRipple disableElevation onClick={() => props.close()}>
								{props.cancelButton || 'Cancel'}
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
			<style>
				{`
			   .MuiDialogContent-root{
				color: #3F4F5E !important;
			   }
			`}
			</style>
		</div>
	);
}
