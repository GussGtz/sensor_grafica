import serial
import mysql.connector

# Configuración de la conexión a la base de datos MySQL
db_config = {
    'host': "localhost",
    'user': "root",
    'password': "root",
    'database': "sm52_arduino"
}

# Intentar conectar a la base de datos
try:
    db = mysql.connector.connect(**db_config)
    cursor = db.cursor()
except mysql.connector.Error as err:
    print(f"Error al conectar a MySQL: {err}")
    exit(1)

# Abrir conexión serial
arduino = serial.Serial('/dev/cu.usbserial-1410', 9600, timeout=1)

try:
    while True:
        data = arduino.readline().decode().strip()  # Leer y decodificar datos del Arduino
        if data:
            movimiento = int(data)  # Convertir el estado del sensor PIR a entero (0 o 1)
            dato_sensor = movimiento  # Asumiendo que dato_sensor es el movimiento detectado
            if movimiento == 1:
                led_color = 'azul'
                arduino.write(b'R')  # Enviar comando para LED Rojo
            else:
                led_color = 'rojo'
                arduino.write(b'V')  # Enviar comando para LED Verde

            sql = "INSERT INTO detecciones (mensaje, dato_sensor, color_led, hora) VALUES (%s, %s, %s, NOW())"
            cursor.execute(sql, (data, dato_sensor, led_color))
            db.commit()  # Corregir la indentación
            estado_mov = "Detectado" if movimiento == 1 else "No detectado"
            print(f"Movimiento: {estado_mov}, LED: {led_color}")
            
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
