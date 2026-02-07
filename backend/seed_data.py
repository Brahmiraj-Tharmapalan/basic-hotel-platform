import logging
import asyncio
from datetime import date, timedelta

from app.db.session import AsyncSessionLocal
from app.crud.crud_hotel import create_hotel, create_room_type
from app.schemas.hotel import HotelCreate, RoomTypeCreate
from app.core.security import get_password_hash
# Import all models to ensure they are registered
import app.models # noqa
from sqlalchemy.orm import configure_mappers
from sqlalchemy import select
from app.models.hotel import Hotel, RoomType
from app.models.user import User
from app.models.rate import RateAdjustment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure mappers are configured
configure_mappers()

async def init_db() -> None:
    async with AsyncSessionLocal() as db:
        # Seed Users
        users_data = [
            {"email": "admin@example.com", "password": "adminpassword", "is_superuser": True},
            {"email": "manager@example.com", "password": "managerpassword", "is_superuser": False},
        ]
        # Add 8 more users to make it 10
        for i in range(1, 9):
            users_data.append({
                "email": f"user{i}@example.com",
                "password": f"password{i}",
                "is_superuser": False
            })

        for user_data in users_data:
            existing_user = await db.execute(select(User).filter(User.email == user_data["email"]))
            if existing_user.scalars().first():
                print(f"User {user_data['email']} already exists, skipping.")
                continue
            
            db_user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                is_superuser=user_data["is_superuser"]
            )
            db.add(db_user)
        await db.commit()
        print("Seeded 10 users.")

        hotels_data = [
            {
                "name": "Grand Plaza Hotel",
                "location": "New York, NY",
                "rating": 4.5,
                "description": "A luxury hotel in the heart of the city.",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Deluxe King", "base_price": 250.0, "capacity": 2, "description": "Spacious room with a king-sized bed."},
                    {"name": "Double Queen", "base_price": 280.0, "capacity": 4, "description": "Perfect for families."}
                ]
            },
            {
                "name": "Sunset Resort",
                "location": "Miami, FL",
                "rating": 4.8,
                "description": "Beachfront paradise with stunning views.",
                "image_url": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1749&q=80",
                "room_types": [
                    {"name": "Ocean View Suite", "base_price": 450.0, "capacity": 2, "description": "Wake up to the sound of the waves."},
                    {"name": "Poolside Cabana", "base_price": 350.0, "capacity": 3, "description": "Direct access to the pool."}
                ]
            },
            {
                "name": "Mountain Lodge",
                "location": "Aspen, CO",
                "rating": 4.7,
                "description": "Cozy retreat for winter sports enthusiasts.",
                "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Log Cabin", "base_price": 300.0, "capacity": 4, "description": "Rustic charm with modern amenities."},
                    {"name": "Ski-in/Ski-out Room", "base_price": 400.0, "capacity": 2, "description": "Hit the slopes right from your door."}
                ]
            },
            {
                "name": "Urban Boutique",
                "location": "San Francisco, CA",
                "rating": 4.2,
                "description": "Chic and modern hotel in the tech district.",
                "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Studio", "base_price": 200.0, "capacity": 2, "description": "Compact and stylish."},
                    {"name": "Penthouse", "base_price": 800.0, "capacity": 6, "description": "Luxury living with skyline views."}
                ]
            },
            {
                "name": "Lakeside Inn",
                "location": "Lake Tahoe, NV",
                "rating": 4.6,
                "description": "Peaceful getaway by the water.",
                "image_url": "https://images.unsplash.com/photo-1469796466635-5a1331212c92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Lake View Room", "base_price": 220.0, "capacity": 2, "description": "Serene views of the lake."},
                    {"name": "Family Suite", "base_price": 320.0, "capacity": 5, "description": "Space for the whole family."}
                ]
            },
            {
                "name": "Desert Oasis",
                "location": "Phoenix, AZ",
                "rating": 4.4,
                "description": "Relaxing resort in the desert sun.",
                "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Casita", "base_price": 180.0, "capacity": 3, "description": "Private standalone unit."},
                    {"name": "Palm Suite", "base_price": 250.0, "capacity": 4, "description": "Overlooking the palm gardens."}
                ]
            },
            {
                "name": "Historic Downtown Hotel",
                "location": "Boston, MA",
                "rating": 4.3,
                "description": "Classic elegance in the heart of historic Boston.",
                "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Heritage Room", "base_price": 190.0, "capacity": 2, "description": "Classic decor with modern comforts."},
                    {"name": "Executive Suite", "base_price": 380.0, "capacity": 3, "description": "Spacious suite with city views."}
                ]
            },
            {
                "name": "Tropical Paradise Resort",
                "location": "Honolulu, HI",
                "rating": 4.9,
                "description": "Ultimate island getaway with pristine beaches.",
                "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
                "room_types": [
                    {"name": "Beachfront Bungalow", "base_price": 550.0, "capacity": 2, "description": "Steps from the sand."},
                    {"name": "Presidential Villa", "base_price": 1200.0, "capacity": 8, "description": "Luxury villa with private pool."}
                ]
            },
            {
                "name": "Riverside Inn",
                "location": "Portland, OR",
                "rating": 4.1,
                "description": "Charming boutique hotel along the Willamette River.",
                "image_url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80",
                "room_types": [
                    {"name": "River View", "base_price": 160.0, "capacity": 2, "description": "Watch the boats go by."},
                    {"name": "Loft Suite", "base_price": 240.0, "capacity": 4, "description": "Open concept with exposed brick."}
                ]
            },
            {
                "name": "Metropolitan Tower",
                "location": "Chicago, IL",
                "rating": 4.6,
                "description": "Sophisticated high-rise hotel in the Loop.",
                "image_url": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
                "room_types": [
                    {"name": "City View Room", "base_price": 210.0, "capacity": 2, "description": "Panoramic views of the skyline."},
                    {"name": "Corner Suite", "base_price": 420.0, "capacity": 4, "description": "Floor-to-ceiling windows on two sides."}
                ]
            }
        ]

        for hotel_data in hotels_data:
            try:
                # Check if hotel exists
                existing_hotel = await db.execute(select(Hotel).filter(Hotel.name == hotel_data["name"]))
                if existing_hotel.scalars().first():
                    # print(f"Hotel {hotel_data['name']} already exists, skipping.")
                    continue

                print(f"Creating hotel: {hotel_data['name']}")
                room_types = hotel_data.pop("room_types")
                
                db_hotel = Hotel(
                    name=hotel_data["name"],
                    location=hotel_data["location"],
                    description=hotel_data["description"],
                    rating=hotel_data["rating"],
                    image_url=hotel_data["image_url"]
                )
                db.add(db_hotel)
                await db.commit()
                await db.refresh(db_hotel)
                
                for rt_data in room_types:
                    db_room_type = RoomType(
                        name=rt_data["name"],
                        description=rt_data["description"],
                        base_price=rt_data["base_price"],
                        capacity=rt_data["capacity"],
                        hotel_id=db_hotel.id
                    )
                    db.add(db_room_type)
                await db.commit()
            except Exception as e:
                print(f"Error creating hotel {hotel_data.get('name')}: {e}")

        # Seed 10 Rate Adjustments
        # Get some room type IDs
        result = await db.execute(select(RoomType).limit(10))
        room_types = result.scalars().all()
        
        if room_types:
            for i, rt in enumerate(room_types):
                # Check if adjustment exists for this date/reason to avoid duplicates
                effective_date = date.today() + timedelta(days=i*2)
                existing_adj = await db.execute(
                    select(RateAdjustment)
                    .filter(RateAdjustment.room_type_id == rt.id, RateAdjustment.effective_date == effective_date)
                )
                if existing_adj.scalars().first():
                    continue

                adj = RateAdjustment(
                    room_type_id=rt.id,
                    adjustment_amount=20.0 + (i * 5.0),
                    effective_date=effective_date,
                    reason=f"Seasonal adjustment {i+1}"
                )
                db.add(adj)
            await db.commit()
            print("Seeded 10 rate adjustments.")

if __name__ == "__main__":
    print("Starting seeding...")
    asyncio.run(init_db())
    print("Seeding completed!")
