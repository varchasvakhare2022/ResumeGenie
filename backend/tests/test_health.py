"""Integration tests for /api/health endpoint."""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test /api/health endpoint returns correct structure."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert "status" in data
        assert "env" in data
        assert "db" in data
        
        # Check types
        assert isinstance(data["status"], str)
        assert isinstance(data["env"], str)
        assert isinstance(data["db"], bool)
        
        # Check status value
        assert data["status"] == "ok"
        
        # Check env is a valid value
        assert data["env"] in ["dev", "prod", "test", "staging"]


@pytest.mark.asyncio
async def test_health_endpoint_db_status():
    """Test /api/health endpoint database status."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        
        # db should be a boolean
        assert isinstance(data["db"], bool)
        
        # db can be True or False depending on MongoDB connection
        assert data["db"] in [True, False]


@pytest.mark.asyncio
async def test_health_endpoint_response_format():
    """Test /api/health endpoint response format matches expected schema."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify exact structure
        expected_keys = {"status", "env", "db"}
        assert set(data.keys()) == expected_keys
        
        # Verify no extra fields
        assert len(data) == 3

