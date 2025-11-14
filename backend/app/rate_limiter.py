"""Simple in-memory rate limiter per IP address."""
import time
import asyncio
from typing import Dict, Tuple
from collections import defaultdict


class RateLimiter:
    """Simple in-memory rate limiter using sliding window per IP."""
    
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum number of requests per window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
        self._locks: Dict[str, asyncio.Lock] = {}
        self._dict_lock = asyncio.Lock()  # Lock for managing IP locks dictionary
    
    async def _get_lock(self, ip: str) -> asyncio.Lock:
        """Get or create lock for an IP address (thread-safe)."""
        async with self._dict_lock:
            if ip not in self._locks:
                self._locks[ip] = asyncio.Lock()
            return self._locks[ip]
    
    def _clean_old_requests(self, ip: str, now: float):
        """Remove requests outside the time window."""
        if ip not in self.requests:
            return
        
        cutoff_time = now - self.window_seconds
        self.requests[ip] = [
            timestamp for timestamp in self.requests[ip]
            if timestamp > cutoff_time
        ]
    
    async def is_allowed(self, ip: str) -> Tuple[bool, int]:
        """
        Check if request is allowed for the given IP (thread-safe for async).
        
        Args:
            ip: IP address
        
        Returns:
            Tuple of (is_allowed, remaining_requests)
        """
        # Get lock for this IP (thread-safe)
        lock = await self._get_lock(ip)
        
        async with lock:
            now = time.time()
            
            # Clean old requests
            self._clean_old_requests(ip, now)
            
            # Check if limit exceeded
            request_count = len(self.requests[ip])
            
            if request_count >= self.max_requests:
                return False, 0
            
            # Add current request
            self.requests[ip].append(now)
            
            # Return allowed status and remaining requests
            remaining = self.max_requests - request_count - 1
            return True, remaining
    
    async def get_remaining(self, ip: str) -> int:
        """Get remaining requests for an IP (thread-safe for async)."""
        lock = await self._get_lock(ip)
        async with lock:
            now = time.time()
            self._clean_old_requests(ip, now)
            request_count = len(self.requests[ip])
            return max(0, self.max_requests - request_count)


# Global rate limiter instance
# 10 requests per 60 seconds per IP
rate_limiter = RateLimiter(max_requests=10, window_seconds=60)

