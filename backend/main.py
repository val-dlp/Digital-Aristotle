from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import uvicorn

client = OpenAI()

# Initialize FastAPI app
app = FastAPI(title="My FastAPI App")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL (adjust as needed)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Create data model for request body
class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

class Chat(BaseModel):
    system_prompt: str
    user_message: str

# POST endpoint
@app.post("/items/")
async def create_item(item: Item):
    try:
        # Here you would typically process the item or save to a database
        # For this example, we'll just return the item with a calculated total
        
        total = item.price
        if item.tax:
            total += item.tax
            
        return {
            "status": "successful",
            "message": f"Item '{item.name}' created successfully",
            "item": item.dict(),
            "total_price": total
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/")
async def GPT(chat: Chat):
    """
    Standard GPT function with model flexibility.
    """
    model="gpt-4o-mini"
    completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": chat.system_prompt},
                    {"role": "user", "content": chat.user_message},
                ],
            )
    
    event = completion.choices[0].message.content
    return event

# Basic GET endpoint for testing
@app.get("/")
async def root():
    return {"message": "Hello World! FastAPI is running."}

# Run the app
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)