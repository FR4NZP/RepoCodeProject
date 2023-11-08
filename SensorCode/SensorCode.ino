#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFiManager.h>
#include "config.h" // Einbinden der Konfigurationsdatei



#define DHTPIN 5      // Der DHT11-Sensor ist an Pin 5 (D1) angeschlossen
#define DHTTYPE DHT11 // Verwende DHT11 Sensor, du kannst DHT22 oder DHT21 verwenden
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);  // Beginnen Sie die serielle Kommunikation mit der Baudrate 115200

  // Verbinden Sie mit WiFi-Netzwerk
  Serial.print("Verbinde mit ");


      WiFiManager wifiManager;
    // wifiManager.resetSettings();

    if (!wifiManager.autoConnect("franz_ap")) {
        Serial.println("Failed to connect and hit timeout");
        ESP.reset();
        delay(1000);
    }

    Serial.println("Connected to WiFi!");
  Serial.println("IP Adresse: ");
  Serial.println(WiFi.localIP());  // Drucken Sie die IP-Adresse des ESP8266

  // Verbindung zum MQTT-Broker herstellen
 client.setServer(MQTT_SERVER, MQTT_PORT);

  // Warte, bis die Verbindung hergestellt ist
  while (!client.connected()) {
    if (client.connect("ESP-franz")) {
      Serial.println("Verbunden mit MQTT-Broker");
    } else {
      Serial.print("Fehler beim Verbinden mit MQTT-Broker, rc=");
      Serial.print(client.state());
      Serial.println("Warte 5 Sekunden, bevor erneuter Versuch...");
      delay(5000);
    }
  }
}

void loop() {
  // Lese Temperatur- und Luftfeuchtigkeitswerte aus dem DHT11-Sensor
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Fehler beim Lesen des DHT11-Sensors!");
    return;
  }

  // MQTT-Nachrichten senden
  char temperatureMessage[50];
  char humidityMessage[50];

  snprintf(temperatureMessage, sizeof(temperatureMessage), "%.2f", t);
  snprintf(humidityMessage, sizeof(humidityMessage), "%.2f", h);

  // Nachrichten in individuelle Themen für Temperatur und Luftfeuchtigkeit senden
  client.publish("dp2/Franz/Temperatur", temperatureMessage);
  client.publish("dp2/Franz/Luftfeuchtigkeit", humidityMessage);

  Serial.println("Temperatur erfolgreich gesendet: " + String(temperatureMessage));
  Serial.println("Luftfeuchtigkeit erfolgreich gesendet: " + String(humidityMessage));

  delay(20000); // Warte 2 Sekunden, bevor du die Werte erneut ausliest
}