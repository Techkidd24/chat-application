import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (text.trim() !== '') {
      setMessages([...messages, text]);
      setText('');
    }
  }

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
            <input type='text' className='w-full mx-2 rounded-xl' value={text} onChange={(e) => setText(e.target.value)}></input>
            <button className='bg-white w-20 h-8 mr-4 rounded-xl' onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
