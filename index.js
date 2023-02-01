const io = require("socket.io")(8801, {
    cors: {
        origin: "https://chat-appkh.netlify.app"
    }
})

let activeUsers = []


io.on("connection", (socket)=> {
    // add new users
    socket.on("new-user-add", (newUserId) => {
        if(!activeUsers.some((user)=> user.userId === newUserId)){
            activeUsers.push({userId: newUserId, socketId: socket.id})

            // console.log("new user Connected", activeUsers);
        }
        io.emit("get-users", activeUsers)
    })

    socket.on("disconnect", ()=> {
        activeUsers = activeUsers.filter((user) => user.sockedId !== socket.id)
        // console.log("user disconnect");
        io.emit("get-users", activeUsers)
    })


    // send message to a sepcific user
    socket.on("send-message", (data)=> {
        const {receviedId} = data
        const user = activeUsers.find(user => user.userId === receviedId)
        if(user){
            io.to(user.sockedId).emit("recive-message", data)
        }
    })

})