const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: "*/*" }));

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

// ZAPIS WSZYSTKICH WEJŚĆ (GET + POST)
function addLog(req, message = "") {

    const log = {
        time: new Date().toLocaleString("pl-PL", {
            timeZone: "Europe/Warsaw"
        }),
        ip: getIp(req),
        method: req.method,
        userAgent: req.headers["user-agent"] || "",
        message: message || ""
    };

    logs.unshift(log);

    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }
}

// FORMULARZ + STRONA
app.get("/", (req, res) => {

    addLog(req, "PAGE_OPEN");

    res.send(`
        <html>
        <body>
            <h2>Send message</h2>

            <form method="POST" action="/send">
                <input name="msg" placeholder="message" />
                <button type="submit">Send</button>
            </form>

            <hr/>

            <h2>LAST 100 LOGS</h2>

            <table border="1" cellpadding="5">
                <tr>
                    <th>Time</th>
                    <th>IP</th>
                    <th>Method</th>
                    <th>Message</th>
                    <th>User Agent</th>
                </tr>

                ${logs.map(l => `
                    <tr>
                        <td>${l.time}</td>
                        <td>${l.ip}</td>
                        <td>${l.method}</td>
                        <td><pre>${l.message}</pre></td>
                        <td>${l.userAgent}</td>
                    </tr>
                `).join("")}

            </table>
        </body>
        </html>
    `);
});

// ODBIÓR FORMULARZA
app.post("/send", (req, res) => {

    const msg = req.body.msg || req.body || "";

    addLog(req, msg);

    res.redirect("/");
});

// RAW POST (opcjonalne)
app.post("/log", (req, res) => {

    addLog(req, req.body);

    res.send("OK");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("RUNNING ON", PORT);
});