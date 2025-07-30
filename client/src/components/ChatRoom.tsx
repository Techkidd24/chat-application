import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface chatUsername {
    username: string;
}

export function ChatRoom({ username }: chatUsername) {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket>(null);
    const navigate = useNavigate();

    const handleSend = () => {
        if (text.trim() !== '' && wsRef.current && isConnected) {
            wsRef.current.send(JSON.stringify({
                type: "chat",
                text: text.trim()
            }));
            setText('');
        }
    }

    useEffect(() => {
        if (!username || username.trim() === '') {
            navigate('/');
            return;
        }

        wsRef.current = new WebSocket("ws://localhost:8080");

        wsRef.current.onopen = () => {
            console.log("Connected to websocket server")
            setIsConnected(true);

            wsRef.current?.send(JSON.stringify({
                username: username,
                type: "join"
            }))
        }
        console.log(isConnected)


        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data)  //json string to js object
            if (message.type === "chat") {
                setMessages(prev => [...prev, `${message.sender} : ${message.text}`]);
            }
        }

        wsRef.current.onclose = () => {
            console.log("disconnected from websocket server");
        }


    }, []);

    return (
        <>
            <div className='h-screen bg-black'>
                <div className='flex flex-col h-full justify-between'>
                    <div className=''>
                        {messages.map((msg, idx) => (
                            <div key={idx} className='bg-white text-black w-max p-2 m-2 rounded-xl'>{msg}</div>
                        ))}
                    </div>
                    <div className='flex justify-between mb-2'>
                        <input type='text' className='w-full mx-2 rounded-xl' value={text} onKeyDown={(e) => e.key === "Enter" && handleSend()} onChange={(e) => setText(e.target.value)}></input>
                        <button className='bg-white w-20 h-8 mr-4 rounded-xl' onClick={handleSend}>Send</button>
                    </div>
                </div>
            </div>
        </>
    )
}