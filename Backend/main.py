from fastapi import FastAPI, UploadFile, File, HTTPException, status, WebSocket
import auth, websocket, voicewebsoc
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
import json
import subprocess
app = FastAPI()
app.include_router(auth.router)
app.include_router(voicewebsoc.router)
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

# @app.post("/voice")
# async def voice(file : UploadFile = File()):
#     print(file.content_type)
#     if file.content_type == "audio/ogg":
#         suffix = ".ogg"
#     elif file.content_type =="audio/webm":
#         suffix = ".webm"
#     else:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Noob effort of sending wrong data")
#     try:
#         with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_input:
#             try:
#                 temp_input.write(await file.read())
#                 temp_input.flush()
#                 output_tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
#                 output_tmp.close()
#                 voice_convert = subprocess.run(
#                     [
#                         'ffmpeg',
#                         '-y',
#                         '-i', temp_input.name,
#                         '-af', "asetrate=55000,atempo=0.85,afftfilt=real='hypot(re,im)*sin(65)',tremolo=f=50,adynamicsmooth=sensitivity=2.5:basefreq=10000",
#                         output_tmp.name
#                     ],
#                     stdout=subprocess.PIPE,
#                     stderr=subprocess.PIPE
#                 )
#                 if voice_convert.returncode != 0:
#                     raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=[{"msg" : "Error occured while processing."}])
#                 with open(output_tmp.name, "rb") as return_file:
#                     data = BytesIO(return_file.read())
#                     return StreamingResponse(data, media_type="audio/webm")
#             except Exception as e:
#                 print(e)
#                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=[{"msg" : "Error occured while processing the file"}])
#     except:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=[{"msg" : "Error occured in server. Try Later"}])
#     finally:
#         os.remove(output_tmp.name)
#         os.unlink(temp_input.name)

@app.get("/")
def root():
    return {"msg" : "Hi vro"}

if __name__=="__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)