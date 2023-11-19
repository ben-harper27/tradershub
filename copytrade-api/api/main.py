import json
import logging
import sys
import requests
from fastapi import FastAPI, Request

from .settings import settings

VERSION = "0.1.0"

logging.basicConfig(stream=sys.stdout, level=settings.log_level)
log = logging.getLogger(__name__)

app = FastAPI(
    title="Copy trade API",
    description="REST API for copytrade",
    version=VERSION,
    docs_url="/hidden/docs",
    redoc_url="/hidden/redoc",
    openapi_url="/hidden/openapi.json"
)


@app.on_event("startup")
def on_startup():
    log.info(f"Starting API service - version: {VERSION}")
    log.info(json.dumps(
        settings.dict(),
        sort_keys=True,
        indent=4,
        separators=(',', ': ')
    ))
    if settings.test_mode:
        log.info("Running in test mode")

@app.get("/", name="Base", include_in_schema=False)
async def root():
    return {"message": "Hello World"}


@app.get("/healthz", include_in_schema=False)
async def healthcheck():
    return {"msg": "ok"}


@app.post("/endpoint")
async def endpoint(request: Request):
    await requests.post("https://api.defender.openzeppelin.com/autotasks/89b4fd9f-eb04-41dd-9a81-25f0aa0e6b45/runs/webhook/4cf24c64-35d2-414e-a80b-5e252c1ca2bd/G3hPgcGdXt2adf3NzJe1K7",
                        {"client": "0x92F44219c346675508fF779eCAeC2f17bdC3BAf5", "tokenIn": "0x6Cb348582A964bDF305C70554383b90490EE61dB",
                         "tokenOut": "0x8e0bDB72bF44C13C6aD007f8E7aC47bafE69faC2", "amountIn": "10000000000"}
    )
    return {"msg": "ok"}
