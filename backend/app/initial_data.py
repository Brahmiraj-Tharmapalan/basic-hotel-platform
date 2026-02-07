import asyncio
import logging
from app.db.session import AsyncSessionLocal
from app.models import User, Hotel, RoomType, RateAdjustment
from app.core.security import get_password_hash
from sqlalchemy import select
from datetime import date

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("seed.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

async def init_db() -> None:
    async with AsyncSessionLocal() as session:
        # 1. Seed User
        logger.info("Creating initial user...")
        result = await session.execute(select(User).where(User.email == "admin@example.com"))
        user = result.scalar_one_or_none()
        
        if not user:
            user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_superuser=True,
            )
            session.add(user)
            logger.info("User 'admin@example.com' created.")
        else:
            logger.info("User 'admin@example.com' already exists.")

        # 2. Seed Hotels
        logger.info("Creating hotels...")
        result = await session.execute(select(Hotel).where(Hotel.name == "Grand Hotel"))
        hotel = result.scalar_one_or_none()
        
        if not hotel:
            hotel = Hotel(name="Grand Hotel", location="New York, NY")
            session.add(hotel)
            await session.flush() # Flush to get ID
            
            # 3. Room Types for Grand Hotel
            std_room = RoomType(hotel_id=hotel.id, name="Standard Room", base_price=100.0)
            deluxe_room = RoomType(hotel_id=hotel.id, name="Deluxe Suite", base_price=200.0)
            session.add_all([std_room, deluxe_room])
            await session.flush() 

            # 4. Rate Adjustments
            # +20 for Holiday Season (Dec 25)
            adj1 = RateAdjustment(
                room_type_id=std_room.id,
                adjustment_amount=20.0,
                effective_date=date(2025, 12, 25),
                reason="Holiday Season Surcharge"
            )
            session.add(adj1)
            logger.info("Grand Hotel and rooms created.")
        else:
            logger.info("Hotel 'Grand Hotel' already exists.")

        # Another Hotel
        result = await session.execute(select(Hotel).where(Hotel.name == "Ocean View Resort"))
        hotel2 = result.scalar_one_or_none()
        if not hotel2:
            hotel2 = Hotel(name="Ocean View Resort", location="Miami, FL")
            session.add(hotel2)
            await session.flush()
            
            # Rooms
            ocean_room = RoomType(hotel_id=hotel2.id, name="Ocean View King", base_price=350.0)
            session.add(ocean_room)
            logger.info("Ocean View Resort created.")

        await session.commit()

if __name__ == "__main__":
    try:
        asyncio.run(init_db())
    except Exception as e:
        logger.exception("Seeding failed")
        raise e
