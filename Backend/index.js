const {Server} = require("socket.io");

const io = new Server(8000, {
    cors:true,
});

const users=[];

io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    socket.on("room:create",data => {
        console.log(data)
        socket.join(data.Passcode)
        users.push({
            username:data.name,
            roomId:data.Passcode,
            roomname:data.roomname,
            socketId:socket.id
        })
    })
    socket.on("room:join",data => {
        const room_exist = io.sockets.adapter.rooms.has(data.roomid);
        console.log('Roomjoined',data);
        if(room_exist){
            users.push({
                username:data.name,
                roomId:data.roomid,
                roomname:data.roomname,
                socketId:socket.id
            })
            socket.join(data.roomid)
            socket.to(data.roomid).emit('newuser',{username:data.name,roomId:data.roomid,roomname:data.roomname,socketId:socket.id})
            console.log('user joined room',data.name)
        }else{
            console.log("Room doesn't exist");
        }
    })
    socket.on("sendMessage",data => {
        console.log(data)
        socket.to(data.roomId).emit("reciveMessage",{message:data.message,name:data.username})
    })

    socket.on('otherusers',(data)=>{
        console.log(data)
        const filterUsers = users.filter((user) => user.roomId === data.roomId && user.socketId!==data.socketId);
        console.log(filterUsers)
        io.to(data.socketId).emit("otheruserslist", filterUsers);
    })

    socket.on('all user',(data)=>{
        console.log('all user emitted')
        const filterUsers = users.filter((user) => user.roomId === data.roomId && user.socketId!==data.socketId);
        io.to(data.socketId).emit("user list", filterUsers)
    })



    socket.on("sending signal", data => {
        console.log('Emit1')
        io.to(data.SignalUser).emit('user joined', { signal: data.signal, socketId: data.socketId });
    });

    socket.on("returning signal", data => {
        console.log('Emit2')
        io.to(data.socketId).emit('receiving returned signal', { signal: data.signal, id: socket.id });
    });
    


});
