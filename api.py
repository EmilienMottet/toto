## create a simple FastAPI app and run it
## run with: uvicorn main:app --reload

from fastapi import Body, Depends, FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import random
from datetime import datetime, timedelta

equations = {}

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

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def read_root(request: Request):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    return templates.TemplateResponse("readme.html", {'request': request})

async def get_body(request: Request):
    return await request.body()

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
        data = {"request": request}
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