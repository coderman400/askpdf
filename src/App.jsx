
import './App.css'
import Chat from './components/Chat'
import Navbar from './components/Navbar'
import { useState } from 'react'
function App() {
  const [pdf, setPdf] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [Id, setId] = useState(null)
  return (
    <>
      <Navbar pdf={pdf} setPdf={setPdf} setId={setId} />
      <Chat prompt={prompt} setPrompt={setPrompt} Id={Id} />
    </>
  )
}

export default App
