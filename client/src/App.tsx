import { useEffect, useRef, useState } from 'react'
import { UsernameForm } from './components/UsernameForm'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChatRoom } from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState('');
  const handleJoinChat = (newUsername: string) => {
    setUsername(newUsername);
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<UsernameForm onJoinChat={handleJoinChat} />}
        />
        <Route
          path="/chat"
          element={<ChatRoom username={username} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App