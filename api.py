## create a simple FastAPI app and run it
## run with: uvicorn main:app --reload

from fastapi import Body, Depends, FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import random
import uuid
from datetime import datetime, timedelta
import time
from prometheus_fastapi_instrumentator import Instrumentator
import os

equations = {}
numbers = {}
target_name = os.getenv("TARGET_NAME", 'michelin')
display_name = os.getenv("DISPLAY_NAME", 'Michelin')
user_agent = target_name.lower()

def generate_random_equation():
    # Generate two random operands
    equation = ""
    for i in range(5):
        operand = random.randint(1, 1000)

        # Randomly select an operator
        operator = random.choice(['+', '-', '*'])

        equation += f"{operand} {operator} "
    
    operand = random.randint(1, 1000)
    equation += f"{operand}"

    return equation

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
# Instrumentator().instrument(app).expose(app)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    client_ip = request.client.host
    print(f"Client IP: {client_ip}")  # ou utiliser logger
    response = await call_next(request)
    return response

@app.get("/")
def read_root(request: Request):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    data = {"request": request, "target_name":target_name, "display_name": display_name}
    return templates.TemplateResponse("readme.html", data)

async def get_body(request: Request):
    return await request.body()


@app.post("/challenges/09-s3nd-cheKsuMm.html")
def checksum_date(body: bytes = Depends(get_body)):
    payload = body.decode("utf-8")
    current_timestamp = datetime.utcnow()
    current_timestamp = time.time()
    
    print(payload)
    payload_stripped = payload.split("&")
    data = {}
    print(payload_stripped)
    for item in payload_stripped:
        data[item.split("=")[0]] = item.split("=")[1]

    if "date" not in data:
        return {"message": "You are either missing the `date`. Try again!"}


    sended_timestamp = int( data["date"] )
    if current_timestamp - 1 < sended_timestamp and current_timestamp > sended_timestamp:
        return {"message": "You can go to the next flag, TODO: give next flag"}
    if current_timestamp - 1 > sended_timestamp:
        return {"message": "too slow stay in past"}
    if current_timestamp < sended_timestamp:
        return {"message": "too quick, you are in future !"}

    return {"message": "I have no idea how you arrived there lol, you should not see this \o/"}


@app.put("/challenges/06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html")
def generate_number(request: Request):
    current_timestamp = datetime.now()
    for entry in numbers.copy():
        if current_timestamp - numbers[entry]["timestamp"] > timedelta(seconds=25):
            numbers.pop(entry)

    identifier = str(uuid.uuid4())
    number = random.randint(1, 1000000)
    numbers[identifier] = {
        "number": number,
        "timestamp": datetime.now(),
        "tries": 25,
        "id": identifier
    }
    print("UUID that has to be provided is: " + identifier)
    print("Value that has to be provided is: " + str(number))
    return_value = numbers[identifier].copy()
    del return_value["number"]
    return return_value

@app.post("/challenges/06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html")
def solve_challenge(body: bytes = Depends(get_body)):
    current_timestamp = datetime.now()
    for entry in numbers.copy():
        if current_timestamp - numbers[entry]["timestamp"] > timedelta(seconds=25):
            numbers.pop(entry)

    payload = body.decode("utf-8")
    print(payload)
    payload_stripped = payload.split("&")
    data = {}
    for item in payload_stripped:
        data[item.split("=")[0]] = item.split("=")[1]
    
    if "id" not in data or "number" not in data:
        return {"message": "You are either missing the `id` or the `number` in the payload. Try again!"}

    data["number"] = int(data["number"])

    if data["id"] not in numbers:
        return {"message": "`id` has either expired or never existed. Try again!"}

    if data["id"] in numbers and data["number"] == numbers[data["id"]]["number"]:
        del numbers[data["id"]]
        return {"message": "You did it! You are a master! Here is your flag: 07-Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html"}

    if data["id"] in numbers and data["number"] != numbers[data["id"]]["number"]:
        numbers[data["id"]]["tries"] -= 1
        if numbers[data["id"]]["tries"] == 0:
            del numbers[data["id"]]
            return {"message": "You failed too many times. Try again!", "tries": numbers[data["id"]]["tries"]}
        if data["number"] > numbers[data["id"]]["number"]:
            return {"message": "Too high. Try again!", "tries": numbers[data["id"]]["tries"], "remaining_time": str(25 - (datetime.now() - numbers[data["id"]]["timestamp"]).seconds) + " seconds"}
        if data["number"] < numbers[data["id"]]["number"]:
            return {"message": "Too low. Try again!", "tries": numbers[data["id"]]["tries"], "remaining_time": str(25 - (datetime.now() - numbers[data["id"]]["timestamp"]).seconds) + " seconds"}

    return {"message": "I have no idea how you arrived there lol, you should not see this \o/"}

@app.post("/challenges/03-h3110-y0u-4r3-4w350m3.html")
def resolve_challenge(body: bytes = Depends(get_body)):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    # retrieve the variable result from the request object
    # result = request.get('result')
    # print(request.body())
    current_timestamp = datetime.now()
    for entry in equations.copy():
        if current_timestamp - entry > timedelta(seconds=5):
            equations.pop(entry)

    payload = body.decode("utf-8")
    try:
        result = int(payload.split("=")[1].strip())
        print(payload)
        for entry in equations.copy():
            if result == equations[entry]:
                return {"message": "04-7h3-4n5w3r-15-4-5h4m3.html omgbbq!!!"}
        print(f"No result found for {payload}")
    except Exception as e:
        print(e)
    return {"message": "4r3 y0u 53r10u5?"}

@app.get("/challenges/{challenge}")
def read_root(request: Request, challenge: str):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    try:
        data = {"request": request, "target_name":target_name, "display_name": display_name}
        var = templates.TemplateResponse(challenge, data)
        if challenge == "02-m4r10-n3v3r-d13d.html":
            # add new header to response
            var.headers["X-Flag"] = "03-h3110-y0u-4r3-4w350m3.html"
            var.status_code = 418
        elif challenge == "03-h3110-y0u-4r3-4w350m3.html":
            # generate a math equation with python
            random_equation = generate_random_equation()
            current_timestamp = datetime.now()
            for entry in equations.copy():
                if current_timestamp - entry > timedelta(seconds=5):
                    equations.pop(entry)
            print(random_equation)
            print(eval((random_equation)))
            equations[current_timestamp] = eval((random_equation))
            data['data'] = f"{random_equation} = ???"
            var = templates.TemplateResponse(challenge, data)
        elif challenge == "05-x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html":
            my_header = request.headers.get('user-agent')
            if user_agent in my_header.lower():
                my_header = "06-us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html"
            data["user_agent"] = my_header
            var = templates.TemplateResponse(challenge, data)
        return var
    except Exception as e:
        print(e)
        return templates.TemplateResponse('404.html', {'request': request})


@app.get("/hello/{name}")
def hello_name(name: str):
    return f"Hello {name}"

@app.get("/items/{id}", response_class=HTMLResponse)
async def read_item(request: Request, id: str):
    pass

# @app.get("/hello")
# def hello_name(name: str = "World"):
#     return f"Hello {name}"


@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse('404.html', {'request': request})
