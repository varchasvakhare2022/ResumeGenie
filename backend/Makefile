.PHONY: run install lint format help

# Default target
help:
	@echo "Available targets:"
	@echo "  make run       - Run the FastAPI server with auto-reload"
	@echo "  make install   - Install Python dependencies"
	@echo "  make lint      - Run ruff linter (optional)"
	@echo "  make format    - Format code with black (optional)"
	@echo ""
	@echo "Usage:"
	@echo "  make run                - Run on default port 8000"
	@echo "  PORT=9000 make run      - Run on port 9000"

# Run the FastAPI server
# Uses PORT environment variable or defaults to 8000
# PORT can be set via: PORT=9000 make run
run:
	@PORT=$${PORT:-8000}; \
	echo "Starting server on port $$PORT..."; \
	uvicorn app.main:app --reload --host 0.0.0.0 --port $$PORT

# Install Python dependencies
install:
	pip install -r requirements.txt

# Lint code with ruff (optional)
lint:
	@if command -v ruff > /dev/null; then \
		ruff check app/; \
	else \
		echo "ruff not installed. Install with: pip install ruff"; \
	fi

# Format code with black (optional)
format:
	@if command -v black > /dev/null; then \
		black app/; \
	else \
		echo "black not installed. Install with: pip install black"; \
	fi

# Run tests
test:
	pytest tests/ -v

# Run tests with coverage
test-coverage:
	pytest tests/ --cov=app --cov-report=html --cov-report=term

