import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import AvailableLanguages from '../constants/AvailableLanguages';
import { useAIPediaStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
import "./LanguageSelect.css"

function LanguageSelect() {
  const [language, updateLanguage] = useAIPediaStore(
    useShallow((state) => [state.language, state.updateLanguage])
  )

  return (
    <div className='LanguageSelect'>
      <Autocomplete
        disablePortal
        options={AvailableLanguages}
        value={language}
        onChange={(e, value)=>updateLanguage(value)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Language" />}
      />
    </div>
  );
}

export default LanguageSelect;