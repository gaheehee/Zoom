import http from "http";
import { Server } from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";
const app = express();


app.set('view engine', "pug");
app.set("views", __dirname + "/views"); 
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home")); //home으로 가면 request, response를 받고 res.render를 함(home 렌더)
app.get("/*", (req, res) => res.redirect("/")); //어느 경로건 home으로 돌려보냄

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);  //http 서버 생성
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});  //socket io 서버 생성
instrument(wsServer, {
    auth: false
});


function publicRooms(){ //sids:private, rooms:public, private
    const {sockets: {
        adapter: {
            sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined){
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}


wsServer.on("connection", (socket) => {
    //wsServer.socketsJoin("announcement");   //소켓이 연결될 때 모든 socket이 announcement 방에 입장
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.group(`Socket Event: ${event}`)
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));   //하나의 socket에 msg 보냄
        wsServer.sockets.emit("room_change", publicRooms());    //모든 socket에 msg 보냄
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", nickname => (socket["nickname"] = nickname));
});

//const wss = new WebSocket.Server({ server });   //{server}를 넣어 http 위에 webSocket서버 생성(동일 port사용)

// const sockets = []; //누군가 서버에 연결하면 그 connection을 여기다 넣음

// wss.on("connection", (socket) => {  //server.js의 socket은 연결된 browser를 뜻함
//     sockets.push(socket);
//     socket["nickname"] = "Anon";    //socket 안에 정보 저장 가능
//     console.log("Connected to Browser ✅");
//     socket.on("close", () => console.log("Disconnected from the Browser ❌"));  //close listen

//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg); //str -> obj
//         switch (message.type) {
//             case "new_message": 
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));   //연결된 모든 소켓에 msg send
//                 break;
//                 case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });

httpServer.listen(3000, handleListen);


