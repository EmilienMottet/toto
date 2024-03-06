from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/4_x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html")
    async def route_header_flag(request: Request):
        data = {"request": request}
        my_header = request.headers.get('user-agent')
        if "michelin" in my_header.lower():
            my_header = "5_us3r-4g3n7-15-4n-1n73rn4710n4l-574nd4rd.html"
        else:
            my_header = "michelin"
        data["user_agent"] = my_header
        var = templates.TemplateResponse("4_x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html", data)
        return var

    return router

router = create_router