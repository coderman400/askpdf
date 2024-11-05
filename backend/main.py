from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models.models import FileUpload, Conversation, Message, SessionLocal
from langchain_google_genai import ChatGoogleGenerativeAI
import fitz

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",
    temperature=0,
    max_tokens=None,  
    timeout=None,
    max_retries=5,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload")
async def receive_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="File not received")
    # Save file temporarily
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text from PDF
    document = fitz.open(file_path)
    text_content = "".join(page.get_text() for page in document)
    document.close()

    # Save file metadata and conversation with text content to database
    new_file = FileUpload(filename=file.filename)
    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    conversation = Conversation(file_id=new_file.id, text_content=text_content)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return {"conversation_id": conversation.id}  # Only return conversation_id

@app.post("/ask")
async def answer_question(
    prompt: str = Form(...),
    conversation_id: int = Form(...),
    db: Session = Depends(get_db)
):
    # Retrieve conversation and ensure it exists
    conversation = db.query(Conversation).filter_by(id=conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Build message history with text_content and previous messages
    messages = [
        ("system", "Respond to the human with the PDF content as context."),
        ("assistant", conversation.text_content)  # PDF content as initial context
    ]
    for message in conversation.messages:
        role = "human" if message.role == "user" else "assistant"
        messages.append((role, message.content))
    messages.append(("human", prompt))

    # Invoke LLM with the full conversation history
    ai_response = llm.invoke(messages)
    
    # Save prompt and response to the conversation history
    user_message = Message(conversation_id=conversation_id, role="user", content=prompt)
    assistant_message = Message(conversation_id=conversation_id, role="assistant", content=ai_response.content)
    db.add_all([user_message, assistant_message])
    db.commit()

    return {"result": ai_response.content}

@app.get("/history/{conversation_id}")
async def get_conversation_history(conversation_id: int, db: Session = Depends(get_db)):
    # Retrieve conversation messages for a given conversation ID
    messages = db.query(Message).filter_by(conversation_id=conversation_id).all()
    return [{"role": msg.role, "content": msg.content} for msg in messages]
