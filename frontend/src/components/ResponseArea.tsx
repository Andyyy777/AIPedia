import React from 'react';
import { useAIPediaStore, useGPTStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow'
import Typography from '@mui/material/Typography';
import { Card, CardContent } from "@mui/material";
import "./ResponseArea.css"
import { parse } from 'path';
import { CircularProgress } from '@mui/material';

function ResponseArea() {
  const [response] = useAIPediaStore(
    useShallow((state) => [state.response])
  )

  const [inputText] = useGPTStore(
    useShallow((state) => [state.inputText])
  );

  const [isProcessing] = useGPTStore(
    useShallow((state) => [state.isProcessing])
  );

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

  try{
    const parsedData = JSON.parse(response!);
    return (
      <div className='ResponseArea'>
        <Card className="response-card" sx={{ maxWidth: 600, margin: "20px auto", padding: 2, boxShadow: 3 }}>
        <CardContent>
        <Typography variant="h5" gutterBottom>
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
        </Typography>
        </CardContent>
        </Card>
      </div>
    );
  }
  catch(e){
    console.log(e);
    return (
      <div className='ResponseArea'>
        <Card className="response-card" sx={{ maxWidth: 600, margin: "20px auto", padding: 2, boxShadow: 3 }}>
          <CardContent>
            <div
              className="response-content"
              dangerouslySetInnerHTML={{ __html: response! }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default ResponseArea;