import { useAIPediaStore, useGPTStore, useImageStore, useAnchorStore, useContextStore, useConversationStore, ConversationMessage } from "../store/store";
import { useShallow } from "zustand/shallow";
import { Box, Button, TextField, useAutocomplete } from "@mui/material";
import { zodResponseFormat } from "openai/helpers/zod";
import { set, z } from "zod";
import { useEffect, useState } from "react";

// just a template to refine the output format
const OutPutStructure = z.object({
  description: z.string(),
  historical_facts: z.string(),
  nearby_attractions: z.array(z.string()) || null,
  nearby_places_to_eat: z.array(
    z.object({ restaurant: z.string(), average_price: z.string() })
  ) || null,
  practical_information: z.object({
    ticket_price: z.string(),
    opening_hours: z.string(),
    ambiance: z.string(),
  }),
  user_question_answer: z.string() || null,
});

const UserStatusStructure = z.object({
  time_available: z.string(),
  travel_speed: z.string(),
  trajectory: z.string(),
  word_count: z.string(),
});

function GPTComponent() {
  const [inputText, setInputText, isProcessing, setIsProcessing] = useGPTStore(
    useShallow((state) => [state.inputText, state.setInputText, state.isProcessing, state.setIsProcessing])
  );

  const [tempInput, setTempInput] = useState("");

  const [response, updateResponse] = useAIPediaStore(
    useShallow((state) => [state.response, state.updateResponse])
  );

  const [userStatus, updateUserStatus] = useAIPediaStore(
    useShallow((state) => [state.userStatus, state.updateUserStatus])
  );

  const [context, setContext] = useContextStore(
    useShallow((state) => [state.context, state.setContext])
);

  const [firstUploaded, setFirstUploaded] = useImageStore(
    useShallow((state) => [state.firstUploaded, state.setFirstUploaded])
  );

  const [language, updateLanguage] = useAIPediaStore(
    useShallow((state) => [state.language, state.updateLanguage])
  );

  const [selectedOption, setSelectedOption] = useAnchorStore(
    useShallow((state) => [state.selectedOption, state.setSelectedOption])
  );

  const [conversation, setConversation] = useConversationStore(
    useShallow((state) => [state.conversation, state.setConversation])
  );

  const selectedImage = useImageStore((state) => state.selectedImage);
  let inputContent = "";
  console.log("firstUploaded", firstUploaded);
  const user_context_pool = [{
    time_availale: "10 sec", 
    travel_speed: "2 m/s", 
    trajectory: "walking from union station to CN tower"
  }, {
    time_availale: "1 min", 
    travel_speed: "1 m/s", 
    trajectory: "near CN tower"
  }, {
    time_availale: "2 min", 
    travel_speed: "0.5 m/s", 
    trajectory: "passing by CN tower"
  }]

  let index = Math.floor(Math.random() * user_context_pool.length)
  console.log("context", context);
  const userContext = !context? user_context_pool[index]: JSON.parse(context);
  
  interface SectionFormat {
    type: string,
    title?: string;
    content: string,
  }

  const autoParseAndFormat = (inputText:string) =>  {
    console.log("to be parsed:", inputText)
    const cleanedText = inputText.replace(/```json[\s\S]*?```/, "").trim();
  
    const formattedContent: { sections: SectionFormat[] } = {
      sections: [],
    };
  
    const lines = cleanedText.split("\n");
  
    lines.forEach((line) => {
      
      const boldMatch = line.match(/\*\*(.*?)\*\*/);
      if (boldMatch) {
        const title = boldMatch[1];
        const description = line.replace(/\*\*(.*?)\*\*/, "").trim();
        formattedContent.sections.push({
          type: "highlight",
          title: title,
          content: description,
        });
      } else {
        
        if (line.trim()) {
          formattedContent.sections.push({
            type: "text",
            content: line.trim(),
          });
        }
      }
    });
    const htmlOutput = renderHTML(formattedContent);
    console.log(htmlOutput);
    return htmlOutput;
  };
  
  const renderHTML = (parsedContent: { sections: SectionFormat[] }): string =>{
    return parsedContent.sections
      .map((section) => {
        if (section.type === "highlight" && section.title) {
          section.content = section.content.replace(/\d+\.\s*：/g, "");
          return `<strong>${section.title}</strong> ${section.content} <br/>
          <br/>`;
        } else {
          return `<p>${section.content}</p>
          <br/>`;
        }
      })
      .join("\n");
  }

  const callUserContextAPI = async () => {
    setIsProcessing(true);
    const systemContent = `
    You are a context analyzer that determines appropriate content length based on user circumstances.
    Follow these strict rules when determining word count:

    1. Time Available Categories:
    - Limited (30 seconds or less): 50-150 words
    - Moderate (about 1 minute): 150-300 words
    - Extended (2 minutes or more): 300-500 words

    2. Travel Speed Adjustments:
    - Slow Walking (0-0.5 m/s): Keep original word count
    - Moderate Walking (0.6-1.2 m/s): Reduce by 20%
    - Fast Walking (1.3-2 m/s): Reduce by 40%
    - Running (2.1-5 m/s): Reduce by 60%
    - Driving (> 5 m/s): Reduce by 80%

    3. Trajectory Impact:
    - Standing Besides: Keep original word count
    - Walking by: Reduce by 10%
    - Driving By: Reduce by 30%

    Calculate the final word count by, let's think it step by step:
    1. Start with base word count from Time Available
    2. Apply Travel Speed reduction
    3. Apply Trajectory reduction
    4. Round to nearest 50 words
    5. Ensure final count is between 50-500 words
  `;

  let inputContextContent = `
    Given the user's context:
    - Available time: ${userContext.time_availale}
    - Travel speed: ${userContext.travel_speed}
    - Trajectory: ${userContext.trajectory}

    1. Categorize each factor according to the provided options
    2. Calculate the appropriate word count following the specified rules
    3. Return ONLY the following JSON format:
    {
      "time_available": "EXACT CATEGORY NAME from options",
      "travel_speed": "EXACT CATEGORY NAME from options",
      "trajectory": "EXACT CATEGORY NAME from options",
      "word_count": "CALCULATED NUMBER only"
    }
  `;
    console.log("inputContent", inputContextContent);
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
            role: "system",
            content: [
              { type: "text", text: systemContent }
            ],
          },
          {
            role: "user",
            content: [
              { type: "text", text: inputContextContent }
            ],
          },
        ],
        response_format: zodResponseFormat(UserStatusStructure, "event"),
      });
      const data = response;
      let responseContent: string = data.choices[0]?.message?.content || "{}";
      let parsedData;
      try {
        parsedData = JSON.parse(responseContent);
        console.log("parsedData", parsedData);
        updateUserStatus(JSON.stringify(parsedData, null, 2));
        return parsedData;
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        updateUserStatus(responseContent);
      }
    } catch (error) {
      console.error("Error calling GPT API:", error);
      updateUserStatus("Error generating response");
    }
  }

  const callGPTAPI = async () => {
    setInputText(tempInput);
    const currentInput = tempInput;
    console.log("tempInput", tempInput);
    console.log("inputText", currentInput);
    setTempInput("");
    const parsed_status = await callUserContextAPI();
    console.log("parsed_status", parsed_status);
    if (firstUploaded) {
      // console.log("firstUploaded");
      inputContent = `Please analyze the uploaded image and generate a tourism introduction in the following JSON format in ${language}. 
      Please strictly follow the word count limit ${parsed_status.word_count} words, 
      "nearby places to eat and corresponding average price", "nearby attractions" and "practical_information" 
      could be ignored if adding them will exceed the word limit ${parsed_status.word_count}.
      `;
    }
    console.log('input text:', currentInput)
    if (currentInput) {
      inputContent +=
        `User also provide some questions they interested. Please answer the following questions from user in ${language} as well:` +
        currentInput;
    }
    const apiKey = process.env.REACT_APP_GPT_API;
    const OpenAI = require("openai");

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    // let parsed_status = JSON.parse(userStatus!);
    // console.log("status", parsed_status)
    let context_condition = `Given the user’s context: available time: ${parsed_status.time_available}, travel speed: ${parsed_status.travel_speed}, trajectory: ${parsed_status.trajectory}
    please generate a tourism introduction based on the uploaded image and user's questions within ${parsed_status.word_count} words in ${language}.`

    console.log(inputContent)
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:[{
              type: "text", text: context_condition
            }],
          },
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
        temperature: 0.2,
      });
      
      const data = response;
      let responseContent = data.choices[0]?.message?.content || "{}";
      console.log("responseContent", responseContent);
      let parsedData;
      try {
        parsedData = JSON.parse(responseContent);
        console.log(parsedData);
        updateResponse(JSON.stringify(parsedData, null, 2));
        setFirstUploaded(false);
      } catch (error) {
        responseContent = responseContent.replace(/```json[\s\S]*?```/, "").trim();
        responseContent = autoParseAndFormat(responseContent);
        console.error("Failed to parse JSON response:", error);
        updateResponse(responseContent);
      } finally {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error calling GPT API:", error);
      updateResponse("Error generating response");
    }
  };

  useEffect(() => {
    setFirstUploaded(true);
    setContext(null);
    setInputText("");
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: 1,
        marginBottom: 2,
      }}
    >
      <TextField
        id="outlined-textarea"
        label="Multiline Placeholder"
        placeholder="Enter your prompt"
        value={tempInput}
        onChange={(e) => setTempInput(e.target.value)}
        multiline
        sx={{
          width: "80%",
        }}
        // disable it when selectedOption is "Image only"
        disabled={selectedOption === "Image only"}
      />
      <Button
        onClick={() => {
          callGPTAPI();
        }}
        variant="outlined"
        sx={{
          width: "10%",
          marginLeft: 2,
        }}
        disabled={selectedOption === "Image only"}
      >
        Submit
      </Button>
    </Box>
  );
}

// , "nearby places to eat and corresponding average price", "nearby attractions" and "practical_information" are optional fields:
//       {
//         "description": "A short description highlighting key features, natural beauty, and cultural significance.",
//         "historical_facts": "A few key historical facts about the place.",
//         "nearby_attractions": [
//           "Attraction 1",
//           ...
//         ],
//         "nearby places to eat and corresponding average price": [
//           {
//             "restaurant": "Restaurant 1",
//             "average_price": "$$"
//           },
//           ...
//         ],
//         "practical_information": {
//           "ticket_price": "Information about ticket pricing if applicable.",
//           "opening_hours": "Operating hours of the location.",
//           "ambiance": "Describe the ambiance visitors can expect, in three key words."
//         }
//       }
      
//       Please ensure the JSON is valid and follows the structure provided.

export default GPTComponent;
