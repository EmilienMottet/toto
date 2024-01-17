from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/1_m4r10-n3v3r-d13d.html")
    async def route_header_flag(request: Request):
        data = {"request": request}
        var = templates.TemplateResponse("1_m4r10-n3v3r-d13d.html", data)
        var.headers["X-Flag"] = "2_x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html"
        var.status_code = 418
        return var

    return router

router = create_router