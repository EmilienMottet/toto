from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/2_m4r10-n3v3r-d13d.html")
    async def route_header_flag(request: Request):
        data = {"request": request}
        var = templates.TemplateResponse("2_m4r10-n3v3r-d13d.html", data)
        var.headers["X-Flag"] = "3_Y0u-c4n-b3-pr0ud-0f-y0ur53lf.html"
        var.status_code = 418
        return var

    return router

router = create_router