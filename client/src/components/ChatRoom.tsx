import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface chatUsername {
    username: string;
}

interface chatMessage {
    type: string;
    sender?: string;
    text: string;
    timestamp?: number;
}

export function ChatRoom({ username }: chatUsername) {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<chatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket>(null);
    const scrollToEnd = useRef<HTMLDivElement | null>(null);

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
        if (scrollToEnd.current) {
            scrollToEnd.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

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


        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data)  //json string to js object
            if (message.type === "chat") {
                setMessages(prev => [...prev, message]);
            }
        }

        wsRef.current.onclose = () => {
            console.log("disconnected from websocket server");
        }


    }, []);

    return (
        <>
            <div className=' flex flex-col h-screen bg-black'>
                <div className='flex-1 overflow-y-auto'>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`m-4 flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-xl w-max max-w-xs break-words 
                                ${msg.sender === username ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                                <div className="text-xs mb-1 text-gray-300">
                                    <strong>{msg.sender}</strong> at{' '}
                                    {msg.timestamp}
                                </div>
                                <div>{msg.text}</div>
                            </div>
                            <div ref={scrollToEnd} />
                        </div>

                    ))}
                </div>
                <div className='flex justify-between mb-2'>
                    <input type='text' className='w-full mx-2 rounded-xl' value={text} onKeyDown={(e) => e.key === "Enter" && handleSend()} onChange={(e) => setText(e.target.value)}></input>
                    <button className='bg-white w-20 h-8 mr-4 rounded-xl' onClick={handleSend}>Send</button>
                </div>
            </div>

        </>
    )
}