import { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, Paper, Box, 
   List, ListItem, ListItemText, Divider } from '@mui/material';
import './App.css';
import  io  from 'socket.io-client';
import zIndex from '@mui/material/styles/zIndex';

const socket = io.connect("http://localhost:3001")

function App() {
  const [ message, setMessage ] = useState('');
  const [ name, setName ] = useState('');
  const [ chat, setChat ] = useState([]);
  const [ room, setRoom ] = useState('');
  const [ chatHeader, setChatHeader ] = useState('');

  const joinRoom = () => {
    if (room !== "") {
      setChatHeader(`Hello ${name}, You're connected in room: ${room}`);
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", {message, room, name});
    };
  
  useEffect(() => {
    let temp = [...chat];
    socket.on("receive_message", (data) => {
      let name = data.name;
      let message = data.message;

      temp.push(`${name}: ${message}`);
      setChat(temp);
      setMessage('')
    })
  },[socket])

  return (
    <Grid item xs={12} md={6}
      sx={{
        marginTop: 1,
        padding: 4,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <Grid item xs={4} md={4} sx={{mr:4}}>
        <Typography component="div" variant="h6" sx={{color:'red'}} gutterBottom>
          Input credentials to join chat
        </Typography>
        < Grid item xs={6} md={3} sx={{display:'flex', flexDirection: 'column', mr:2, mt: 3}}>
          <TextField 
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            label="What is your name?" 
            variant="outlined"
            sx={{ mr:2 }}
            >
          </TextField>
          <TextField 
            margin="normal"
            type="number"
            onChange={(e) => setRoom(e.target.value)}
            label="Select a room number"
            helperText= "must be on the same room to access messages" 
            variant="outlined"
            sx={{ mr:2 }}
            >
          </TextField>
          <Button 
            type="button"
            onClick={(e) => joinRoom(e)}
            variant="contained"
            sx={{ mt: 3, mr: 2 }}
            >
            Enter Room
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={6} md={4}>
        <Typography component="div" variant="h4">
           CHATBOX
        </Typography>
        <Paper elevation={3} sx={{ height: 600, width: 600}}>
          <Typography variant="body1" sx={{p:3, mt: 2}}>
            {chatHeader}
          </Typography>
          <Divider />

          <List>
            <ListItem sx={{flexDirection:'column', alignItems: 'baseline', ml: 2}}>
                {chat.map((element, index) => (
                  <ListItemText key={index}>{element}</ListItemText>
                ))}
            </ListItem>
          </List>
        </Paper>

        < Grid item xs={12} md={6} sx={{display:'flex', flexDirection: 'row', mt: 2}}>
          <TextField 
            required
            margin="normal"
            onChange={(e) => setMessage(e.target.value)}
            label="Input your message here" 
            variant="outlined"
            multiline 
            sx={{ width: 500, mr:2 }}
            >
          </TextField>
          <Button 
            type="button"
            onClick={() => sendMessage()}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            >
            Send
          </Button>
        </Grid>
      </Grid>

    </Grid>
  )
}

export default App;
