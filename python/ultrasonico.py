import serial
import mysql.connector
from datetime import datetime

# Configuración de la conexión a la base de datos MySQL
db_config = {
    'host': "localhost",
    'user': "root",
    'password': "",
    'database': "arduino"
}

try:
    db = mysql.connector.connect(**db_config)
    cursor = db.cursor()
except mysql.connector.Error as err:
    print(f"Error al conectar a MySQL: {err}")
    exit(1)

# Abrir conexión serial
arduino_port = 'COM6' 
arduino_baudrate = 9600
arduino_timeout = 1
arduino = serial.Serial(arduino_port, arduino_baudrate, timeout=arduino_timeout)

try:
    while True:
        # Leer datos desde Arduino
        data = arduino.readline().decode().strip()
        if data:
            datos_separados = data.split(',')
            if len(datos_separados) == 2:
                distancia = int(datos_separados[0])
                movimiento = int(datos_separados[1])
                dato_sensor = movimiento
                if movimiento == 1:
                    mensaje_movimiento = "Se detectó movimiento"
                    color_led = 'azul'
                else:
                    mensaje_movimiento = "No se detectó movimiento"
                    color_led = 'rojo'
                    try:
                        arduino.write(b'V')  # Enviar comando para LED Verde
                    except serial.SerialException:
                        print("Error al escribir en el puerto serial.")
                mensaje_distancia = f"La distancia es: {distancia} cm"
            else:
                color_led = 'rojo'
                mensaje_movimiento = "No se detectó movimiento"
                mensaje_distancia = "N/A"
                try:
                    arduino.write(b'V')  # Enviar comando para LED Verde
                except serial.SerialException:
                    print("Error al escribir en el puerto serial.")

            # Consultas SQL para la base de datos
            sql = "INSERT INTO detecciones (mensaje, dato_sensor, color_led, hora) VALUES (%s, %s, %s, %s)"
            sql2 = "INSERT INTO tb_puerto_serial(mensaje, distancia, fecha) VALUES (%s, %s, %s)"

            # Obtener la hora actual
            hora_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Ejecutar las consultas SQL
            cursor.execute(sql, (mensaje_movimiento, dato_sensor, color_led, hora_actual))
            db.commit()

            cursor.execute(sql2, (mensaje_distancia, distancia, hora_actual))
            db.commit()

            # Imprimir información
            estado_mov = "Detectado" if movimiento == 1 else "No detectado"
            print(f"Distancia: {distancia}, Pir: {estado_mov}")

except KeyboardInterrupt:
    print("Programa terminado por el usuario")
except mysql.connector.Error as err:
    print(f"Error al interactuar con MySQL: {err}")
finally:
    # Cerrar conexiones
    if db.is_connected():
        cursor.close()
        db.close()
    arduino.close()
