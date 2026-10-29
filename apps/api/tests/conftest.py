import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from openbim_api.core.config import Settings
from openbim_api.main import create_app

# Integration tests run against a real PostgreSQL database. Locally: the `openbim_test`
# database (see README). In CI: a PostgreSQL service container.
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")

# A URL that can never connect: nothing listens on port 1.
UNREACHABLE_DATABASE_URL = "postgresql+psycopg://nobody:nothing@127.0.0.1:1/none"


def make_settings(database_url: str) -> Settings:
    return Settings(app_env="test", database_url=database_url, _env_file=None)


@pytest.fixture
def client() -> Iterator[TestClient]:
    if TEST_DATABASE_URL is None:
        pytest.skip("TEST_DATABASE_URL is not set")
    with TestClient(create_app(make_settings(TEST_DATABASE_URL))) as test_client:
        yield test_client


@pytest.fixture
def client_without_database() -> Iterator[TestClient]:
    with TestClient(create_app(make_settings(UNREACHABLE_DATABASE_URL))) as test_client:
        yield test_client
