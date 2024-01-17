from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/{{chall_name}}")
    async def route_header_flag(request: Request):
        data = {"request": request}
        var = templates.TemplateResponse("{{chall_name}}", data)
        var.headers["X-Flag"] = "{{flag}}"
        var.status_code = 418
        return var

    return router

router = create_router
