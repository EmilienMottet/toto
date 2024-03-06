## create a simple FastAPI app and run it
## run with: uvicorn main:app --reload

import inspect
from fastapi import Body, Depends, FastAPI, HTTPException, Request, APIRouter
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import random
import uuid
from datetime import datetime, timedelta
import time
from prometheus_fastapi_instrumentator import Instrumentator
import os
from paths_config import PATHS
import importlib
import glob


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static_base")
base_templates = Jinja2Templates(directory="templates")

BUILD_DIR = "./build"

target_name = os.getenv("TARGET_NAME", 'michelin')
display_name = os.getenv("DISPLAY_NAME", 'Michelin')

    
def find_router_modules(directory):
    """Trouver tous les fichiers Python dans le dossier spécifié."""
    module_paths = glob.glob(os.path.join(directory, "*.py"))
    return [os.path.splitext(os.path.basename(path))[0] for path in module_paths]

def load_routers(directory, module_names):
    """Charger dynamiquement les routeurs à partir des noms de modules."""
    routers = []
    for module_name in module_names:
        module = importlib.import_module(f"{directory}.{module_name}")
        if hasattr(module, "router"):
            routers.append(module.router)
    return routers

# Create a router and a Jinja2Templates instance for each path
routers = {}
for path in PATHS.keys():
    # Create the directory path for the templates
    template_dir = os.path.join(BUILD_DIR, path, "template")

    # Create the directory path for the static files
    static_dir = os.path.join(BUILD_DIR, path, "static")

    # Create an APIRouter instance
    router = FastAPI()
    # Mount static files to the router
    router.mount("/static", StaticFiles(directory=static_dir), name="static_" + path)
    
    router_directory = os.path.join(BUILD_DIR, path, "api")
    router_modules = find_router_modules(router_directory)
    api_routers = load_routers(f"build.{ path }.api", router_modules)

    # Create a Jinja2Templates instance
    templates = Jinja2Templates(directory=template_dir)

    for new_router in api_routers:
        router.include_router(new_router(templates))



    # Add the router with templates and static files to the routers dictionary
    routers[path] = {
        "router": router,
        "templates": templates
    }

def create_challenge_route(templates: Jinja2Templates):
    async def challenge(request: Request, challenge: str):
        data = {"request": request}
        return templates.TemplateResponse(challenge, data)
    return challenge

# Add routes to each router
for path, elements in routers.items():   
    router = elements["router"]
    templates = elements["templates"]


    challenge_route = create_challenge_route(templates)
    router.get("/challenges/{challenge}")(challenge_route)
    router.post("/challenges/{challenge}")(challenge_route)

    # Include the router in the main application with a path prefix
    app.mount(f"/{path}",router)



@app.get("/")
def read_root(request: Request):
    data = {"request": request, "target_name":target_name, "display_name": display_name}
    return base_templates.TemplateResponse("readme.html", data)


@app.get("/challenges/{challenge}")
def read_root_chall(request: Request, challenge: str):
    try:
        return base_templates.TemplateResponse(challenge, {"request": request})
    except Exception as e:
        print(e)
        return base_templates.TemplateResponse('404.html', {'request': request})



async def get_body(request: Request):
    return await request.body()



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
    return base_templates.TemplateResponse('404.html', {'request': request})
