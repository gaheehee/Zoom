import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();


app.set('view engine', "pug");
app.set("views", __dirname + "/views"); 
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home")); //home으로 가면 request, response를 받고 res.render를 함(home 렌더)
app.get("/*", (req, res) => res.redirect("/")); //어느 경로건 home으로 돌려보냄

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);  //http 서버 생성
const wsServer = SocketIO(httpServer);  //socket io 서버 생성

wsServer.on("connection", (socket) => {
    console.log(socket);
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


