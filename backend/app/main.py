from fastapi import FastAPI


def create_app() -> FastAPI:
    """Application factory for the ResumeGenie backend."""
    app = FastAPI(title="ResumeGenie API", version="0.1.0")

    @app.get("/health", tags=["health"])
    async def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()


