from fastapi import FastAPI, File, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import fitz
from langchain_google_genai import ChatGoogleGenerativeAI
from models.models import FileUpload, SessionLocal

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,  
    timeout=None,
    max_retries=2,
)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.post("/upload")
async def receive_file(file: UploadFile, db: Session = Depends(get_db)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    document = fitz.open(file_path)
    text_content = ""
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text_content += page.get_text()
    document.close()

    new_upload = FileUpload(filename=file.filename)
    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)

    return {"text_content": text_content}  

@app.post("/ask")
async def answer_question(prompt: str = Form(...), text: str = Form(...)):
    messages = [
        ("system", "You are a helpful assistant happy to answer questions"),
        ("human", prompt),
        ("assistant", text)
    ]
    
    # Invoke the model with the question and context
    ai_msg = llm.invoke(messages)
    return {"result": ai_msg.content}
