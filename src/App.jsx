
import './App.css'
import Upload from './components/Upload'
import Navbar from './components/Navbar'
import { useState } from 'react'
function App() {
  const [pdf, setPdf] = useState(null)
  const [text, setText] = useState()
  const [prompt, setPrompt] = useState('')
  return (
    <>
      <Navbar pdf={pdf} setPdf={setPdf} setText={setText} />
      <Upload text={text} prompt={prompt} setPrompt={setPrompt} />
    </>
  )
}

export default App
