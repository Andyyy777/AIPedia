import { useAIPediaStore, useGPTStore, useImageStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { Box, Button, TextField, useAutocomplete } from "@mui/material";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// just a template to refine the output format
const OutPutStructure = z.object({
  description: z.string(),
  historical_facts: z.string(),
  nearby_attractions: z.array(z.string()),
  nearby_places_to_eat: z.array(
    z.object({ restaurant: z.string(), average_price: z.string() })
  ),
  practical_information: z.object({
    ticket_price: z.string(),
    opening_hours: z.string(),
    ambiance: z.string(),
  }),
});

function GPTComponent() {
  const [inputText, setInputText] = useGPTStore(
    useShallow((state) => [state.inputText, state.setInputText])
  );

  const [response, updateResponse] = useAIPediaStore(
    useShallow((state) => [state.response, state.updateResponse])
  );

  const [firstUploaded, setFirstUploaded] = useImageStore(
    useShallow((state) => [state.firstUploaded, state.setFirstUploaded])
  );

  const selectedImage = useImageStore((state) => state.selectedImage);
  let inputContent = "";
  console.log("firstUploaded", firstUploaded);

  const callGPTAPI = async () => {
    if (firstUploaded) {
      console.log("firstUploaded");
      inputContent = `Please analyze the uploaded image and generate a tourism introduction in the following JSON format, 
      please control the total length between 100 to 200 words:
      {
        "description": "A short description (within 100 words) highlighting key features, natural beauty, and cultural significance.",
        "historical_facts": "A few key historical facts about the place.",
        "nearby_attractions": [
          "Attraction 1",
          "Attraction 2",
          "Attraction 3"
        ],
        "nearby places to eat and corresponding average price": [
          {
            "restaurant": "Restaurant 1",
            "average_price": "$$"
          },
          {
            "restaurant": "Restaurant 2",
            "average_price": "$$$"
          }
        ],
        "practical_information": {
          "ticket_price": "Information about ticket pricing if applicable.",
          "opening_hours": "Operating hours of the location.",
          "ambiance": "Describe the ambiance visitors can expect, in three key words."
        }
      }
      
      Please ensure the JSON is valid and follows the structure provided.`;
    }

    if (inputText) {
      inputContent +=
        "User also provide some questions they interested. Please answer the following questions from user as well(please control the answer within 50 words):" +
        inputText;
    }
    const apiKey = process.env.REACT_APP_GPT_API;
    const OpenAI = require("openai");

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: inputContent },
              {
                type: "image_url",
                image_url: {
                  url: selectedImage,
                },
              },
            ],
          },
        ],
        response_format: firstUploaded? zodResponseFormat(OutPutStructure, "event"): null,
        // temperature: 0.7,
      });
      // try {
      //   const response = await fetch(
      //     "https://api.openai.com/v1/chat/completions",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${apiKey}`,
      //       },
      //       body: JSON.stringify({
      //         model: "gpt-4o-mini",
      //         messages: [{ role: "user", content: [{"type":"text", "text":inputContent}, {
      //           "type": "image_url",
      //           "image_url": {
      //           "url": selectedImage
      //          }}]}],
      //         response_format: zodResponseFormat(OutPutStructure, "event"),
      //         // temperature: 0.7,
      //       }),
      //     }
      //   );
      // console.log(response);
      // const data = await response.json();
      const data = response;
      let responseContent = data.choices[0]?.message?.content || "{}";
      let parsedData;
      try {
        parsedData = JSON.parse(responseContent);
        updateResponse(JSON.stringify(parsedData, null, 2));
        setFirstUploaded(false);
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        updateResponse(responseContent);
      }
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
        padding: 1,
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
