import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useImageStore } from '../store';
import { shallow, useShallow } from 'zustand/shallow';


const ImageUploader = () => {
    const selectedImage = useImageStore(useShallow((state)=>state.selectedImage));
    const setSelectedImage = useImageStore(useShallow((state)=>state.setSelectedImage));
    // const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
  
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
  
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <Card sx={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center', padding: '1rem' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Image Upload
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'block', margin: '1rem auto' }}
          />
          {selectedImage ? (
            <div style={{ marginTop: '1rem' }}>
              <img
                src={selectedImage}
                alt="Uploaded"
                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              />
            </div>
          ) : (
            <Typography variant="body1">No image uploaded yet.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedImage(null)}
            sx={{ marginTop: '1rem' }}
          >
            Clear Image
          </Button>
        </CardContent>
      </Card>
    );
}

export default ImageUploader