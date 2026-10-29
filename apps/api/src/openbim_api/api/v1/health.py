"""Liveness and readiness probes."""

import logging
from typing import Literal

from fastapi import APIRouter, Request, Response, status
from pydantic import BaseModel
from sqlalchemy import Engine
from sqlalchemy.exc import SQLAlchemyError

from openbim_api.core.db import check_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=["health"])

CheckStatus = Literal["ok", "error"]


class LiveResponse(BaseModel):
    status: Literal["ok"]


class ReadyResponse(BaseModel):
    status: Literal["ok", "unavailable"]
    checks: dict[str, CheckStatus]


@router.get("/live")
def live() -> LiveResponse:
    """The process is up and serving requests. Does not check dependencies."""
    return LiveResponse(status="ok")


@router.get(
    "/ready",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ReadyResponse}},
)
def ready(request: Request, response: Response) -> ReadyResponse:
    """The API can serve traffic: all required dependencies are reachable."""
    engine: Engine = request.app.state.engine
    database: CheckStatus
    try:
        check_database(engine)
        database = "ok"
    except SQLAlchemyError:
        # Details go to logs only; the response never exposes connection info.
        logger.warning("Readiness check failed: database unreachable", exc_info=True)
        database = "error"

    checks: dict[str, CheckStatus] = {"database": database}
    if all(result == "ok" for result in checks.values()):
        return ReadyResponse(status="ok", checks=checks)
    response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ReadyResponse(status="unavailable", checks=checks)
