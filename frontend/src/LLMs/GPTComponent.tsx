import { useAIPediaStore, useGPTStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { Box, Button, TextField, useAutocomplete } from "@mui/material";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// just a template to refine the output format
const OutPutStructure = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

function GPTComponent() {
  const [inputText, setInputText] = useGPTStore(
    useShallow((state) => [
      state.inputText,
      state.setInputText,
    ])
  );

  const [response, updateResponse] = useAIPediaStore(
    useShallow((state) => [
      state.response,
      state.updateResponse,
    ])
  )

  const callGPTAPI = async () => {
    const apiKey = process.env.REACT_APP_GPT_API;
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: inputText }],
            response_format: zodResponseFormat(OutPutStructure, "event"),
            // temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      updateResponse(data.choices[0]?.message?.content || "No response");
    } catch (error) {
      console.error("Error calling GPT API:", error);
      updateResponse("Error generating response");
    }
  };

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
          id="outlined-textarea"
          label="Multiline Placeholder"
          placeholder="Enter your prompt"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          multiline
          sx={{
            width: "80%",
          }}
        />
        <Button
          onClick={callGPTAPI}
          variant="outlined"
          sx={{
            width: "10%",
            marginLeft: 2,
          }}
        >
          Submit
        </Button>
      </Box>
  );
}

export default GPTComponent;
