import React, { useState } from 'react';
import ai_planet_img from '../assets/ai_planet.png';
import { FaPaperPlane } from 'react-icons/fa';
import user_img from '../assets/user_img.png';

const apiAddress = 'http://127.0.0.1:8000';

const Upload = ({ prompt, setPrompt, Id }) => {
    const [messages, setMessages] = useState([]); 

    const changePrompt = (e) => {
        setPrompt(e.target.value);
    };

    const handleAsk = async () => {
        try {
            if (prompt) {
                setMessages([...messages, { type: 'prompt', content: prompt }]);

                const form = new FormData();
                form.append('prompt', prompt);
                form.append('conversation_id', Id);
                const response = await fetch(`${apiAddress}/ask`, {
                    method: 'POST',
                    body: form
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { type: 'response', content: data.result }
                    ]);
                    setPrompt(''); 
                }
            } else {
                alert("PROMPT CANNOT BE EMPTY");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex align-center justify-center h-screen w-full'>
            <div className='w-4/5 mt-10 overflow-y-auto rounded-2xl h-3/4 relative flex flex-col justify-left'>
                {messages.map((msg, index) => (
                    <div key={index} className={`mx-6 my-4 text-left`}>
                        <p className='inline-flex items-center'>
                            {msg.type === 'prompt' && <img src={user_img} className='h-10 w-10 ml-4' alt="User Avatar" />}
                            {msg.type === 'response' && <img src={ai_planet_img} className='h-10 w-10 mr-4' alt="AI Avatar" />}
                            <span className={`p-3 rounded-lg ${msg.type === 'prompt' ? 'bg-gray-100' : 'bg-gray-200'}`}>
                                {msg.content}
                            </span>
                            
                        </p>
                    </div>
                ))}
            </div>
            <div className='fixed bottom-16 w-4/6 flex items-center p-1 rounded-md drop-shadow-lg bg-white'>
                <input
                    type='text'
                    className='flex-grow p-4 rounded-l-md border-0 focus:outline-none'
                    placeholder='Send a message..'
                    value={prompt}
                    onChange={changePrompt}
                />
                <button onClick={handleAsk} className='p-4 bg-white text-white rounded-r-md hover:bg-gray-300 duration-200'>
                    <FaPaperPlane color='gray' size={20} />
                </button>
            </div>
        </div>
    );
};

export default Upload;
