from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

# Adjust path to import database from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db_connection

router = APIRouter(prefix="/api/semovi", tags=["SEMOVI"])

class TarjetaCirculacion(BaseModel):
    folio: str
    vigencia: str
    estatus: str

class Propietario(BaseModel):
    nombre_completo: str
    rfc: str
    domicilio_fiscal: str

class VehiculoSemoviResponse(BaseModel):
    placa: str
    marca: str
    modelo: str
    color: str
    anio: int
    tarjeta_circulacion: TarjetaCirculacion
    propietario: Propietario

class LicenciaResponse(BaseModel):
    numero_licencia: str
    tipo: str
    estatus: str
    fecha_vencimiento: str

@router.get("/vehiculo/{placa}", response_model=VehiculoSemoviResponse)
async def consultar_vehiculo(placa: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT v.*, tc.folio as tc_folio, tc.vigencia as tc_vigencia, tc.estatus as tc_estatus,
               p.nombre_completo, p.rfc, p.domicilio_fiscal
        FROM vehiculos v
        JOIN tarjetas_circulacion tc ON v.placa = tc.placa
        JOIN propietarios p ON tc.rfc_propietario = p.rfc
        WHERE v.placa = ?
    '''
    cursor.execute(query, (placa,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado en el padrón")
    
    return {
        "placa": row["placa"],
        "marca": row["marca"],
        "modelo": row["modelo"],
        "color": row["color"],
        "anio": row["anio"],
        "tarjeta_circulacion": {
            "folio": row["tc_folio"],
            "vigencia": row["tc_vigencia"],
            "estatus": row["tc_estatus"]
        },
        "propietario": {
            "nombre_completo": row["nombre_completo"],
            "rfc": row["rfc"],
            "domicilio_fiscal": row["domicilio_fiscal"]
        }
    }

@router.get("/licencia/{numero_licencia}", response_model=LicenciaResponse)
async def consultar_licencia(numero_licencia: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM licencias WHERE numero_licencia = ?", (numero_licencia,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Licencia no encontrada")
        
    return {
        "numero_licencia": row["numero_licencia"],
        "tipo": row["tipo"],
        "estatus": row["estatus"],
        "fecha_vencimiento": row["fecha_vencimiento"]
    }

