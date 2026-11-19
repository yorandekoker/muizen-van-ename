// VOORBEELD (niet getest op echte hardware): een post meldt dat de opdracht gelukt is.
// Werkt op ESP32 en Arduino UNO R4 WiFi (bij R4: <WiFiS3.h> en WiFiSSLClient gebruiken).
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

const char* SSID = "naam-van-de-hotspot";
const char* PASS = "wachtwoord";
const char* HOST = "jouw-app.example.com";   // waar server.js draait
const char* KEY  = "dezelfde-sleutel-als-HW_KEY";
const int POST_NR = 3;                        // post 1, 2 of 3

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) delay(300);
}

void melding(const char* wat) {                // wat = "solved" of "failed"
  WiFiClientSecure client; client.setInsecure(); // voor een echte opstelling: certificaat controleren
  HTTPClient http;
  String url = String("https://") + HOST + "/api/post/" + POST_NR + "/" + wat + "?key=" + KEY;
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST("{}");
  Serial.println(code);
  http.end();
}

void loop() {
  // Hier komt de eigen logica van de post (kabels, stroken, knoppen).
  // Zodra de opdracht gelukt is: servo draaien en melding("solved") sturen.
  delay(1000);
}
