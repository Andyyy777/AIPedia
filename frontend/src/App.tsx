import React from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import LanguageSelect from './components/LanguageSelect';
import ResponseArea from './components/ResponseArea';
import Typography from '@mui/material/Typography';
import FloatingSelect from './components/FloatingSelect';
import GPTComponent from './LLMs/GPTComponent';
import ContextSelector from './components/ContextSelector';
// import Conversation from './components/Conversation';

function App() {
  return (
    <div className="App">
      <Typography variant="h5">
        AIPedia
      </Typography>
      <LanguageSelect/>
      <ImageUploader />
      <ResponseArea/> 
      {/* <Conversation/> */}
      <FloatingSelect/>
      <ContextSelector/>
      <GPTComponent/>
    </div>
    
  );
}

export default App;
