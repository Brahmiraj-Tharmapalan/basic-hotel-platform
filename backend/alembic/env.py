import asyncio
from logging.config import fileConfig
import sys
import os

# Add backend directory to path so we can import app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from app.core.config import settings
from app.models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = str(settings.DATABASE_URL)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    from sqlalchemy.engine.url import make_url

    # Clean the URL for asyncpg
    url_obj = make_url(str(settings.DATABASE_URL))
    if "sslmode" in url_obj.query:
        new_query = {k: v for k, v in url_obj.query.items() if k != "sslmode"}
        url_obj = url_obj._replace(query=new_query)

    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = url_obj.render_as_string(hide_password=False)
    # Pass SSL context explicitly if needed, or rely on connect_args in config?
    # For asyncpg, usually we need to pass connect_args via async_engine_from_config
    # But async_engine_from_config reads from dict. We can add 'sqlalchemy.connect_args' key? 
    # Actually, it's easier to just pass connect_args to async_engine_from_config if possible, 
    # but the signature doesn't take it directly as a dict in the same way.
    # Alternative: construct engine manually like in session.py instead of using async_engine_from_config
    
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args={"ssl": "require"}, # Explicitly pass SSL require
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
