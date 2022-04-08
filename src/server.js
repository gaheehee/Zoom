import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();


app.set('view engine', "pug");
app.set("views", __dirname + "/views"); 
app.use("/public", express.static(__dirname + "/public"));
//우리가 사용할 유일한 route 생성
//home으로 가면 request, response를 받고 res.render를 함(home 렌더)
app.get("/", (req, res) => res.render("home"));
//어느 경로건 home으로 돌려보냄
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);  //http 서버 생성
//{ server }를 넣어줘서 서버 전달해줌 (동일 port에서 http, ws 서버 다 돌릴 수 있게) -> http 위에 webSocket 만듦
const wss = new WebSocket.Server({ server });   //WebSocket 서버 생성

//server.js의 socket은 연결된 browser를 뜻함
wss.on("connection", (socket) => {
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", message => {
        console.log(message.toString('utf8'));
    });
    socket.send("hello!!!!");
});

server.listen(3000, handleListen);


