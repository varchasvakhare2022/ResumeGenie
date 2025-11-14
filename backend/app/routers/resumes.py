"""Resume CRUD router."""
from fastapi import APIRouter, HTTPException, status
from app.schemas import ResumeCreate, ResumeResponse
from app.db import get_collection
from app.utils import sanitize_resume_data
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from pydantic import ValidationError


router = APIRouter()


def validate_object_id(resume_id: str) -> ObjectId:
    """
    Validate and convert string ID to ObjectId.
    
    Args:
        resume_id: String ID to validate
    
    Returns:
        ObjectId instance
    
    Raises:
        HTTPException: If ID is invalid (400)
    """
    try:
        return ObjectId(resume_id)
    except (InvalidId, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid resume ID format: {resume_id}. Expected a valid MongoDB ObjectId."
        )


def check_database_configured(collection) -> None:
    """
    Check if database is configured and available.
    
    Args:
        collection: Collection instance (may be None)
    
    Raises:
        HTTPException: If database is not configured (501)
    """
    from app.config import settings
    
    if collection is None:
        # Check if MONGODB_URI is set
        if not settings.MONGODB_URI or settings.MONGODB_URI.strip() == "":
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail=(
                    "Database is not configured. "
                    "Please set MONGODB_URI in your environment variables or backend/.env file. "
                    "For local development, start MongoDB with: docker compose up -d"
                )
            )
        else:
            # MONGODB_URI is set but connection failed
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=(
                    "Unable to connect to database. "
                    "Please check that MongoDB is running and MONGODB_URI is correct. "
                    "For local development, ensure MongoDB is started with: docker compose up -d"
                )
            )


def convert_doc_to_response(doc: dict) -> ResumeResponse:
    """
    Convert MongoDB document to ResumeResponse.
    
    Args:
        doc: MongoDB document with _id field
    
    Returns:
        ResumeResponse instance
    
    Raises:
        HTTPException: If document is None or cannot be converted (500)
    """
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document is None, cannot convert to response"
        )
    
    try:
        # Convert ObjectId to string
        doc["id"] = str(doc["_id"])
        # Remove _id field
        doc.pop("_id", None)
        # Convert to response model
        return ResumeResponse(**doc)
    except (ValidationError, KeyError, TypeError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error converting document to response: {str(e)}"
        )


@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(resume: ResumeCreate):
    """
    Create a new resume.
    
    Stores the resume in MongoDB collection 'resumes' with created_at and updated_at timestamps.
    Returns the created resume with its generated ID.
    """
    collection = await get_collection("resumes")
    check_database_configured(collection)
    
    try:
        # Convert resume to dictionary
        resume_dict = resume.model_dump()
        
        # Sanitize resume data before storing
        resume_dict = sanitize_resume_data(resume_dict)
        
        # Add timestamps
        now = datetime.utcnow()
        resume_dict["created_at"] = now
        resume_dict["updated_at"] = now
        
        # Insert into database
        result = await collection.insert_one(resume_dict)
        
        # Fetch the created document
        created_doc = await collection.find_one({"_id": result.inserted_id})
        
        if not created_doc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created resume"
            )
        
        # Convert to response
        return convert_doc_to_response(created_doc)
        
    except HTTPException:
        # Re-raise HTTP exceptions (they're already properly formatted)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating resume: {str(e)}"
        )


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str):
    """
    Get a specific resume by ID.
    
    Args:
        resume_id: MongoDB ObjectId of the resume
    
    Returns:
        ResumeResponse with resume data
    
    Raises:
        HTTPException: 400 if ID is invalid, 404 if not found, 501 if DB not configured
    """
    collection = await get_collection("resumes")
    check_database_configured(collection)
    
    # Validate ObjectId format
    object_id = validate_object_id(resume_id)
    
    try:
        # Find document by ID
        doc = await collection.find_one({"_id": object_id})
        
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resume with ID '{resume_id}' not found"
            )
        
        # Convert to response
        return convert_doc_to_response(doc)
        
    except HTTPException:
        # Re-raise HTTP exceptions (404, etc.)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving resume: {str(e)}"
        )


@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(resume_id: str, resume: ResumeCreate):
    """
    Update an existing resume.
    
    Args:
        resume_id: MongoDB ObjectId of the resume to update
        resume: Updated resume data
    
    Returns:
        ResumeResponse with updated resume data
    
    Raises:
        HTTPException: 400 if ID is invalid, 404 if not found, 501 if DB not configured
    """
    collection = await get_collection("resumes")
    check_database_configured(collection)
    
    # Validate ObjectId format
    object_id = validate_object_id(resume_id)
    
    try:
        # Check if resume exists
        existing_doc = await collection.find_one({"_id": object_id})
        if not existing_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resume with ID '{resume_id}' not found"
            )
        
        # Convert resume to dictionary
        resume_dict = resume.model_dump()
        
        # Sanitize resume data before storing
        resume_dict = sanitize_resume_data(resume_dict)
        
        # Update timestamp (preserve created_at)
        resume_dict["updated_at"] = datetime.utcnow()
        resume_dict["created_at"] = existing_doc.get("created_at", datetime.utcnow())
        
        # Update document
        result = await collection.update_one(
            {"_id": object_id},
            {"$set": resume_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resume with ID '{resume_id}' not found"
            )
        
        # Fetch updated document
        updated_doc = await collection.find_one({"_id": object_id})
        
        if not updated_doc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated resume"
            )
        
        # Convert to response
        return convert_doc_to_response(updated_doc)
        
    except HTTPException:
        # Re-raise HTTP exceptions (404, etc.)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating resume: {str(e)}"
        )


@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
async def delete_resume(resume_id: str):
    """
    Delete a resume by ID.
    
    Args:
        resume_id: MongoDB ObjectId of the resume to delete
    
    Returns:
        Success message
    
    Raises:
        HTTPException: 400 if ID is invalid, 404 if not found, 501 if DB not configured
    """
    collection = await get_collection("resumes")
    check_database_configured(collection)
    
    # Validate ObjectId format
    object_id = validate_object_id(resume_id)
    
    try:
        # Delete document
        result = await collection.delete_one({"_id": object_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resume with ID '{resume_id}' not found"
            )
        
        return {
            "message": "Resume deleted successfully",
            "id": resume_id
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions (404, etc.)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting resume: {str(e)}"
        )
