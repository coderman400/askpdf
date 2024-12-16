import React, { useState , useEffect } from 'react';
const apiAddress = 'https://askpdf-nf1g.onrender.com'

const Navbar = ({setPdf, setId}) => {
  const [fileName, setFileName] = useState('')
  const [isMobile, setIsMobile] = useState(false);

  //check if the size of window is mobile size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //if file is uploaded then send it to backend
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setPdf(event.target.files[0]);
      handleUpload(event.target.files[0])
    }
  };

  //send file to backend
  const handleUpload = async (pdf)=> {
    try{
        const form = new FormData()
        if(pdf){
            form.append('file', pdf)
            setFileName('Loading...')
            //send pdf via POST
            const response = await fetch(`${apiAddress}/upload`, {
              method:'POST',
              body:form
          })
          //update conversation ID in App and set filename.
          if(response.ok){
              const data = await response.json()
              console.log(data.text_content)
              setId(data.conversation_id)
              setFileName(pdf.name)
          }
        }else{
          console.log("NO PDF")
        }
        
    }catch(error){
        console.log(error)
    }
}

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="text-2xl font-bold">
        AskPDF
      </div>
      <div className='flex flex-row justify-between gap-4'>
        <div>
            <label className={`cursor-pointer  font-bold text-green-400 px-4 py-2 ${{fileName}? `inline` :  `hidden`}`}>
                {fileName}
            </label>
        </div>
        <div >
          {/* SHOW + IF MOBILE ELSE SHOW UPLOAD */}
            <label className="cursor-pointer border-2 border-black font-bold bg-white text-black px-4 py-2 rounded hover:bg-gray-200 duration-200 ">
                {isMobile ? '+': 'Upload'}
            <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />
            </label>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
