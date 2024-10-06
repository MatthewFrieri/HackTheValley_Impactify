#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h> 
#include <WiFi.h>        
#include <HTTPClient.h>  

const char* ssid = "Naresh Godwin (2)";
const char* password = "12345678";
const char* serverUrl = "http://104.131.48.249:8000/users/session/data/";

Adafruit_MPU6050 mpu;

#define NUM_FSR 4


const int fsrPins[NUM_FSR] = {36, 39, 34, 35};
const float sensitivity = 0.01;


const float R_FIXED = 2000.0;


const float VCC = 3.3;


float mapFsrResistanceToForce(float resistance) {
  if (resistance == 0) return 0;
  float force = (1000.0 / resistance) * 1000.0; 
  return force;
}

int loopCounter = 0; 
StaticJsonDocument<1000> jsonArrayDoc; 
JsonArray dataArray; // JSON array to accumulate data

void setup() {
  pinMode(13, OUTPUT);
  pinMode(18, OUTPUT);

  digitalWrite(18, HIGH);

  Serial.begin(115200);

  for (int i = 0; i < NUM_FSR; i++) {
      pinMode(fsrPins[i], INPUT);
    }
  
  if (!mpu.begin()) {
    while (1) {
      delay(10);
    }
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  dataArray = jsonArrayDoc.to<JsonArray>();
}

void loop() {
 

  float weight[4];

  for (int i = 0; i < NUM_FSR; i++) {
      int rawValue = analogRead(fsrPins[i]);
      float voltage = rawValue * (VCC / 4095.0); 
      float fsrResistance = (VCC - voltage) * R_FIXED / voltage;
      float force = mapFsrResistanceToForce(fsrResistance);
      
      weight[i] = force;
    }

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  JsonObject jsonObj = dataArray.createNestedObject();
  jsonObj["acceleration"]["x"] = a.acceleration.x;
  jsonObj["acceleration"]["y"] = a.acceleration.y;
  jsonObj["acceleration"]["z"] = a.acceleration.z;
  jsonObj["pressures"]["left"] = weight[0];
  jsonObj["pressures"]["right"] = weight[1];
  jsonObj["pressures"]["back"] = weight[2];
  jsonObj["pressures"]["top"] = weight[3];

  loopCounter++;

  if (loopCounter == 10) {
    if (WiFi.status() == WL_CONNECTED) {
      digitalWrite(13, HIGH);
      digitalWrite(18, LOW);

      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      String jsonPacket;
      serializeJson(jsonArrayDoc, jsonPacket);

      int httpResponseCode = http.POST(jsonPacket);
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.println(jsonPacket); 
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }

      http.end();
      
      
      dataArray.clear();
      loopCounter = 0; 
    } else {
      digitalWrite(13, LOW);
      digitalWrite(18, HIGH);
      Serial.println("WiFi Disconnected");
    }
  }

  delay(50); 
}