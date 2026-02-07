from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from typing import AsyncGenerator

from sqlalchemy.engine.url import make_url

url = make_url(str(settings.DATABASE_URL))
if "sslmode" in url.query:
    # Create a new query dictionary excluding sslmode
    new_query = {k: v for k, v in url.query.items() if k != "sslmode"}
    url = url._replace(query=new_query)

engine = create_async_engine(
    url,
    echo=True,
    connect_args={"ssl": "require"}, 
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
