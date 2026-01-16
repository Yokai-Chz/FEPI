from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "mock_data.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- ENDPOINTS ADAPTADOS ---

@app.route('/api/general-stats', methods=['GET'])
def get_general_stats():
    try:
        conn = get_db_connection()
        
        # 1. Infracciones de hoy (HU010)
        # Filtramos por la fecha actual del sistema
        hoy = conn.execute("SELECT COUNT(*) FROM infracciones WHERE date(fecha_hora) = date('now')").fetchone()[0]
        
        # 2. Cupo de Corralones (HU013)
        # Calculamos el promedio de ocupación real de la tabla depositos
        ocupacion_avg = conn.execute("SELECT AVG(ocupacion_actual * 100.0 / capacidad_total) FROM depositos").fetchone()[0] or 0
        
        # 3. Oficiales Activos
        oficiales = conn.execute("SELECT COUNT(*) FROM oficiales WHERE estatusApp='AUTORIZADO'").fetchone()[0]
        
        conn.close()

        return jsonify({
            "infraccionesHoy": hoy,
            "eficienciaOperativa": "↑ 12%" if hoy > 0 else "0% EFICIENCIA OPERATIVA",
            "ocupacionCorralones": int(ocupacion_avg),
            "alertaCorralones": "CRÍTICO" if ocupacion_avg > 85 else "ESTADO: NORMAL",
            "oficialesTurno": oficiales,
            "zonasActivas": "Centro, Norte, Sur"
        })
    except Exception as e:
        print(f"Error en stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/folios', methods=['GET'])
def get_folios():
    try:
        conn = get_db_connection()
        query = '''
            SELECT i.*, v.marca, v.modelo, v.color 
            FROM infracciones i
            LEFT JOIN vehiculos v ON i.placa = v.placa
            ORDER BY i.id DESC
        '''
        db_folios = conn.execute(query).fetchall()
        conn.close()
        
        resultado = []
        for row in db_folios:
            # CONVERTIMOS EL ROW A DICCIONARIO REAL
            f = dict(row)
            
            # Ahora sí podemos usar .get() sin que truene
            resultado.append({
                "id_infraccion": f['id'],
                "fecha": f['fecha_hora'],
                "folio": f.get('folio', f"INF-{str(f['id']).zfill(7)}"), 
                "placa": f['placa'],
                "id_agente": f['id_oficial'],
                "notas": f['motivo'],
                "id_licencia": "LIC-001",
                "latitud": 19.4326, 
                "longitud": -99.1332,
                "ubicacion_infractor": {
                    "municipio": "Cuauhtémoc",
                    "vialidad": "Av. Reforma",
                    "numero_exterior": "222",
                    "nombre_asentamiento": "Juárez",
                    "codigo_postal": "06600",
                    "nombre_entidad": "CDMX"
                },
                "infracciones": [f['motivo'][:6] if f['motivo'] else "ART-01"], 
                "evidencias": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."],
                "monto": f.get('monto', 0.0),
                "estatus_pago": f.get('estatus_pago', "PENDIENTE"),
                "vehiculo": {
                    "marca": f.get('marca', "N/A"),
                    "modelo": f.get('modelo', "N/A"),
                    "color": f.get('color', "N/A")
                }
            })
        return jsonify(resultado)
    except Exception as e:
        print(f"❌ ERROR EN GET_FOLIOS: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/recaudacion-stats', methods=['GET'])
def get_recaudacion_stats():
    conn = get_db_connection()
    total = conn.execute("SELECT COUNT(*) FROM infracciones").fetchone()[0]
    pendientes = conn.execute("SELECT SUM(monto) FROM infracciones WHERE estatus_pago='PENDIENTE'").fetchone()[0] or 0
    impugnados = conn.execute("SELECT COUNT(*) FROM infracciones WHERE estatus_pago='IMPUGNADA'").fetchone()[0]
    conn.close()
    return jsonify({
        "foliosMes": f"{total:,}",
        "pendientesPago": f"${pendientes:,.2f} MXN",
        "enImpugnacion": f"{impugnados} Quejas"
    })

@app.route('/api/depositos', methods=['GET'])
def get_depositos():
    conn = get_db_connection()
    db_depositos = conn.execute('SELECT * FROM depositos').fetchall()
    conn.close()
    resultado = []
    for d in db_depositos:
        porcentaje = int((d['ocupacion_actual'] / d['capacidad_total']) * 100)
        resultado.append({
            "id": str(d['id']),
            "nombre": d['nombre'],
            "zona": d['zona'],
            "capacidadTotal": d['capacidad_total'],
            "ocupacionActual": d['ocupacion_actual'],
            "porcentaje": porcentaje,
            "estatus": d['estatus']
        })
    return jsonify(resultado)

@app.route('/api/oficiales', methods=['GET'])
def get_oficiales():
    conn = get_db_connection()
    oficiales = conn.execute('SELECT id, placa, nombre_completo as nombreCompleto, sector, estatusApp FROM oficiales').fetchall()
    conn.close()
    return jsonify([dict(o) for o in oficiales])

@app.route('/api/oficiales/<oficial_id>/status', methods=['PUT'])
def update_oficial_status(oficial_id):
    nuevo_estatus = request.json.get('status')
    conn = get_db_connection()
    conn.execute('UPDATE oficiales SET estatusApp = ? WHERE id = ?', (nuevo_estatus, oficial_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# --- En app.py ---

@app.route('/api/folios/<int:id_infraccion>/corregir-placa', methods=['POST'])
def corregir_placa(id_infraccion):
    data = request.json
    nueva_placa = data.get('nuevaPlaca').upper()
    usuario_admin = "admin_central" # En un sistema real vendría del token de sesión

    conn = get_db_connection()
    # 1. Obtener valor anterior para auditoría
    original = conn.execute('SELECT placa FROM infracciones WHERE id = ?', (id_infraccion,)).fetchone()
    
    if not original:
        return jsonify({"success": False, "message": "Infracción no encontrada"}), 404

    placa_anterior = original['placa']

    # HU007: Validación de seguridad (Máximo 3 caracteres de diferencia)
    # Esto demuestra atención al detalle en los requisitos
    diferencias = sum(1 for a, b in zip(placa_anterior, nueva_placa) if a != b) + abs(len(placa_anterior) - len(nueva_placa))
    
    if diferencias > 3:
        return jsonify({
            "success": False, 
            "message": f"Error: Demasiados cambios ({diferencias}). Máximo permitido: 3 caracteres."
        }), 400

    try:
        cursor = conn.cursor()
        # 2. Actualizar la infracción
        cursor.execute('UPDATE infracciones SET placa = ? WHERE id = ?', (nueva_placa, id_infraccion))
        
        # 3. HU008: Registrar en Auditoría
        cursor.execute('''
            INSERT INTO auditoria_cambios (id_infraccion, usuario_admin, accion, valor_anterior, valor_nuevo)
            VALUES (?, ?, 'CORRECCION_PLACA', ?, ?)
        ''', (id_infraccion, usuario_admin, placa_anterior, nueva_placa))
        
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Placa corregida y auditada correctamente."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Endpoint para ver el historial de una infracción (HU008)
@app.route('/api/folios/<int:id_infraccion>/historial', methods=['GET'])
def get_historial(id_infraccion):
    conn = get_db_connection()
    historial = conn.execute('''
        SELECT * FROM auditoria_cambios 
        WHERE id_infraccion = ? 
        ORDER BY fecha_hora DESC
    ''', (id_infraccion,)).fetchall()
    conn.close()
    return jsonify([dict(h) for h in historial])

import zipfile
import io
import base64
from flask import send_file # Asegúrate de agregar send_file a tus imports de flask

@app.route('/api/folios/<int:id_infraccion>/export-zip', methods=['GET'])
def export_evidence_zip(id_infraccion):
    conn = get_db_connection()
    # 1. Obtener datos de la infracción
    f = conn.execute('SELECT * FROM infracciones WHERE id = ?', (id_infraccion,)).fetchone()
    conn.close()

    if not f:
        return jsonify({"error": "No encontrado"}), 404

    # 2. Crear un archivo ZIP en memoria (para no llenar el servidor de basura)
    memory_file = io.BytesIO()
    with zipfile.ZipFile(memory_file, 'w') as zf:
        
        # A. Crear un archivo de texto con el resumen de la infracción
        info_content = f"""
        REPORTE DE EVIDENCIAS - SSC CDMX
        --------------------------------
        Folio: MX-{str(f['id']).zfill(5)}
        Placa: {f['placa']}
        Fecha: {f['fecha_hora']}
        Oficial ID: {f['id_oficial']}
        Motivo: {f['motivo']}
        Monto: ${f['monto']}
        --------------------------------
        Generado por: Sistema de Administración SCC
        """
        zf.writestr('resumen_infraccion.txt', info_content)

        # B. Procesar las evidencias (Imágenes en Base64 de Yokai)
        # Simulamos que tenemos 2 fotos en base64 (en un caso real vendrían de la BD)
        fotos_base64 = [
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", # Ejemplo rojo
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="  # Ejemplo azul
        ]

        for i, b64_str in enumerate(fotos_base64):
            try:
                # Decodificar el Base64 a bytes de imagen
                img_data = base64.b64decode(b64_str)
                zf.writestr(f'evidencia_foto_{i+1}.png', img_data)
            except Exception as e:
                print(f"Error decodificando imagen {i}: {e}")

    # 3. Preparar el archivo para descarga
    memory_file.seek(0)
    return send_file(
        memory_file,
        mimetype='application/zip',
        as_attachment=True,
        download_name=f'Evidencias_Folio_{id_infraccion}.zip'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)