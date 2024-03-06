from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from datetime import datetime, timedelta
import random

equations = {}

async def get_body(request: Request):
    return await request.body()


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


def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.get("/challenges/3_h3110-y0u-4r3-4w350m3.html")
    async def route_equation_flag(request: Request):
        data = {"request": request}
        random_equation = generate_random_equation()
        current_timestamp = datetime.now()
        for entry in equations.copy():
            if current_timestamp - entry > timedelta(seconds=5):
                equations.pop(entry)
        print(random_equation)
        print(eval((random_equation)))
        equations[current_timestamp] = eval((random_equation))
        data['data'] = f"{random_equation} = ???"
        var = templates.TemplateResponse("3_h3110-y0u-4r3-4w350m3.html", data)
        return var

    @router.post("/challenges/3_h3110-y0u-4r3-4w350m3.html")
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
                    return {"message": "4_x0r-15-n0t-m1l1t4ry-gr4d3-3ncrypt10n.html omgbbq!!!"}
            print(f"No result found for {payload}")
        except Exception as e:
            print(e)
        return {"message": "4r3 y0u 53r10u5?"}



    return router

router = create_router
