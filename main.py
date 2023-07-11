## create a simple FastAPI app and run it
## run with: uvicorn main:app --reload

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def read_root(request: Request):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    return templates.TemplateResponse("readme.html", {'request': request})

@app.get("/challenges/{challenge}")
def read_root(request: Request, challenge: str):
    # return templates.TemplateResponse("readme.html", {"request": request, "id": id})
    # return the template response where the template is from the user parameter
    try:
        var = templates.TemplateResponse(challenge, {'request': request})
        if challenge == "02-m4r10-n3v3r-d13d.html":
            # add new header to response
            var.headers["X-Flag"] = "03-h3110-y0u-4r3-4w350m3.html"
            var.status_code = 418
        return var
    except Exception as e:
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