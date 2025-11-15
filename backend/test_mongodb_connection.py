#!/usr/bin/env python3
"""
Quick script to test MongoDB Atlas connection.
Run this after updating your .env file to verify the connection works.
"""
import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

def test_connection():
    """Test MongoDB connection from environment variables."""
    # Load from .env file if python-dotenv is available
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("Note: python-dotenv not installed. Using system environment variables.")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    
    if not mongodb_uri:
        print("❌ ERROR: MONGODB_URI not found in environment variables.")
        print("\nMake sure you have:")
        print("1. Created backend/.env from backend/env.txt")
        print("2. Updated MONGODB_URI with your Atlas connection string")
        return False
    
    print(f"📡 Testing connection to MongoDB...")
    print(f"URI: {mongodb_uri.split('@')[1] if '@' in mongodb_uri else 'hidden'}\n")
    
    try:
        # Connect with a short timeout
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        
        # Get database info - handle case where database name is in URI or use default
        try:
            db = client.get_database()
            db_name = db.name
        except Exception:
            # If no database name in URI, use default
            db_name = "resumegenie"
            db = client[db_name]
        
        print(f"✅ Connection successful!")
        print(f"📊 Database: {db_name}")
        print(f"🖥️  Server version: {client.server_info()['version']}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Collections: {collections if collections else 'None (database is empty)'}")
        
        client.close()
        return True
        
    except ServerSelectionTimeoutError:
        print("❌ ERROR: Connection timeout. Check:")
        print("  1. Your internet connection")
        print("  2. Network Access in MongoDB Atlas (IP whitelist)")
        print("  3. Connection string is correct")
        return False
        
    except ConnectionFailure as e:
        print(f"❌ ERROR: Connection failed - {e}")
        print("\nCheck:")
        print("  1. Database username and password are correct")
        print("  2. Password special characters are URL-encoded")
        print("  3. Cluster is running (check MongoDB Atlas dashboard)")
        return False
        
    except Exception as e:
        error_type = type(e).__name__
        error_msg = str(e)
        
        if "ConfigurationError" in error_type or "No default database" in error_msg:
            print(f"❌ ERROR: No database name in connection string!")
            print(f"\n📝 Your connection string is missing the database name.")
            print(f"\nCurrent URI format: {mongodb_uri.split('@')[1] if '@' in mongodb_uri else 'hidden'}")
            print(f"\n✅ SOLUTION: Add the database name to your connection string.")
            print(f"\nExample:")
            print(f"  ❌ WRONG: mongodb+srv://user:pass@cluster.net/?retryWrites=true")
            print(f"  ✅ RIGHT:  mongodb+srv://user:pass@cluster.net/resumegenie?retryWrites=true")
            print(f"\n📋 Steps to fix:")
            print(f"  1. Open backend/.env")
            print(f"  2. Find your MONGODB_URI line")
            print(f"  3. Add '/resumegenie' before the '?' in the connection string")
            print(f"     (or replace '/' before '?' with '/resumegenie')")
            print(f"\nExample format:")
            print(f"  MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/resumegenie?retryWrites=true&w=majority")
        else:
            print(f"❌ ERROR: {error_type}: {error_msg}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

