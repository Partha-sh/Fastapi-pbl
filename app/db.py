#sqlalchemy is an orm that are we using to write sql like code in python form
from collections.abc import AsyncGenerator
import uuid
from sqlalchemy import Column,String,Text,DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession,create_async_engine,async_sessionmaker
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase


DATABASE_URL = "sqlite+aiosqlite:///./test.db"

class Base(DeclarativeBase):
    pass
# when we work with data we have to save that specfic type of data

# creating a datamodel

class Post(Base):
    __tablename__ = "posts"
    # this statement helps use to generate the unique for ever new creation
    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    caption = Column(Text)
    url = Column(String,nullable =False)
    file_type = Column(String,nullable = False)
    file_name = Column(String,nullable = False)
    created_at = Column(DateTime,default = datetime.utcnow)
    
'''
engine is the database connection manager.

In practice it does 3 main things:

Knows how to connect to your DB using DATABASE_URL.
Opens/reuses connections (pooling for most DBs; for SQLite it still manages access).
Executes low-level DB operations and is used by sessions.
So AsyncSession works on top of engine, and without engine your app cannot talk to the database.'''

# Engine = road between FastAPI and Database

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine,expire_on_commit = False)

async def create_db_and_tables():
    async with engine.begin() as conn:
        #creaRE all the db and all the tables through engine
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession,None]:
    async with async_session_maker() as session:
        yield session


