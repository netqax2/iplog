const express = require("express");
const app = express();

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

app.get("/", (req, res) => {

    const log = {
        time: new Date().toISOString(),
        ip: getIp(req),
        userAgent: req.headers["user-agent"]
    };

    logs.unshift(log);

    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }

    res.send(`
        <html>
        <head>
            <title>IP LOG</title>
        </head>
        <body>
            <h1>LAST 100 VISITS</h1>

            <table border="1" cellpadding="5">
                <tr>
                    <th>Time</th>
                    <th>IP</th>
                    <th>User Agent</th>
                </tr>

                ${logs.map(l => `
                    <tr>
                        <td>${l.time}</td>
                        <td>${l.ip}</td>
                        <td>${l.userAgent}</td>
                    </tr>
                `).join("")}

            </table>
        </body>
        </html>
    `);
});

app.listen(8080, () => {
    console.log("RUNNING");
});