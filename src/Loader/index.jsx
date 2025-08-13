import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, LoaderBg } from './style';

export default function Loader(){
  return (
    <Box >
      <LoaderBg><CircularProgress /></LoaderBg>
    </Box>
  );
}
