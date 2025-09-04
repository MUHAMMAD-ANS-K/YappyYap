from fastapi import FastAPI, UploadFile, File, HTTPException, status
import auth, websocket
import os
import tempfile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
import subprocess
app = FastAPI()
app.include_router(auth.router)
app.include_router(websocket.router)

origins = [
    "https://muhammadans.com",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/voice")
async def voice(file : UploadFile = File()):
    try:
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_input:
            temp_input.write(await file.read())
            temp_input.flush()
            output_tmp = tempfile.NamedTemporaryFile( suffix=".webm", delete=False)
            output_tmp.close()
            voice_convert = subprocess.run(
                [
                    'ffmpeg',
                    '-y',
                    '-i', temp_input.name,
                    '-af', "asetrate=65000,atempo=0.8,afftfilt=real='hypot(re,im)*sin(45)',tremolo=f=50",
                    output_tmp.name
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            return StreamingResponse(open(output_tmp.name, "rb"), media_type="audio/webm")
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=[{""}])
        # output, error = voice_convert.communicate()
    # print(file.content_type)
    # temp = await file.read()
    # print(temp[:20])
    # voice_convert.stdin.write(await file.read())
    # voice_convert.stdin.close()
    # voice_convert.wait()
    # if voice_convert.returncode != 0:
    #     print("Lost")
    #     raise RuntimeError("Ffmpeg failed")
    # print(error)

@app.get("/")
def root():
    return {"msg" : "Hi vro"}

if __name__=="__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)