const {Server} = require("socket.io");

const io = new Server(8000, {
    cors:true,
});

io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    socket.on("room:create",data => {
        socket.join(data.Passcode)
    })
    socket.on("room:join",data => {
        const room_exist = io.sockets.adapter.rooms.has(data.roomid);
        console.log(data);
        if(room_exist){
            socket.join(data.roomid)
            console.log('user joined room',data.name)
        }else{
            console.log("Room doesn't exist");
        }
    })
    socket.on("sendMessage",data => {
        console.log(data)
        socket.to(data.roomId).emit("reciveMessage",{message:data.message,name:data.username})
    })
});