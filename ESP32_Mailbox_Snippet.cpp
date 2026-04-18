// ESP32 Mailbox Logic Snippet (Snippet for USER)
// Place this in your handleSync() or sendData() function

void syncWithCloud() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Construct the standard sensor payload
    StaticJsonDocument<256> doc;
    doc["temperature"] = readTemperature();
    doc["humidity"] = readHumidity();
    doc["mq135_raw"] = analogRead(MQ135_PIN);
    doc["mq7_raw"] = analogRead(MQ7_PIN);
    doc["device"] = "ESP32_EcoAir";

    String requestBody;
    serializeJson(doc, requestBody);

    int httpResponseCode = http.POST(requestBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      StaticJsonDocument<256> resDoc;
      deserializeJson(resDoc, response);

      // --- MAILBOX COMMAND LOGIC ---
      const char* command = resDoc["command"]; // "RELAY_ON" or "RELAY_OFF"
      
      if (strcmp(command, "RELAY_ON") == 0) {
        digitalWrite(RELAY_PIN, HIGH);
        Serial.println("MAILBOX: Relay Turned ON");
      } else if (strcmp(command, "RELAY_OFF") == 0) {
        digitalWrite(RELAY_PIN, LOW);
        Serial.println("MAILBOX: Relay Turned OFF");
      }
    }
    http.end();
  }
}
