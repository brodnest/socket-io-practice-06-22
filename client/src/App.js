import { useState, useEffect } from 'react';
import { Box,Typography, TextField, Button, Grid, Paper, 
  List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import './App.css';
import  io  from 'socket.io-client';

const socket = io.connect("http://localhost:3001")

function App() {
  const [ message, setMessage] = useState('');
  const [ messageReceived, setMessageReceived] = useState('');
  const sendMessage = () => {
    socket.emit("send_message", {message})
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    })
  }, [socket])

  return(
  <Grid item xs={12} md={6}
        sx={{
          marginTop: 1,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
        }}>
            <Typography component="div" variant="h4" gutterBottom>
            CHATbox
            </Typography>
            <Paper elevation={3} sx={{height: 600}}>
                <Typography variant="h6" sx={{p:4}}>
                  {messageReceived}
                </Typography>
            </Paper>
            < Grid  sx={{display:'flex', flexDirection: 'row', mt: 2}}>
              <TextField 
                required
                margin="normal"
                // value={message}
                onChange={(e) => setMessage(e.target.value)}
                id="outlined-inputNumber" 
                label="Input your message here" 
                variant="outlined"
                multiline 
                sx={{ width: 1000, mr:2 }}>
                Input message
              </TextField>
              <Button 
                type="button"
                onClick={() => sendMessage()}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Send
              </Button>
            </Grid>
    </Grid>
  )
}

export default App;
