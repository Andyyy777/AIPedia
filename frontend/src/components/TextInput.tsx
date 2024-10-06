import { Fab, TextField, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const TextInput = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: 2,
      }}
    >
      <TextField
        id="outlined-multiline-flexible"
        label="Questions"
        multiline
        maxRows={15}
        sx={{
          width: "80%",
        }}
      />

      <Fab
        sx={{
          width: "10%",
          marginLeft: 2,
        }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Box>
  );
};

export default TextInput;
