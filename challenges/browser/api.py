from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/{{chall_name}}")
    async def route_header_flag(request: Request):
        data = {"request": request}
        my_header = request.headers.get('user-agent')
        if "{{target_name}}".lower() in my_header.lower():
            my_header = "/{{sub_path}}/{{flag}}"
        data["user_agent"] = my_header
        var = templates.TemplateResponse("{{chall_name}}", data)
        return var

    return router

router = create_router
