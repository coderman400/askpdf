import React from 'react'
import { useState } from 'react'
const apiAddress = 'http://127.0.0.1:8000/upload'
const Upload = () => {
    const [pdf, setPdf] = useState(null)
    const setFile = (e)=>{
        setPdf(e.target.files[0])
    }
    const handleUpload = async ()=> {
        try{
            const form = new FormData()
            if(pdf){
                form.append('file', pdf)
            }
            const response = await fetch(`${apiAddress}`, {
                method:'POST',
                body:form
            })
            if(response.ok){
                const data = await response.json()
                console.log(data.filename)
            }
        }catch(error){
            console.log(error)
        }
    }

  return (
    <>
        <div className='font-bold text-5xl m-4'>Upload</div>
        <input type='file' onChange={setFile}></input>
        <button type='submit' onClick={handleUpload}>SUBMIT</button>
    </>

  )
}

export default Upload