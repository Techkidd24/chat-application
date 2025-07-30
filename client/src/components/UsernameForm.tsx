import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UsernameForm() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    interface usernameFormProps {
        onJoinChat: (username: string) => void
    }

    const joinFunction = ({ onJoinChat }: usernameFormProps) => {
        if (username.trim().length < 2) {
            setError("Username must be at least 2 characters");
            return;
        }

        if (username.trim().length > 20) {
            setError("Username must be less than 20 characters");
            return;
        }

        onJoinChat(username.trim());
        navigate('/');
    }

    return (
        <>
            <div className="h-screen bg-black ">
                <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="text-white">Enter your username</div>
                        <div><input className="p-2" value={username} onChange={(e) => { setUsername(e.target.value) }} type="text" placeholder="Enter username..."></input></div>
                        <div><button className="bg-white rounded-sm p-2">Join</button></div>
                    </div>
                </div>
            </div>
        </>
    )
}