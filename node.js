const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

app.get("/", (req, res) => {

    const log = {
        datetime: new Date().toISOString(),
        ip: getIp(req),
        port: req.socket.remotePort,
        userAgent: req.headers["user-agent"]
    };

    logs.unshift(log);
    if (logs.length > 100) logs.pop();

    res.send(`
        <h1>LAST 100 REQUESTS</h1>
        <pre>${JSON.stringify(logs, null, 2)}</pre>
    `);
});

wss.on("connection", (ws, req) => {

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const port = req.socket.remotePort;

    ws.send(`HELLO ${ip}:${port}`);

    ws.on("message", msg => {
        console.log("WS:", msg.toString());
    });
});

server.listen(8080, () => {
    console.log("Server running");
});