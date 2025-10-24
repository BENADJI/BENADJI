import asyncio
from database import users_collection

async def upgrade_to_super_admin():
    print("Upgrading admin to super_admin...")
    
    result = await users_collection.update_one(
        {"email": "admin@academy.oms-dz.com"},
        {"$set": {"role": "super_admin"}}
    )
    
    if result.matched_count > 0:
        print("✓ Admin upgraded to super_admin successfully!")
    else:
        print("✗ Admin user not found")

if __name__ == "__main__":
    asyncio.run(upgrade_to_super_admin())
