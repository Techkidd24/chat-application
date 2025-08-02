import { WebSocketServer, WebSocket, RawData } from "ws";

const wss = new WebSocketServer({ port: 8080 })

interface userInterface extends WebSocket{
    username?: string;
}


//listening for connection events
wss.on("connection", (socket : WebSocket) => {
    const currUser = socket as userInterface;
    console.log("client connected");

    //listening for messages from THIS client
    currUser.on("message", (data: RawData) => {
        const rawMessage = data.toString();
        const message = JSON.parse(rawMessage);

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
                timestamp: new Date().toLocaleTimeString()
            })

            wss.clients.forEach((client: WebSocket) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(outgoingMessage);
                }
            })
        }
    })
})