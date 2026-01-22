from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db_connection

router = APIRouter(prefix="/api/repuve", tags=["REPUVE"])

class IdentificacionVehicular(BaseModel):
    placa: str
    niv: str
    nci: Optional[str] = None
    marca: str
    modelo: str
    anio_modelo: int
    clase: Optional[str] = None
    tipo: Optional[str] = None
    numero_puertas: Optional[int] = None
    pais_origen: Optional[str] = None

class FuenteReporte(BaseModel):
    activo: bool
    entidad: Optional[str] = None
    fecha_averiguacion: Optional[str] = None
    folio: Optional[str] = None

class FuentesReporte(BaseModel):
    fgj: Optional[FuenteReporte] = None
    ocra: Optional[FuenteReporte] = None
    extranjero: Optional[FuenteReporte] = None

class EstatusLegal(BaseModel):
    tiene_reporte_robo: bool
    mensaje: str
    fuentes_reporte: Optional[FuentesReporte] = None

class RepuveResponse(BaseModel):
    identificacion_vehicular: IdentificacionVehicular
    estatus_legal: EstatusLegal

@router.get("/all", response_model=List[RepuveResponse])
async def obtener_todos_repuve():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT v.*, r.tiene_reporte, r.mensaje, r.entidad, r.fecha_averiguacion, r.folio_reporte
        FROM vehiculos v
        LEFT JOIN reportes_robo r ON v.placa = r.placa
    '''
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    
    resultados = []
    
    for row in rows:
        identificacion = {
            "placa": row["placa"],
            "niv": row["niv"],
            "nci": row["nci"],
            "marca": row["marca"],
            "modelo": row["modelo"],
            "anio_modelo": row["anio"],
            "clase": row["clase"],
            "tipo": row["tipo_vehiculo"],
            "numero_puertas": row["num_puertas"],
            "pais_origen": row["pais_origen"]
        }
        
        # Handle None for tiene_reporte
        tiene_robo = bool(row["tiene_reporte"])
        
        estatus = {
            "tiene_reporte_robo": tiene_robo,
            "mensaje": row["mensaje"] if row["mensaje"] else "SIN REPORTE DE ROBO"
        }
        
        if tiene_robo:
            estatus["fuentes_reporte"] = {
                "fgj": {
                    "activo": True,
                    "entidad": row["entidad"],
                    "fecha_averiguacion": row["fecha_averiguacion"],
                    "folio": row["folio_reporte"]
                },
                "ocra": {"activo": False},
                "extranjero": {"activo": False}
            }
        
        resultados.append({
            "identificacion_vehicular": identificacion,
            "estatus_legal": estatus
        })
        
    return resultados

@router.get("/consulta/{placa}", response_model=RepuveResponse)
async def consultar_repuve(placa: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT v.*, r.tiene_reporte, r.mensaje, r.entidad, r.fecha_averiguacion, r.folio_reporte
        FROM vehiculos v
        LEFT JOIN reportes_robo r ON v.placa = r.placa
        WHERE v.placa = ?
    '''
    cursor.execute(query, (placa,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado en REPUVE")
    
    identificacion = {
        "placa": row["placa"],
        "niv": row["niv"],
        "nci": row["nci"],
        "marca": row["marca"],
        "modelo": row["modelo"],
        "anio_modelo": row["anio"],
        "clase": row["clase"],
        "tipo": row["tipo_vehiculo"],
        "numero_puertas": row["num_puertas"],
        "pais_origen": row["pais_origen"]
    }
    
    # Handle None for tiene_reporte (if left join matched nothing, though we populated it)
    tiene_robo = bool(row["tiene_reporte"])
    
    estatus = {
        "tiene_reporte_robo": tiene_robo,
        "mensaje": row["mensaje"] if row["mensaje"] else "SIN REPORTE DE ROBO"
    }
    
    if tiene_robo:
        estatus["fuentes_reporte"] = {
            "fgj": {
                "activo": True,
                "entidad": row["entidad"],
                "fecha_averiguacion": row["fecha_averiguacion"],
                "folio": row["folio_reporte"]
            },
            "ocra": {"activo": False},
            "extranjero": {"activo": False}
        }
        
    return {
        "identificacion_vehicular": identificacion,
        "estatus_legal": estatus
    }

