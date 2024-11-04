import React from 'react'
import { useState } from 'react'
import ai_planet_img from '../assets/ai_planet.png'
import {FaPaperPlane} from 'react-icons/fa'
import user_img from '../assets/user_img.png'

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
        {/* <div className='font-bold text-5xl m-4'>Upload</div>
        <input type='file' onChange={setFile}></input>
        <button type='submit' onClick={handleUpload}>SUBMIT</button>
        <input type='text' className='border-2 border-black m-4' onChange={changePrompt}></input>
        <button type='submit' onClick={handleAsk}>ASK</button>
        <button className='m-4' onClick={handleRetrieve}>Retrieve</button>
        <button className='m-4' onClick={handleNuke}>Nuke</button> */}

        <div className='flex align-center justify-center h-screen w-full'>
            <div className='w-4/5 mt-10 overflow-y-auto rounded-2xl h-3/4 relative flex flex-col justify-left '>
                <div className='mx-6 my-4'>
                    <p className='inline-flex items-center'> <img src={ai_planet_img} className='h-14 w-14 mr-5'/>MEOWMEOWMEOWMOEW</p>
                </div>
                <div className='mx-6 my-4'>
                    <p className='inline-flex items-center'><img src={user_img} className='h-12 w-12 mr-7'/> MEOWMEOWMEOWMOEW</p>
                </div>
            </div>
            <div className='fixed bottom-16 w-4/6 flex items-center p-1 rounded-md drop-shadow-lg bg-white'>
                    <input
                        type='text'
                        className='flex-grow p-4 rounded-l-md border-0 focus:outline-none'
                        placeholder='Send a message..'
                    />
                    <button className='p-4 bg-white text-white rounded-r-md hover:bg-gray-300 duration-200'>
                        <FaPaperPlane color='gray' size={20}/>
                    </button>
                </div>

        </div>
    </>

  )
}

export default Upload