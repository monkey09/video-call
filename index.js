//Create our express and socket.io servers
const express = require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const cors = require('cors')
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
  }
})
// const {v4: uuidV4} = require('uuid')
app.use(cors())
const __dirname1 = path.resolve()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname1, "/public")))
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname1, "public"))
)
//app.set('view engine', 'ejs') // Tell Express we are using EJS
//app.use(express.static('public')) // Tell express to pull the client script from the public folder

// If they join the base link, generate a random UUID and send them to a new room with said UUID
// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })
// If they join a specific room, then render that room
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})
// When someone connects to the server
io.on('connection', socket => {
    // When someone attempts to join the room
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)  // Join the room
        socket.broadcast.emit('user-connected', userId) // Tell everyone else in the room that we joined
        
        // Communicate the disconnection
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-disconnected', userId)
        })
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT) // Run the server on the 3000 port