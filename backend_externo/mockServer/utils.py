import random
import hashlib
import re
from datetime import datetime, timedelta
from faker import Faker

fake = Faker('es_MX')

# Hardcoded data from README
MOCK_DB = {
    "A01-AAA": {
        "marca": "Nissan",
        "modelo": "Versa",
        "color": "Blanco",
        "anio": 2023,
        "niv": "3N1AB23C4D567890",
        "clase": "Automóvil",
        "tipo_vehiculo": "Sedan",
        "propietario": {
            "nombre_completo": "Juan Pérez López",
            "rfc": "PELJ800101XYZ",
            "domicilio_fiscal": "Av. Reforma 222, CDMX"
        },
        "estatus_robo": False,
        "mensaje_robo": "SIN REPORTE DE ROBO"
    },
    "R01-AAB": {
        "marca": "Chevrolet",
        "modelo": "Malibu",
        "color": "Negro",
        "anio": 2018,
        "niv": "1HGBH41JZMN109186",
        "clase": "Automóvil",
        "tipo_vehiculo": "Sedan",
        "propietario": {
            "nombre_completo": "Carlos Sánchez",
            "rfc": "SACC900101666",
            "domicilio_fiscal": "Calle Oscura 666, CDMX"
        },
        "estatus_robo": True,
        "mensaje_robo": "CON REPORTE DE ROBO",
        "fuentes_robo": {
            "fgj": {
                "activo": True,
                "entidad": "Fiscalía CDMX",
                "fecha_averiguacion": "2024-01-15",
                "folio": "CI-FCY/OY/UI-1S/D/0001"
            },
            "ocra": {"activo": False},
            "extranjero": {"activo": False}
        }
    }
}

INFRACCIONES_COMUNES = [
    {"concepto": "Exceder limites de velocidad", "articulo": 9, "fraccion": "I", "monto": 1085.70},
    {"concepto": "Documentación incompleta", "articulo": 45, "fraccion": "IV", "monto": 542.85},
    {"concepto": "Estacionamiento prohibido", "articulo": 30, "fraccion": "II", "monto": 2074.80},
    {"concepto": "Vuelta prohibida", "articulo": 10, "fraccion": "VIII", "monto": 896.20},
    {"concepto": "No respetar semáforo", "articulo": 10, "fraccion": "VI", "monto": 1500.00},
]

MARCAS_MODELOS_AUTO = [
    ("Nissan", ["Versa", "Sentra", "March", "Kicks"]),
    ("Chevrolet", ["Aveo", "Onix", "Captiva", "Groove"]),
    ("Volkswagen", ["Vento", "Jetta", "Virtus", "Taos"]),
    ("Toyota", ["Yaris", "Corolla", "Hilux", "RAV4"]),
]

MARCAS_MODELOS_MOTO = [
    ("Italika", ["DT150", "FT150", "Vort-X 300"]),
    ("Honda", ["Cargo 150", "CB190R", "Dio 110"]),
    ("Yamaha", ["YBR125", "FZ-S", "MT-03"]),
    ("Bajaj", ["Pulsar NS200", "Boxer 150"]),
]

MARCAS_MODELOS_CAMION = [
    ("Kenworth", ["T680", "T880", "T370"]),
    ("Freightliner", ["Cascadia", "M2 106"]),
    ("International", ["ProStar", "MV Series"]),
    ("Isuzu", ["MV", "Elf"]),
]

COLORES = ["Blanco", "Plata", "Gris", "Negro", "Rojo", "Azul", "Beige"]

# Full 3-letter series for Auto Private (States) from DOF PDF
STATE_SERIES_AUTO = {
    "Aguascalientes": "AAA", "Baja California": "AGA", "Baja California Sur": "CZA", "Campeche": "DFA",
    "Chiapas": "DLA", "Chihuahua": "DTA", "Coahuila": "EUA", "Colima": "FRA", "Durango": "FXA",
    "Estado de México": "LGA", "Guanajuato": "GGA", "Guerrero": "GZA", "Hidalgo": "HGA", "Jalisco": "HSA",
    "Michoacán": "PFA", "Morelos": "PVA", "Nayarit": "REA", "Nuevo León": "RKA", "Oaxaca": "THA",
    "Puebla": "TNA", "Querétaro": "UKA", "Quintana Roo": "URA", "San Luis Potosí": "UWA", "Sinaloa": "VFA",
    "Sonora": "VTA", "Tabasco": "WLA", "Tamaulipas": "WXA", "Tlaxcala": "XTA", "Veracruz": "XYA",
    "Yucatán": "YWA", "Zacatecas": "ZDA"
}

def _seed_from_placa(placa: str):
    hash_val = int(hashlib.sha256(placa.encode('utf-8')).hexdigest(), 16)
    random.seed(hash_val)
    Faker.seed(hash_val)

def generate_placa(estado: str = "CDMX", tipo_vehiculo: str = "Automóvil"):
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    
    l1 = random.choice(letters)
    l2 = random.choice(letters)
    l3 = random.choice(letters)
    n1 = random.randint(0, 9)
    n2 = random.randint(0, 9)
    n3 = random.randint(0, 9)
    
    if tipo_vehiculo == "Motocicleta":
        # LNNLL
        return f"{l1}{n1}{n2}{l2}{l3}"

    if tipo_vehiculo == "Camión":
        if estado == "CDMX":
            # L-NNN-LL
            return f"{l1}-{n1}{n2}{n3}-{l2}{l3}"
        else:
            # LL-NNNN-L
            n4 = random.randint(0, 9)
            return f"{l1}{l2}-{n1}{n2}{n3}{n4}-{l3}"

    # Default: Automóvil
    if estado == "CDMX":
        # LNN-LLL
        return f"{l1}{n1}{n2}-{l2}{l3}{random.choice(letters)}"
    else:
        # LLL-NNN-L
        prefix = STATE_SERIES_AUTO.get(estado, "AAA")
        return f"{prefix}-{n1}{n2}{n3}-{l1}"

def infer_info_from_placa(placa: str):
    if re.match(r'^[A-Z]\d{2}[A-Z]{2}$', placa):
        return "Desconocido", "Motocicleta"

    if re.match(r'^[A-Z]\d{2}-[A-Z]{3}$', placa):
        return "CDMX", "Automóvil"

    if re.match(r'^[A-Z]{3}-\d{3}-[A-Z]$', placa):
        prefix = placa[:3]
        for s, p in STATE_SERIES_AUTO.items():
            if p == prefix: return s, "Automóvil"
        return "Estado (Otro)", "Automóvil"

    if re.match(r'^[A-Z]-\d{3}-[A-Z]{2}$', placa):
        return "CDMX", "Camión"

    if re.match(r'^[A-Z]{2}-\d{4}-[A-Z]$', placa):
        return "Estado (Otro)", "Camión"

    return "Desconocido", "Automóvil"

def generate_vehiculo_data(placa: str):
    if placa in MOCK_DB:
        return MOCK_DB[placa]
    
    _seed_from_placa(placa)
    estado, tipo = infer_info_from_placa(placa)
    
    if tipo == "Motocicleta":
        marca, modelos = random.choice(MARCAS_MODELOS_MOTO)
        clase, tipo_body = "Motocicleta", "Motocicleta"
    elif tipo == "Camión":
        marca, modelos = random.choice(MARCAS_MODELOS_CAMION)
        clase, tipo_body = "Camión", "Carga"
    else:
        marca, modelos = random.choice(MARCAS_MODELOS_AUTO)
        clase, tipo_body = "Automóvil", "Sedan"
        
    modelo = random.choice(modelos)
    color = random.choice(COLORES)
    anio = random.randint(2010, 2024)
    
    if estado == "CDMX":
        address = fake.address().replace('\n', ', ') + ", CDMX"
    elif estado not in ["Desconocido", "Estado (Otro)"]:
        address = fake.street_address() + f", {fake.city()}, {estado}"
    else:
        address = fake.address().replace('\n', ', ')

    niv = f"{random.randint(1,9)}{random.choice('ABCDEFGHJKLMNPRSTuvwxyz')}{random.choice('ABCDEFGHJKLMNPRSTuvwxyz')}{random.choice('ABCDEFGHJKLMNPRSTuvwxyz')}{random.choice('ABCDEFGHJKLMNPRSTuvwxyz')}{random.randint(10,99)}{random.choice('0123456789X')}{anio % 10}0{random.randint(100000, 999999)}"
    niv = niv[:17].upper()

    return {
        "marca": marca, "modelo": modelo, "color": color, "anio": anio,
        "niv": niv, "clase": clase, "tipo_vehiculo": tipo_body,
        "propietario": {
            "nombre_completo": fake.name(),
            "rfc": fake.rfc(),
            "domicilio_fiscal": address
        },
        "estatus_robo": False, "mensaje_robo": "SIN REPORTE DE ROBO"
    }

def generate_tarjeta_circulacion():
    folio = f"TC-{random.randint(1000000, 9999999)}"
    vigencia = (datetime.now() + timedelta(days=365*3)).strftime("%Y-%m-%d")
    return {"folio": folio, "vigencia": vigencia, "estatus": "VIGENTE"}

def generate_licencia_data(licencia_id: str):
    _seed_from_placa(licencia_id)
    return {
        "numero_licencia": licencia_id,
        "tipo": random.choice(["A", "A1", "A2", "B"]),
        "estatus": "ACTIVA",
        "fecha_vencimiento": (datetime.now() + timedelta(days=random.randint(100, 1000))).strftime("%Y-%m-%d")
    }

def generate_linea_captura_info(placa: str, monto: float):
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    linea = "".join(random.choices(chars, k=20))
    folio_tes = f"TES-{datetime.now().year}-{random.randint(100000, 999999)}"
    return linea, folio_tes

def get_infraccion_random():
    return random.choice(INFRACCIONES_COMUNES)
