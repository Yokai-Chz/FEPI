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

    # --- 2. Random Data Generation (20 vehicles) ---
    print("Generating 20 random vehicles (Autos, Motos, Camiones)...")
    
    states_list = list(utils.STATE_SERIES_AUTO.keys())
    
    for _ in range(20):
        # Determine State (60% CDMX, 40% Others to ensure more CDMX examples)
        if random.random() < 0.6:
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
        
        # --- Generate Stolen Status (20% chance for any vehicle, higher if CDMX just for variety) ---
        is_stolen = random.random() < 0.25 # 25% chance of being stolen
        
        if is_stolen:
            # Stolen Vehicle Data
            mensaje = "CON REPORTE DE ROBO"
            entidad_robo = "Fiscalía CDMX" if state == "CDMX" else f"Fiscalía {state}"
            fecha_robo = fake.date_between(start_date='-1y', end_date='today').strftime('%Y-%m-%d')
            folio_robo = f"CI-{fake.bothify(text='????/##/##-##')}"
            
            cursor.execute('''INSERT OR IGNORE INTO reportes_robo 
                              (placa, tiene_reporte, mensaje, entidad, fecha_averiguacion, folio_reporte) 
                              VALUES (?, ?, ?, ?, ?, ?)''',
                           (placa, True, mensaje, entidad_robo, fecha_robo, folio_robo))
            
            # If stolen, maybe the TC is also expired or invalid? Let's keep it random or force it.
            # Let's force TC status to 'ROBADA' or 'VENCIDA' for realism
            cursor.execute("UPDATE tarjetas_circulacion SET estatus = 'SUSPENDIDA' WHERE placa = ?", (placa,))
            
        else:
            # Clean Vehicle
            cursor.execute("INSERT OR IGNORE INTO reportes_robo (placa, tiene_reporte, mensaje) VALUES (?, ?, ?)",
                           (placa, False, "SIN REPORTE DE ROBO"))
        
        # --- 3. Infracciones de prueba para la Web Admin ---
        print("Generating sample infractions...")
        infracciones_demo = [
            ('MX-1001', 'A01-AAA', '982734', 1250.00, 'PENDIENTE', 'Exceso de velocidad'),
            ('MX-1002', 'ROB-666', '771022', 3500.00, 'LIQUIDADA', 'Estacionarse en lugar prohibido'),
            ('MX-1003', 'A01-AAA', '830193', 850.00, 'IMPUGNADA', 'No usar cinturón')
        ]
        
        for inf in infracciones_demo:
            cursor.execute('''INSERT OR IGNORE INTO infracciones 
                            (folio, placa, id_oficial, monto, estatus_pago, motivo) 
                            VALUES (?, ?, ?, ?, ?, ?)''', inf)
        
        print("Generating officers...")
        oficiales_demo = [
            ('1', '982734', 'Ríos Rivera Fernanda', 'Zona Centro (01)', '1234'),
            ('2', '771022', 'Hernández Mora Jorge', 'Zona Oriente (04)', '4321'),
            ('3', '830193', 'Castillo Vera Sofía', 'Zona Poniente (02)', '0000')
        ]

        for ofi in oficiales_demo:
            cursor.execute('''INSERT OR REPLACE INTO oficiales 
                            (id, placa, nombre_completo, sector, password) 
                            VALUES (?, ?, ?, ?, ?)''', ofi)
            
        # 1. Insertar un vehículo de prueba (para que el JOIN funcione)
    
    cursor.execute('''
        INSERT OR REPLACE INTO vehiculos (placa, marca, modelo, color, anio, niv)
        VALUES ('ABC-1234', 'Nissan', 'Versa', 'Rojo', 2022, '1234567890ABCDEFG')
    ''')
    

    # 2. Insertar una infracción real (HU001 / HU016)
    # Nota: Asegúrate de que los nombres de las columnas coincidan con tu tabla 'infracciones'
    cursor.execute('''
        INSERT OR REPLACE INTO infracciones 
        (folio, placa, id_oficial, monto, estatus_pago, motivo, fecha_hora)
        VALUES 
        ('MX-99201', 'ABC-1234', '982734', 1085.00, 'PENDIENTE', 
         'ART-30-I: Estacionarse sobre banquetas', '2026-01-16 10:15:00')
    ''')

    # 3. Insertar otra infracción para ver las estadísticas (HU010)
    cursor.execute('''
        INSERT OR REPLACE INTO infracciones 
        (folio, placa, id_oficial, monto, estatus_pago, motivo, fecha_hora)
        VALUES 
        ('MX-88500', 'ABC-1234', '771022', 2500.50, 'IMPUGNADA', 
         'ART-11: Carril exclusivo', '2026-01-16 11:30:00')
    ''')
    
    # Corralones
    
    corralones = [
        ('Depósito Centro (Zócalo)', 'Centro', 1000, 850),
        ('Depósito Oriente (Iztapalapa)', 'Oriente', 2500, 1200),
        ('Depósito Norte (Gustavo A. Madero)', 'Norte', 1800, 400),
        ('Depósito Poniente (Álvaro Obregón)', 'Poniente', 1500, 1450)
    ]
    
    for c in corralones:
        # Calculamos estatus basado en ocupación para la HU013
        porcentaje = (c[3] / c[2]) * 100
        estatus = 'CRÍTICO' if porcentaje > 90 else 'MODERADO' if porcentaje > 70 else 'DISPONIBLE'
        
        cursor.execute('''
            INSERT OR REPLACE INTO depositos (nombre, zona, capacidad_total, ocupacion_actual, estatus)
            VALUES (?, ?, ?, ?, ?)
        ''', (c[0], c[1], c[2], c[3], estatus))

    conn.commit()
    conn.close()
    print("Database populated successfully.")

if __name__ == "__main__":
    init_db()
    populate_initial_data()
