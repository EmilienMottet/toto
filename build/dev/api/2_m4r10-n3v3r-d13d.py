from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/2_m4r10-n3v3r-d13d.html")
    async def route_header_flag(request: Request):
        data = {"request": request}
        var = templates.TemplateResponse("2_m4r10-n3v3r-d13d.html", data)
        var.headers["X-Flag"] = "3_h3110-y0u-4r3-4w350m3.html"
        var.status_code = 418
        return var

    return router

router = create_router