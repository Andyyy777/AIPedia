import { Card, CardContent, Typography, List, ListItem, Button } from '@mui/material'
import React from 'react'
import { useContextStore } from '../store/store';
import { useShallow } from 'zustand/shallow';
import { set } from 'zod';

const ContextSelector = () => {
    const [context, setContext] = useContextStore(
        useShallow((state) => [state.context, state.setContext])
    );
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

    function onSelectContext(context: { time_availale: string; travel_speed: string; trajectory: string; }): void {
        setContext(JSON.stringify(context, null, 2));
    }

return (
    <Card
        className="response-card"
        sx={{
            maxWidth: 200,
            maxHeight:200,
            overflow: "auto",
            margin: "20px auto",
            padding: 2,
            boxShadow: 3,
            position: "fixed",
            top: 100,
            left: 20,
            zIndex: 1000,
        }}
    >
        <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
                Context Pool
            </Typography>
            <List>
                {user_context_pool.map((context, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: 1,
                            marginBottom: 1,
                            padding: 1,
                        }}
                    >
                        <div style={{ marginBottom: 8 }}>
                            <Typography variant="body2">
                                <strong>Time Available:</strong> {context.time_availale}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Travel Speed:</strong> {context.travel_speed}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Trajectory:</strong> {context.trajectory}
                            </Typography>
                        </div>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onSelectContext(context)}
                        >
                            Select
                        </Button>
                    </ListItem>
                ))}
            </List>
        </CardContent>
    </Card>
);
}

export default ContextSelector