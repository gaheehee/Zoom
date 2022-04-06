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
app.listen(3000, handleListen);

