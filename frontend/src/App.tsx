import React from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import LanguageSelect from './components/LanguageSelect';
import ResponseArea from './components/ResponseArea';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div className="App">
      <Typography variant="h5" gutterBottom>
        AIPedia
      </Typography>
      <LanguageSelect/>
      <ImageUploader />
      <ResponseArea/>
    </div>
    
  );
}

export default App;
