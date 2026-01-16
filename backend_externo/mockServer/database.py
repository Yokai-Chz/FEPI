import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "mock_data.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    
    # --- En database.py, dentro de init_db() ---
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS auditoria_cambios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_infraccion INTEGER,
        usuario_admin TEXT,
        accion TEXT, -- 'CORRECCION_PLACA', 'ANULACION'
        valor_anterior TEXT,
        valor_nuevo TEXT,
        fecha_hora TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (id_infraccion) REFERENCES infracciones (id)
    )
    ''')
    
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS oficiales (
        id TEXT PRIMARY KEY,
        placa TEXT UNIQUE,
        nombre_completo TEXT,
        sector TEXT,
        password INTEGER NOT NULL, -- NIP para el Login
        estatusApp TEXT DEFAULT 'AUTORIZADO' -- AUTORIZADO o INACTIVO
    )
    ''')

    # Table: Propietarios
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS propietarios (
        rfc TEXT PRIMARY KEY,
        nombre_completo TEXT,
        domicilio_fiscal TEXT
    )
    ''')
    
    cursor.execute('''
CREATE TABLE IF NOT EXISTS depositos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    zona TEXT NOT NULL,
    capacidad_total INTEGER NOT NULL,
    ocupacion_actual INTEGER DEFAULT 0,
    estatus TEXT DEFAULT 'DISPONIBLE'
)
''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS infracciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        folio TEXT UNIQUE,
        placa TEXT,
        fecha_hora TEXT DEFAULT (datetime('now')),
        id_oficial TEXT,
        monto REAL,
        estatus_pago TEXT DEFAULT 'PENDIENTE', -- PENDIENTE, PAGADO, IMPUGNADO
        motivo TEXT,
        evidencia_url TEXT
    )
    ''')

    # Table: Vehiculos (Combines SEMOVI and REPUVE general info)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vehiculos (
        placa TEXT PRIMARY KEY,
        marca TEXT,
        modelo TEXT,
        color TEXT,
        anio INTEGER,
        niv TEXT,
        nci TEXT,
        clase TEXT DEFAULT 'Automóvil',
        tipo_vehiculo TEXT DEFAULT 'Sedan',
        num_puertas INTEGER DEFAULT 4,
        pais_origen TEXT DEFAULT 'México'
    )
    ''')

    # Table: Tarjetas de Circulacion (Links Vehicle to Owner)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tarjetas_circulacion (
        folio TEXT PRIMARY KEY,
        placa TEXT,
        rfc_propietario TEXT,
        vigencia DATE,
        estatus TEXT DEFAULT 'VIGENTE',
        FOREIGN KEY (placa) REFERENCES vehiculos (placa),
        FOREIGN KEY (rfc_propietario) REFERENCES propietarios (rfc)
    )
    ''')

    # Table: Reportes de Robo (REPUVE specific)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reportes_robo (
        placa TEXT PRIMARY KEY,
        tiene_reporte BOOLEAN,
        mensaje TEXT,
        entidad TEXT,
        fecha_averiguacion DATE,
        folio_reporte TEXT,
        FOREIGN KEY (placa) REFERENCES vehiculos (placa)
    )
    ''')

    # Table: Licencias
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS licencias (
        numero_licencia TEXT PRIMARY KEY,
        tipo TEXT,
        estatus TEXT,
        fecha_vencimiento DATE
    )
    ''')

    # Table: Lineas de Captura (Finanzas)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lineas_captura (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        linea_captura TEXT NOT NULL UNIQUE,
        placa TEXT NOT NULL,
        folio_infraccion TEXT NOT NULL,
        id_oficial TEXT NOT NULL,
   
        -- Montos (SQLite usa REAL para números con decimales)
        monto_total REAL NOT NULL,
        monto_con_descuento REAL NOT NULL,
        ahorro REAL NOT NULL,
   
        -- En SQLite no hay ARRAYS, se recomienda guardar como string JSON
        -- o una lista separada por comas
        conceptos TEXT NOT NULL,
   
        -- Fechas (Se guardan como strings en formato ISO8601)
        fecha_creacion TEXT DEFAULT (datetime('now')),
        fecha_limite_descuento TEXT NOT NULL,
        fecha_vencimiento TEXT NOT NULL,
   
        -- Estatus con restricción para simular el ENUM
        estatus TEXT DEFAULT 'PENDIENTE' CHECK (estatus IN ('PENDIENTE', 'PAGADA', 'VENCIDA', 'CANCELADA'))
    );
    ''')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")

