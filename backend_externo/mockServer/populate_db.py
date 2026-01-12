import random
from faker import Faker
from database import get_db_connection, init_db
import utils

fake = Faker('es_MX')

def populate_initial_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    # --- 1. README Examples ---
    
    # CASE 1: Clean Vehicle (A01-AAA) - CDMX Private Auto
    cursor.execute("INSERT OR REPLACE INTO propietarios (rfc, nombre_completo, domicilio_fiscal) VALUES (?, ?, ?)",
                   ("PELJ800101XYZ", "Juan Pérez López", "Av. Reforma 222, CDMX"))
    
    cursor.execute("INSERT OR REPLACE INTO vehiculos (placa, marca, modelo, color, anio, niv, nci, clase, tipo_vehiculo, num_puertas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   ("A01-AAA", "Nissan", "Versa", "Blanco", 2023, "3N1AB23C4D567890", "1459345", "Automóvil", "Sedan", 4))
    
    cursor.execute("INSERT OR REPLACE INTO tarjetas_circulacion (folio, placa, rfc_propietario, vigencia, estatus) VALUES (?, ?, ?, ?, ?)",
                   ("TC-987654321", "A01-AAA", "PELJ800101XYZ", "2026-12-31", "VIGENTE"))
    
    cursor.execute("INSERT OR REPLACE INTO reportes_robo (placa, tiene_reporte, mensaje) VALUES (?, ?, ?)",
                   ("A01-AAA", False, "SIN REPORTE DE ROBO"))

    cursor.execute("INSERT OR REPLACE INTO licencias (numero_licencia, tipo, estatus, fecha_vencimiento) VALUES (?, ?, ?, ?)",
                   ("L12345678", "A", "ACTIVA", "2026-05-20"))

    # CASE 2: Stolen Vehicle (ROB-666) - CDMX Private Auto
    cursor.execute("INSERT OR REPLACE INTO propietarios (rfc, nombre_completo, domicilio_fiscal) VALUES (?, ?, ?)",
                   ("SACC900101666", "Carlos Sánchez", "Calle Oscura 666, CDMX"))
    
    cursor.execute("INSERT OR REPLACE INTO vehiculos (placa, marca, modelo, color, anio, niv, nci, clase, tipo_vehiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                   ("ROB-666", "Chevrolet", "Malibu", "Negro", 2018, "1HGBH41JZMN109186", "8822110", "Automóvil", "Sedan"))
    
    cursor.execute("INSERT OR REPLACE INTO tarjetas_circulacion (folio, placa, rfc_propietario, vigencia, estatus) VALUES (?, ?, ?, ?, ?)",
                   ("TC-666666", "ROB-666", "SACC900101666", "2024-01-01", "VENCIDA"))
    
    cursor.execute('''INSERT OR REPLACE INTO reportes_robo 
                      (placa, tiene_reporte, mensaje, entidad, fecha_averiguacion, folio_reporte) 
                      VALUES (?, ?, ?, ?, ?, ?)''',
                   ("ROB-666", True, "CON REPORTE DE ROBO", "Fiscalía CDMX", "2024-01-15", "CI-FCY/OY/UI-1S/D/0001"))

    # --- 2. Random Data Generation (150 vehicles) ---
    print("Generating 10 random vehicles (Autos, Motos, Camiones)...")
    
    states_list = list(utils.STATE_SERIES_AUTO.keys())
    
    for _ in range(10):
        # Determine State (50% CDMX, 50% Others)
        if random.random() < 0.5:
            state = "CDMX"
        else:
            state = random.choice(states_list)
            
        # Determine Vehicle Type
        rand_type = random.random()
        if rand_type < 0.70:
            v_type = "Automóvil"
        elif rand_type < 0.90:
            v_type = "Motocicleta"
        else:
            v_type = "Camión"
            
        placa = utils.generate_placa(estado=state, tipo_vehiculo=v_type)
        
        # Check if exists
        cursor.execute("SELECT 1 FROM vehiculos WHERE placa = ?", (placa,))
        if cursor.fetchone():
            continue

        data = utils.generate_vehiculo_data(placa)
        tc_data = utils.generate_tarjeta_circulacion()
        
        # Insert Owner
        rfc = data["propietario"]["rfc"]
        cursor.execute("INSERT OR IGNORE INTO propietarios (rfc, nombre_completo, domicilio_fiscal) VALUES (?, ?, ?)",
                       (rfc, data["propietario"]["nombre_completo"], data["propietario"]["domicilio_fiscal"]))
        
        # Insert Vehicle
        cursor.execute("INSERT OR IGNORE INTO vehiculos (placa, marca, modelo, color, anio, niv, nci, clase, tipo_vehiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (placa, data["marca"], data["modelo"], data["color"], data["anio"], data["niv"], str(random.randint(1000000, 9999999)), data["clase"], data["tipo_vehiculo"]))
        
        # Insert TC
        cursor.execute("INSERT OR IGNORE INTO tarjetas_circulacion (folio, placa, rfc_propietario, vigencia, estatus) VALUES (?, ?, ?, ?, ?)",
                       (tc_data["folio"], placa, rfc, tc_data["vigencia"], tc_data["estatus"]))
        
        # Insert Robo Status (Mostly clean)
        cursor.execute("INSERT OR IGNORE INTO reportes_robo (placa, tiene_reporte, mensaje) VALUES (?, ?, ?)",
                       (placa, False, "SIN REPORTE DE ROBO"))

    conn.commit()
    conn.close()
    print("Database populated successfully.")

if __name__ == "__main__":
    init_db()
    populate_initial_data()
