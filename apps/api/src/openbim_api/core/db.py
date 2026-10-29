"""Database engine and declarative base."""

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base for all ORM models. Alembic autogenerate reads `Base.metadata`."""


def create_db_engine(database_url: str) -> Engine:
    return create_engine(
        database_url,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 5},
    )


def check_database(engine: Engine) -> None:
    """Raise `sqlalchemy.exc.SQLAlchemyError` if the database is not reachable."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
