from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from datetime import datetime, timedelta
import random
import uuid

numbers = {}


async def get_body(request: Request):
    return await request.body()



def create_router(templates: Jinja2Templates):
    router = APIRouter()
    @router.put("/{{chall_name}}")
    def generate_number(request: Request):
        current_timestamp = datetime.now()
        for entry in numbers.copy():
            if current_timestamp - numbers[entry]["timestamp"] > timedelta(seconds=25):
                numbers.pop(entry)

        identifier = str(uuid.uuid4())
        number = random.randint(1, 1000000)
        numbers[identifier] = {
            "number": number,
            "timestamp": datetime.now(),
            "tries": 25,
            "id": identifier
        }
        print("UUID that has to be provided is: " + identifier)
        print("Value that has to be provided is: " + str(number))
        return_value = numbers[identifier].copy()
        del return_value["number"]
        return return_value


    @router.post("/{{chall_name}}")
    def solve_challenge(body: bytes = Depends(get_body)):
        current_timestamp = datetime.now()
        for entry in numbers.copy():
            if current_timestamp - numbers[entry]["timestamp"] > timedelta(seconds=25):
                numbers.pop(entry)

        payload = body.decode("utf-8")
        print(payload)
        payload_stripped = payload.split("&")
        data = {}
        for item in payload_stripped:
            data[item.split("=")[0]] = item.split("=")[1]

        if "id" not in data or "number" not in data:
            return {"message": "You are either missing the `id` or the `number` in the payload. Try again!"}

        data["number"] = int(data["number"])

        if data["id"] not in numbers:
            return {"message": "`id` has either expired or never existed. Try again!"}

        if data["id"] in numbers and data["number"] == numbers[data["id"]]["number"]:
            del numbers[data["id"]]
            return {"message": "You did it! You are a master! Here is your flag: {{sub_path}}/{{flag}}"}

        if data["id"] in numbers and data["number"] != numbers[data["id"]]["number"]:
            numbers[data["id"]]["tries"] -= 1
            if numbers[data["id"]]["tries"] == 0:
                del numbers[data["id"]]
                return {"message": "You failed too many times. Try again!", "tries": numbers[data["id"]]["tries"]}
            if data["number"] > numbers[data["id"]]["number"]:
                return {"message": "Too high. Try again!", "tries": numbers[data["id"]]["tries"], "remaining_time": str(25 - (datetime.now() - numbers[data["id"]]["timestamp"]).seconds) + " seconds"}
            if data["number"] < numbers[data["id"]]["number"]:
                return {"message": "Too low. Try again!", "tries": numbers[data["id"]]["tries"], "remaining_time": str(25 - (datetime.now() - numbers[data["id"]]["timestamp"]).seconds) + " seconds"}

        return {"message": "I have no idea how you arrived there lol, you should not see this ¯_(ツ)_/¯"}

    return router

router = create_router

