import pytest
from fastapi.testclient import TestClient


def test_live_does_not_need_database(client_without_database: TestClient) -> None:
    response = client_without_database.get("/api/v1/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.integration
def test_ready_reports_ok_when_database_reachable(client: TestClient) -> None:
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "checks": {"database": "ok"}}


def test_ready_reports_503_when_database_unreachable(client_without_database: TestClient) -> None:
    response = client_without_database.get("/api/v1/health/ready")

    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "checks": {"database": "error"}}
    assert "nobody" not in response.text  # connection details must never leak


def test_openapi_schema_is_served_under_v1(client_without_database: TestClient) -> None:
    response = client_without_database.get("/api/v1/openapi.json")

    assert response.status_code == 200
    assert "/api/v1/health/ready" in response.json()["paths"]
