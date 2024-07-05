from fastapi import APIRouter, Request, Query #pylint:disable=E0401
from fastapi.staticfiles import StaticFiles #pylint:disable=E0401
from fastapi.templating import Jinja2Templates #pylint:disable=E0401
import os

numbers = {}


async def get_body(request: Request):
    return await request.body()


List_images = [
        'https://iili.io/d36prss.jpg',
        'https://iili.io/d36pUzX.jpg',
        'https://iili.io/d36p6qG.jpg',
        'https://iili.io/d36pP1f.jpg',
        'https://iili.io/d36pQ72.jpg',
        'https://iili.io/d36pgXn.jpg',
        'https://iili.io/d36pLdl.jpg',
        'https://iili.io/d36p8bt.jpg',
        'https://iili.io/d36ptm7.jpg',
        'https://iili.io/d36pig4.jpg',
        'https://iili.io/d36pmXe.jpg',
        'https://iili.io/d36y9qb.jpg',
        'https://iili.io/d36pbI9.jpg',
        'https://iili.io/d36pZeS.jpg',
        'https://iili.io/d3PBjB2.jpg',
    ]
for i in range(30):
    List_images.append('')
List_images.append("/{{sub_path}}/{{flag}}")

def create_router(templates: Jinja2Templates):
    router = APIRouter()
    router.mount("/static_common", StaticFiles(directory="./static"), name="static")
    galerie_template = Jinja2Templates(directory=os.path.join(".","{{sub_path}}","template"))
    @router.get("/{{chall_name}}/view")
    async def recupere_id(request:Request=Request,chall_name: str="{{chall_name}}",galerie=1):
        try:
            galerie=int(galerie)
        except ValueError:
            galerie=""
        if galerie=="" or galerie==0:
            data=List_images
        else:
            data=List_images[galerie+1]
        return galerie_template.TemplateResponse("galerie.html", {"request":request,"data":data})


    return router

router = create_router