const express = require("express");
const app = express();

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

app.get("/", (req, res) => {

    const log = {
        timeUTC: new Date().toISOString(),
        ip: getIp(req),
        userAgent: req.headers["user-agent"]
    };

    logs.unshift(log);

    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }

    res.send(`
        <html>
        <body>
            <h1>LAST 100 VISITS (UTC)</h1>

            <table border="1" cellpadding="5">
                <tr>
                    <th>UTC Time</th>
                    <th>IP</th>
                    <th>User Agent</th>
                </tr>

                ${logs.map(l => `
                    <tr>
                        <td>${l.timeUTC}</td>
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