const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const port = req.socket.remotePort;

    console.log("CLIENT CONNECTED");
    console.log("IP:", ip);
    console.log("PORT:", port);

    ws.send(`IP:PORT: ${ip}:${port}`);

    ws.on("message", (msg) => {
        console.log("FROM PHONE:", msg.toString());
    });

});