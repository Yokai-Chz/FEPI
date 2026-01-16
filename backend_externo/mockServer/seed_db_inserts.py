# seed_db.py
import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "mock_data.db")

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

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
            INSERT INTO depositos (nombre, zona, capacidad_total, ocupacion_actual, estatus)
            VALUES (?, ?, ?, ?, ?)
        ''', (c[0], c[1], c[2], c[3], estatus))


    conn.commit()
    conn.close()
    print("Datos de prueba insertados correctamente.")

if __name__ == "__main__":
    seed()