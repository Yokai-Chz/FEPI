from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/servicios", tags=["SERVICIOS LOGÍSTICOS"])

class SolicitarGruaRequest(BaseModel):
    latitud: float
    longitud: float
    tipo_vehiculo: str

class SolicitarGruaResponse(BaseModel):
    id_asignacion: str
    unidad: str
    placa_grua: str
    concesionaria: str
    eta_minutos: int

@router.post("/solicitar-grua", response_model=SolicitarGruaResponse)
async def solicitar_grua(request: SolicitarGruaRequest):
    return {
        "id_asignacion": "GRUA-500",
        "unidad": "Grúa Titan 4",
        "placa_grua": "GR-04-CDMX",
        "concesionaria": "Grúas Metropolitanas",
        "eta_minutos": 15
    }

