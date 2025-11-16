"""MongoDB database connection and helpers."""
from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.config import settings
from typing import Optional
import orjson
import certifi


# Module-level cached client
_client: Optional[AsyncIOMotorClient] = None
_database: Optional[AsyncIOMotorDatabase] = None


async def get_db() -> Optional[AsyncIOMotorClient]:
    """
    Get MongoDB client instance.
    
    Returns cached client if available, otherwise creates a new one.
    Returns None if MONGODB_URI is not set or invalid.
    """
    global _client
    
    # Check if MONGODB_URI is set
    if not settings.MONGODB_URI or settings.MONGODB_URI == "":
        return None
    
    # Return cached client if available
    if _client is not None:
        return _client
    
    try:
        # Create new client with explicit TLS settings to work in minimal containers
        tls_kwargs = {}
        # If connecting to MongoDB Atlas or any TLS endpoint, ensure CA bundle is available
        # Using Debian's default CA bundle path
        tls_kwargs.update({
            "tls": True,
            "tlsAllowInvalidCertificates": False,
            "tlsCAFile": certifi.where(),
        })
        _client = AsyncIOMotorClient(settings.MONGODB_URI, **tls_kwargs)
        # Test connection
        await _client.admin.command('ping')
        return _client
    except Exception as e:
        # Don't expose connection URI in error messages
        error_msg = str(e)
        if settings.MONGODB_URI and settings.MONGODB_URI in error_msg:
            error_msg = error_msg.replace(settings.MONGODB_URI, "[REDACTED]")
        print(f"Error connecting to MongoDB: {error_msg}")
        _client = None
        return None


async def _get_database() -> Optional[AsyncIOMotorDatabase]:
    """
    Get database instance from cached client.
    Returns None if client is not available.
    """
    global _database, _client
    
    # Ensure client is initialized first
    client = await get_db()
    if client is None:
        return None
    
    # Initialize database if not already cached
    if _database is None:
        # Extract database name from URI or use default
        db_name = "resumegenie"
        if settings.MONGODB_URI and "/" in settings.MONGODB_URI:
            parts = settings.MONGODB_URI.split("/")
            if len(parts) > 3:
                db_name = parts[-1].split("?")[0]
                if not db_name or db_name == settings.MONGODB_URI:
                    db_name = "resumegenie"
        _database = _client[db_name]
    
    return _database


async def get_collection(collection_name: str):
    """
    Get a collection from the database.
    
    Returns None if database is not available (MONGODB_URI unset).
    """
    # Get database instance (this also ensures client is initialized)
    database = await _get_database()
    if database is None:
        return None
    
    return database[collection_name]


def encode_json(obj) -> bytes:
    """Encode Python object to JSON bytes using orjson."""
    return orjson.dumps(obj, option=orjson.OPT_SERIALIZE_NUMPY | orjson.OPT_UTC_Z)


def decode_json(data: bytes | str) -> dict:
    """Decode JSON bytes/string to Python dict using orjson."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return orjson.loads(data)


async def close_db():
    """Close database connection."""
    global _client, _database
    if _client:
        _client.close()
        _client = None
        _database = None


# Legacy functions for backward compatibility with lifespan events
async def connect_to_mongo():
    """Connect to MongoDB (for lifespan events)."""
    from app.config import settings
    
    client = await get_db()
    if client is None:
        if not settings.MONGODB_URI or settings.MONGODB_URI.strip() == "":
            print("Warning: MONGODB_URI is not set. Database features will be unavailable (endpoints will return 501).")
            print("  Set MONGODB_URI in your environment variables or backend/.env file.")
            print("  For local development, start MongoDB with: docker compose up -d")
        else:
            print("Warning: Unable to connect to MongoDB. Database features will be unavailable (endpoints will return 503).")
            print("  Please check that MongoDB is running and MONGODB_URI is correct.")
        return
    print("Connected to MongoDB successfully")


async def close_mongo_connection():
    """Close MongoDB connection (for lifespan events)."""
    await close_db()
    print("Disconnected from MongoDB")
