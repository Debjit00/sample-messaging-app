const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create Express app
const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});
// Routes
app.get('/', (req, res) => {
  res.render('index');
});


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('chat message', (msg) => {
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});