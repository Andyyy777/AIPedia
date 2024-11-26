import { useAIPediaStore, useGPTStore } from '../store/store';
import { useShallow } from 'zustand/shallow';
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import "./Conversation.css";
import React, { useEffect, useState } from 'react';

const Conversation = () => {
  const [response] = useAIPediaStore(
    useShallow((state) => [state.response])
  );

  const [inputText] = useGPTStore(
    useShallow((state) => [state.inputText])
  );

  const [isProcessing] = useGPTStore(
    useShallow((state) => [state.isProcessing])
  );

  interface Message {
    type: string;
    content: any;
  }
  
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (inputText !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', content: inputText },
      ]);
    }
  },[inputText]);
  useEffect(() => {
    if (response) {
      console.log("response:", response)
      try {
        let formattedResponse:any;
        try {
          const parsedData = JSON.parse(response);
          formattedResponse = (
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
            <h4>Description</h4>
            <p className="content">{parsedData.description}</p>
  
            {parsedData.historical_facts == ""? null:
            <div>
            <h4>Historical Facts</h4>
            <p className="content">{parsedData.historical_facts}</p>
            </div>
            }
  
            { parsedData.nearby_attractions.length === 0? null:
              <div>
              <h4>Nearby Attractions</h4>
            <ul>
              {parsedData.nearby_attractions.map((attraction:any, index:number) => (
                <li className="content" key={index}>{attraction}</li>
              ))}
            </ul>
            </div>
            }
  
            { parsedData.nearby_places_to_eat.length === 0? null:
              <div>
              <h4>Nearby Places to Eat</h4>
            <ul>
              {parsedData.nearby_places_to_eat.map((place:any, index:number) => (
                <li className="content" key={index}>
                  {place.restaurant} - {place.average_price}
                </li>
              ))}
            </ul>
            </div>
            }
  
            { parsedData.practical_information.ambiance === "" && parsedData.practical_information.opening_hours === "" && parsedData.practical_information.ticket_price === ""
            ? null: <h4>Practical Information</h4>
            }
            { parsedData.practical_information.ticket_price === ""? null:
              <p className="content"><strong>Ticket Price:</strong> {parsedData.practical_information.ticket_price}</p>
            }
            { parsedData.practical_information.opening_hours === ""? null:
              <p className="content"><strong>Opening Hours:</strong> {parsedData.practical_information.opening_hours}</p>
            }
            { parsedData.practical_information.ambiance === ""? null:
              <p className="content"><strong>Ambiance:</strong> {parsedData.practical_information.ambiance}</p>
            }

            {inputText !== ""? <div><h4>Your Question</h4> <p className="content"> {parsedData.user_question_answer}</p></div>: null}
          </div>
          );
        } catch {
          formattedResponse = <div dangerouslySetInnerHTML={{ __html: response }} />;
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'ai', content: formattedResponse },
        ]);
      } catch (error) {
        console.error("Failed to parse response:", error);
      }
    }
  }, [response]);

  if (isProcessing) {
    return (
      <div className='ResponseArea'>
        <Card className="response-card loading-card" sx={{ maxWidth: 600, margin: "20px auto", padding: 2, boxShadow: 3 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='ConversationArea'>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <Card 
              className="response-card" 
              sx={{ 
                maxWidth: 600, 
                margin: "20px auto", 
                padding: 2, 
                boxShadow: 3,
                marginLeft: message.type === 'user' ? 'auto' : '20px',
                marginRight: message.type === 'ai' ? 'auto' : '20px',
                backgroundColor: message.type === 'user' ? '#e3f2fd' : '#fff',
              }}
            >
              <CardContent>
                <Typography variant="body1" className="content">
                  {message.content}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        // empty card placeholder
        <Card 
          className="empty-conversation-card" 
          sx={{ 
            maxWidth: 600, 
            margin: "20px auto", 
            padding: 2, 
            boxShadow: 1,
            minHeight: '200px',
            minWidth: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Your conversation will appear here
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {isProcessing && (
        <div className="message ai">
          <Card 
            className="response-card loading-card" 
            sx={{ 
              maxWidth: 600, 
              margin: "20px auto", 
              padding: 2, 
              boxShadow: 3,
              marginLeft: '20px',
              marginRight: 'auto',
              minHeight: '100px'
            }}
          >
            <CardContent sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%' 
            }}>
              <CircularProgress size={30} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Conversation;