from fastapi import FastAPI
import uvicorn
from routers import semovi, repuve, servicios

app = FastAPI(
    title="Sistema de Infracciones de Tránsito CDMX - Mock Services",
    version="1.1",
    description="API Mock para servicios externos: SEMOVI, REPUVE, TESORERÍA, Servicios Logísticos."
)

app.include_router(semovi.router)
app.include_router(repuve.router)
app.include_router(servicios.router)
# app.include_router(webhooks.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
