const express = require("express");
const app = express();

let logs = [];

function getIp(req) {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
}

function getClientDetails(req) {
    return {
        // Render zawsze przekazuje prawdziwe IP w 'true-client-ip' lub na początku listy 'x-forwarded-for'
        ip: req.headers["true-client-ip"] || req.headers["x-forwarded-for"]?.split(',')[0].trim() || req.socket.remoteAddress,
        // Pobieramy port z nagłówka 'x-forwarded-port' zamiast z socketu
        port: req.headers["x-forwarded-port"] || "unknown"
    };
}

app.get("/", (req, res) => {

    const client = getClientDetails(req);

    const log = {
        // Zmieniłem nazwę z timeUTC na timeWarsaw, ponieważ podajesz strefę Europe/Warsaw
        timeWarsaw: new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }),
        ip: client.ip,
        port: client.port,
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
                    <th>Port</th>
                    <th>User Agent</th>
                </tr>

                ${logs.map(l => `
                    <tr>
                        <td>${l.timeWarsaw}</td>
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
    console.log("RUNNING");
});