import pytest

from openbim_api.core.config import Settings


def test_cors_origins_accept_comma_separated_string(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("API_CORS_ORIGINS", " http://localhost:3000 , https://app.example.com,")

    settings = Settings(database_url="postgresql+psycopg://u:p@localhost/db", _env_file=None)

    assert settings.api_cors_origins == ["http://localhost:3000", "https://app.example.com"]


def test_environment_variables_are_read(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://env:env@db/envdb")
    monkeypatch.setenv("APP_ENV", "production")

    settings = Settings(_env_file=None)

    assert settings.database_url == "postgresql+psycopg://env:env@db/envdb"
    assert settings.app_env == "production"


def test_database_url_is_required(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATABASE_URL", raising=False)

    with pytest.raises(ValueError, match="database_url"):
        Settings(_env_file=None)
