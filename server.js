const express = require("express");
const app = express();

app.use(express.json());
app.use(express.text({ type: "*/*" }));

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

// LOG MESSAGE (TO JEST KLUCZ)
app.post("/log", (req, res) => {

    const message =
        typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body);

    const log = {
        time: new Date().toLocaleString("pl-PL", {
            timeZone: "Europe/Warsaw"
        }),
        ip: getIp(req),
        message: message || "(empty)"
    };

    logs.unshift(log);

    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }

    res.send("OK");
});

// VIEW PAGE
app.get("/", (req, res) => {

    res.send(`
        <html>
        <body>
            <h1>LAST 100 LOGS</h1>

            <table border="1" cellpadding="5">
                <tr>
                    <th>Time</th>
                    <th>IP</th>
                    <th>Message</th>
                </tr>

                ${logs.map(l => `
                    <tr>
                        <td>${l.time}</td>
                        <td>${l.ip}</td>
                        <td><pre>${l.message}</pre></td>
                    </tr>
                `).join("")}
            </table>

        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("RUNNING ON", PORT);
});