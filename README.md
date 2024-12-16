# AskPDF
Fullstack application to upload PDFs and ask questions to it in a friendly and interactive chat interface.
Can easily summarise, find specific details, prompt further information with the PDF's content as a reference.
Uses NLP and message history storage, prompting human-like conversation with seamless follow-ups.

**DEMO VIDEO** : https://youtu.be/4MrXvOyYTzk

## Technology Used
- **React.js + Vite** : Frontend framework for interface
- **Tailwind CSS** : CSS framework for easier and efficient styling
- **FastAPI**: Backend framework for handling APIs
- **LangChain**: Integrating Gemini API with backend
- **Database**: SQLite
- **ORM**: SQLAlchemy

## Deployment
- **Vercel** : Frontend at https://askpdf-eight.vercel.app/
- **Render** : Backend at https://askpdf-nf1g.onrender.com

## Installation

### Frontend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/coderman400/askpdf/
   cd askpdf

2. **Install dependencies:**
Make sure you have Node.js installed. Then, run:
  
  ```bash
  npm install
```
Run the development server:

3. **Start the Vite development server:**

```bash
    npm run dev
```
The frontend should now be running at http://localhost:3000.

4. **Backend Setup**
Navigate to the backend directory:
```bash
cd askpdf/backend
```

**Create a virtual environment (recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```
5. **Install dependencies:**
Ensure you're in the backend folder
```bash
pip install -r requirements.txt
```

Also ensure the GOOGLE_API_KEY is set up in your environment if you're running it locally.

6. **Run the FastAPI server:**

Start the FastAPI server with Uvicorn:
```bash
    uvicorn main:app --reload
```
The backend should now be running 

## Usage
- Open your browser and navigate to the frontend URL: http://localhost:3000.
- Use the upload functionality to submit PDF files.
- Engage in chat interactions regarding your pdf

## API Documentation

This FastAPI application provides endpoints for uploading PDF files, asking questions based on the content of the uploaded PDFs, and retrieving conversation history.

### Base URL
http://127.0.0.1:8000


### CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins, methods, and headers.

### Endpoints

#### 1. Upload PDF

- **Endpoint**: `POST /upload`
- **Description**: Uploads a PDF file and extracts its text content.
- **Request Body**: 
  - `file` (multipart/form-data): The PDF file to upload.

- **Responses**:
  - **200 OK**: Returns the ID of the conversation.
    ```json
    {
      "conversation_id": 1
    }
    ```
  - **400 Bad Request**: If no file is received.
    ```json
    {
      "detail": "File not received"
    }
    ```

#### 2. Ask a Question

- **Endpoint**: `POST /ask`
- **Description**: Submits a prompt to the LLM (Large Language Model) using the context from the uploaded PDF and retrieves a response.
- **Request Body**: 
  - `prompt` (form data): The question to ask.
  - `conversation_id` (form data): The ID of the conversation to reference.

- **Responses**:
  - **200 OK**: Returns the response from the LLM.
    ```json
    {
      "result": "The answer to your question."
    }
    ```
  - **404 Not Found**: If the specified conversation ID does not exist.
    ```json
    {
      "detail": "Conversation not found"
    }
    ```

#### 3. Get Conversation History

- **Endpoint**: `GET /history/{conversation_id}`
- **Description**: Retrieves the message history for a given conversation ID.
- **Path Parameters**:
  - `conversation_id`: The ID of the conversation.

- **Responses**:
  - **200 OK**: Returns a list of messages in the conversation.
    ```json
    [
      {
        "role": "user",
        "content": "What is the main idea of the document?"
      },
      {
        "role": "assistant",
        "content": "The main idea is..."
      }
    ]
    ```

### Error Handling

The API returns standard HTTP error responses with detailed messages.


