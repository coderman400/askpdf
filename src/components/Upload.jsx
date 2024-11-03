import React from 'react'
import { useState } from 'react'
const apiAddress = 'http://127.0.0.1:8000'
const Upload = () => {
    const [pdf, setPdf] = useState(null)
    const [prompt, setPrompt] = useState('')
    const [text, setText] = useState('')
    const setFile = (e)=>{
        setPdf(e.target.files[0])
    }
    const changePrompt = (e)=> {
        setPrompt(e.target.value)
    }
    const handleUpload = async ()=> {
        try{
            const form = new FormData()
            if(pdf){
                form.append('file', pdf)
            }
            const response = await fetch(`${apiAddress}/upload`, {
                method:'POST',
                body:form
            })
            if(response.ok){
                const data = await response.json()
                console.log(data.text_content)
                setText(data.text_content)
            }
        }catch(error){
            console.log(error)
        }
    }
    const handleAsk = async()=> {
        try{
            const form = new FormData()
            if(prompt){
                form.append('prompt', prompt)
                form.append('text', text )
                const response = await fetch(`${apiAddress}/ask`, {
                    method:'POST',
                    body:form
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data.result)
                }
            }else{
                alert("PROMPT CANNOT BE EMPTY")
            }
        }catch(error){
            console.log(error)
        }
    }
    const handleRetrieve = async()=> {
        try{
            const response = await fetch(`${apiAddress}/uploads`,{
                method:'GET'
            })
            if(response.ok){
                let data = await response.json()
                console.log(data)
            }
        }catch(e){
            console.log(e)
        }
    }
    const handleNuke = async()=>{
        try{
            const response = await fetch(`${apiAddress}/nuke`,{
                method:'GET'
            })
            if(response.ok){
                console.log('success')
            }
        }catch(e){
            console.log(e)
        }
    }


  return (
    <>
        <div className='font-bold text-5xl m-4'>Upload</div>
        <input type='file' onChange={setFile}></input>
        <button type='submit' onClick={handleUpload}>SUBMIT</button>
        <input type='text' className='border-2 border-black m-4' onChange={changePrompt}></input>
        <button type='submit' onClick={handleAsk}>ASK</button>
        <button className='m-4' onClick={handleRetrieve}>Retrieve</button>
        <button className='m-4' onClick={handleNuke}>Nuke</button>
    </>

  )
}

export default Upload