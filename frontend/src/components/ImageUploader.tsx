import React from "react";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useImageStore } from "../store/store";
import { useShallow } from "zustand/shallow";

const ImageUploader = () => {
  const selectedImage = useImageStore(
    useShallow((state) => state.selectedImage)
  );
  const setSelectedImage = useImageStore(
    useShallow((state) => state.setSelectedImage)
  );

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

  const handleButtonClick = () => {
    const fileInput = document.getElementById("image-upload-input");
    fileInput?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "1rem auto",
        textAlign: "center",
        padding: "1rem",
        width: "300px",
      }}
    >
      <CardContent>
        <input
          type="file"
          accept="image/*"
          id="image-upload-input"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        <Button
          variant="outlined"
          color="primary"
          onClick={handleButtonClick}
          sx={{ margin: "1rem auto", display: "block" }}
        >
          Choose Image
        </Button>

        {selectedImage ? (
          <Box sx={{ marginTop: "1rem" }}>
            <img
              src={selectedImage}
              alt="Uploaded Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearImage}
              sx={{ marginTop: "1rem" }}
            >
              Clear Image
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">No image uploaded yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
