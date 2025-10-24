import asyncio
from database import users_collection, courses_collection
from datetime import datetime

async def seed_database():
    print("Seeding database...")
    
    # Update admin user
    await users_collection.update_one(
        {"email": "admin@academy.oms-dz.com"},
        {"$set": {"role": "admin"}}
    )
    print("✓ Admin user updated")
    
    # Check if courses already exist
    existing_courses = await courses_collection.count_documents({})
    if existing_courses > 0:
        print(f"✓ {existing_courses} courses already exist")
        return
    
    # Create courses
    courses = [
        {
            "title": "Programme de Formation en Chirurgie de la Cataracte",
            "description": "Formation pratique complète sur les techniques modernes de chirurgie de la cataracte avec mentorat expert.",
            "duration": "12 semaines",
            "level": "Avancé",
            "price": 5999.0,
            "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
            "enrolled_count": 245,
            "rating": 4.9,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "Masterclass de Formation Phaco",
            "description": "Maîtrisez les techniques de phacoémulsification avec formation sur simulateur et observation de chirurgie en direct.",
            "duration": "8 semaines",
            "level": "Intermédiaire",
            "price": 4499.0,
            "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
            "enrolled_count": 189,
            "rating": 4.8,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "Fondamentaux de la Chirurgie Réfractive",
            "description": "Apprenez les fondamentaux et les techniques avancées des procédures de chirurgie réfractive.",
            "duration": "10 semaines",
            "level": "Avancé",
            "price": 5499.0,
            "image": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80",
            "enrolled_count": 156,
            "rating": 4.7,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = await courses_collection.insert_many(courses)
    print(f"✓ Created {len(result.inserted_ids)} courses")
    print("Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_database())
