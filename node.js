const express = require("express");
const app = express();

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

app.get("/", (req, res) => {

    const log = {
        datetime: new Date().toISOString(),
        ip: getIp(req),
        port: req.socket.remotePort,
        method: req.method,
        url: req.url,
        userAgent: req.headers["user-agent"]
    };

    logs.unshift(log); // NAJNOWSZE NA GÓRZE

    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }

    res.send(`
        <html>
        <body>
            <h1>LAST 100 REQUESTS</h1>
            <table border="1" cellpadding="5">
                <tr>
                    <th>Time</th>
                    <th>IP</th>
                    <th>Port</th>
                    <th>UA</th>
                </tr>
                ${logs.map(l => `
                    <tr>
                        <td>${l.datetime}</td>
                        <td>${l.ip}</td>
                        <td>${l.port}</td>
                        <td>${l.userAgent}</td>
                    </tr>
                `).join("")}
            </table>
        </body>
        </html>
    `);
});

app.listen(8080, () => {
    console.log("Server running");
});