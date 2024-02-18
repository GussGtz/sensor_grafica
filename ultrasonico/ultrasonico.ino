int pinPIR = 3; // Asumiendo que el sensor PIR está conectado al pin digital 2
int ledR = 8; // LED Rojo
int ledA = 12; // LED Amarillo
int ledV = 13; // LED Verde

void setup() {
  Serial.begin(9600);
  pinMode(pinPIR, INPUT);
  pinMode(ledR, OUTPUT);
  pinMode(ledA, OUTPUT);
  pinMode(ledV, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    controlLEDs(command);
  }

  int movimiento = digitalRead(pinPIR);
  Serial.println(movimiento); // Enviar el estado del sensor PIR a Python
  delay(1000); // Espera para evitar múltiples detecciones rápidas
}

void controlLEDs(char command) {
  digitalWrite(ledR, LOW);
  digitalWrite(ledA, LOW);
  digitalWrite(ledV, LOW);
  
  switch (command) {
    case 'R':
      digitalWrite(ledR, HIGH);
      break;
    case 'A':
      digitalWrite(ledA, HIGH);
      break;
    case 'V':
      digitalWrite(ledV, HIGH);
      break;
  }
}
