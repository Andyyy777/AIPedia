import { useAIPediaStore, useGPTStore, useImageStore } from "../store/store";
import { useShallow } from "zustand/shallow";
import { Box, Button, TextField, useAutocomplete } from "@mui/material";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { useEffect } from "react";

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

const UserStatusStructure = z.object({
  time_available: z.string(),
  travel_speed: z.string(),
  trajectory: z.string(),
  word_count: z.string(),
});

function GPTComponent() {
  const [inputText, setInputText] = useGPTStore(
    useShallow((state) => [state.inputText, state.setInputText])
  );

  const [response, updateResponse] = useAIPediaStore(
    useShallow((state) => [state.response, state.updateResponse])
  );

  const [userStatus, updateUserStatus] = useAIPediaStore(
    useShallow((state) => [state.userStatus, state.updateUserStatus])
  );

  const [firstUploaded, setFirstUploaded] = useImageStore(
    useShallow((state) => [state.firstUploaded, state.setFirstUploaded])
  );

  const [language, updateLanguage] = useAIPediaStore(
    useShallow((state) => [state.language, state.updateLanguage])
  );

  const selectedImage = useImageStore((state) => state.selectedImage);
  let inputContent = "";
  console.log("firstUploaded", firstUploaded);
  const user_context_pool = [{
    time_availale: "30 sec", 
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
  const userContext = user_context_pool[index]
  
  interface SectionFormat {
    type: string,
    title?: string;
    content: string,
  }

  const autoParseAndFormat = (inputText:string) =>  {
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
          return `<strong>${section.title}</strong>: ${section.content} <br/>
          <br/>`;
        } else {
          return `<p>${section.content}</p>
          <br/>`;
        }
      })
      .join("\n");
  }

  const callUserContextAPI = async () => {
    console.log(userContext)
    inputContent = `
      Given the user’s context: available time: ${userContext.time_availale}, travel speed: ${userContext.travel_speed}, trajectory: ${userContext.trajectory}
      Categorize their current status for each of the following factors:
        1. Time Available
        - Limited (e.g., 30 seconds or less)
        - Moderate (e.g., about 1 minute)
        - Extended (e.g., 2 minutes or more)
        2. Travel Speed (range 0.5 - 2 m/s)
        - Slow Walking
        - Moderate Walking
        - Fast Walking
        3. Trajectory
        - Approaching a Specific Spot
        - Near a Spot
        - Passing By
      Use the available data to categorize the user’s context into one of these three categories for each factor. 
      Then determine the appropriate word count for a scenery summary. 
      Only report the category and word count in the following JSON format: 
      {
        “time_available”: “time available options”, 
        “travel_speed”: “travel speed options”, 
        “trajectory”: “trajectory options”, 
        “word_count”: “range of word count suggested”
      }
    `
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
              { type: "text", text: inputContent }
            ],
          },
        ],
        response_format: zodResponseFormat(UserStatusStructure, "event"),
      });
      const data = response;
      let responseContent = data.choices[0]?.message?.content || "{}";
      let parsedData;
      try {
        parsedData = JSON.parse(responseContent);
        updateUserStatus(JSON.stringify(parsedData, null, 2));
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
    await callUserContextAPI();
    const parsed_status = JSON.parse(userStatus || "{}");
    if (firstUploaded) {
      console.log("firstUploaded");
      inputContent = `Please analyze the uploaded image and generate a tourism introduction in the following JSON format in ${language}:
      {
        "description": "A short description highlighting key features, natural beauty, and cultural significance.",
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
        `User also provide some questions they interested. Please answer the following questions from user in ${language} as well:` +
        inputText;
    }
    const apiKey = process.env.REACT_APP_GPT_API;
    const OpenAI = require("openai");

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    // let parsed_status = JSON.parse(userStatus!);
    console.log("status", parsed_status)
    let context_condition = `Given the user’s context: available time: ${parsed_status.time_available}, travel speed: ${parsed_status.travel_speed}, trajectory: ${parsed_status.trajectory}
    please generate a tourism introduction based on the uploaded image and user's questions within ${parsed_status.word_count} words in ${language}.`

    console.log(context_condition)
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
        responseContent = responseContent.replace(/```json[\s\S]*?```/, "").trim();
        responseContent = autoParseAndFormat(responseContent);
        console.error("Failed to parse JSON response:", error);
        updateResponse(responseContent);
      }
    } catch (error) {
      console.error("Error calling GPT API:", error);
      updateResponse("Error generating response");
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     await callUserContextAPI();
  //     console.log(userStatus);
  //   })();
  // }, [])

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
