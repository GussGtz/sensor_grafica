#include <Ultrasonic.h>

Ultrasonic ultrasonic(4, 5); // (Trig pin, Echo pin)
int ledR_ultrasonic = 6; // LED Rojo para el ultrasonido
int ledV_ultrasonic = 7; // LED Verde para el ultrasonido

int pinPIR = 3; // Asumiendo que el sensor PIR está conectado al pin digital 3
int ledR_pir = 8; // LED Rojo para el PIR
int ledV_pir = 13; // LED Verde para el PIR

void setup() {
  Serial.begin(9600);
  pinMode(ledR_ultrasonic, OUTPUT);
  pinMode(ledV_ultrasonic, OUTPUT);
  pinMode(ledR_pir, OUTPUT);
  pinMode(ledV_pir, OUTPUT);

  pinMode(pinPIR, INPUT);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    controlLEDs(command);
  }

  // Sensor ultrasonido
  long distance = ultrasonic.distanceRead(CM);
  Serial.print(distance);
  updateLEDs_ultrasonic(distance);

  Serial.print(","); 
  // Sensor PIR
  int movimiento = digitalRead(pinPIR);
  Serial.println(movimiento); // Enviar el estado del sensor PIR a Python
  updateLEDs_pir(movimiento);
  delay(1000); // Espera para evitar múltiples detecciones rápidas
}

void controlLEDs(char command) {
  // Apagar todos los LEDs primero
  digitalWrite(ledR_ultrasonic, LOW);
  digitalWrite(ledV_ultrasonic, LOW);
  digitalWrite(ledR_pir, LOW);
  digitalWrite(ledV_pir, LOW);

  // Encender el LED basado en el comando recibido
  switch (command) {
    case 'R':
      digitalWrite(ledR_ultrasonic, HIGH);
      digitalWrite(ledR_pir, HIGH);
      break;
    case 'V':
      digitalWrite(ledV_ultrasonic, HIGH);
      digitalWrite(ledV_pir, HIGH);
      break;
    default:
      // Si se recibe otro carácter, no hacer nada o apagar todos los LEDs
      break;
  }
}

void updateLEDs_ultrasonic(long distance) {
  // Lógica para actualizar los LEDs del sensor ultrasonido basado en la distancia
  if (distance > 0 && distance < 10) {
    digitalWrite(ledR_ultrasonic, HIGH);
    digitalWrite(ledV_ultrasonic, LOW);
  } else if (distance >= 10 && distance < 20) {
    digitalWrite(ledR_ultrasonic, LOW);
    digitalWrite(ledV_ultrasonic, HIGH);
  } else {
    digitalWrite(ledR_ultrasonic, LOW);
    digitalWrite(ledV_ultrasonic, LOW);
  }
}

void updateLEDs_pir(int movimiento) {
  // Lógica para actualizar los LEDs del sensor PIR basado en el movimiento
  if (movimiento == HIGH) {
    digitalWrite(ledR_pir, HIGH);
    digitalWrite(ledV_pir, LOW);
  } else {
    digitalWrite(ledR_pir, LOW);
    digitalWrite(ledV_pir, HIGH);
  }
}
