import { HIT_THRESHOLD } from "./constants.ts";

interface DataPoint {
    timestamp: string;
    pressure_l: number;
    pressure_r: number;
    pressure_b: number;
    pressure_t: number;
    accel_x: number;
    accel_y: number;
    accel_z: number;
  }

export function getNumHits(values: number[]) {
    let hitCount = 0;
    let isAboveThreshold = false;

    for (let i = 0; i < values.length; i++) {
      const currentNumber = values[i];

      if (currentNumber > HIT_THRESHOLD && !isAboveThreshold) {
        hitCount++;
        isAboveThreshold = true;
      } else if (currentNumber <= HIT_THRESHOLD) {
        isAboveThreshold = false;
      }
    }
    return hitCount
}


export function getValues(sessionData: DataPoint[]) {
    return sessionData.map(
        (dataPoint) =>{
            const maxPressure = Math.max(dataPoint.pressure_l, dataPoint.pressure_r, dataPoint.pressure_t, dataPoint.pressure_b)
            const maxAcceleration = Math.max(0.5, dataPoint.accel_x, dataPoint.accel_y)
            
            return maxPressure * maxAcceleration
        }
          
      )
}
