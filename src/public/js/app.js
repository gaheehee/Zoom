const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);   //app.js의 socket은 서버로의 연결을 뜻함

function makeMessage(type, payload){    //msg 전송할 때 obj로 만든 후 string으로 변환해서 보냄
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
    console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected to Server ❌");
});

function handleSubmit(event) {  //user가 msg 전송
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = "";
}

function handleNickSubmit(event) {  //user가 nickname 전송
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));  //send json obj to back-end
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);