import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 })

interface userInterface extends WebSocket{
    username?: string;
}


//listening for connection events
wss.on("connection", (currUser: userInterface) => {
    console.log("client connected");

    //listening for messages from THIS client
    currUser.on("message", (data) => {
        const rawMessage = data.toString();
        const message = JSON.parse(rawMessage)

        if (message.type === "join") {
            //set the username for this client
            currUser.username = message.username;
            console.log(`${message.username} joined the chat.`)
            return;
        }

        if (message.type === "chat") {
            const outgoingMessage = JSON.stringify({
                type: "chat",
                sender: currUser.username,
                text: message.text,
                timestamp: Date.now()
            })

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(outgoingMessage);
                }
            })
        }
    })
})