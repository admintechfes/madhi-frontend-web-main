import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';


export default function DeleteAlert(props) {

  return (
    <div>
      <Dialog
        maxWidth={props.maxWidth || 'xs'}
        fullWidth
        open={props.open}
        onClose={() => props.close()}
      >

        <DialogTitle
          sx={{
            padding: '16px',
            margin: 0,
            display: 'flex',
            alignItems:"flex-start",
            justifyContent: 'space-between'
          }}
          className="!tw-text-[20px] !tw-font-bold tw-text-secondaryText"
        >
          {props.title}
          {!props.hideClose && (
            <IconButton className='!tw-text-[3rem] !tw-p-0 !tw-m-0 tw-tetx-[#999]' disableRipple>
              <CloseIcon className='!tw-text-[2rem] !tw-p-0 !tw-m-0' onClick={() => props.close()}/>
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent style={{ padding: '16px' }}>{props.children}</DialogContent>
      </Dialog>
    </div>


  );
}


