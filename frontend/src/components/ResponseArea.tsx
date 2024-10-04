import React from 'react';
import { useAIPediaStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow'
import Typography from '@mui/material/Typography';
import "./ResponseArea.css"

function ResponseArea() {
  const [response] = useAIPediaStore(
    useShallow((state) => [state.response])
  )
  
  return (
    <div className='ResponseArea'>
      <Typography variant="h5" gutterBottom>
        {response}
      </Typography>
    </div>
  );
}

export default ResponseArea;