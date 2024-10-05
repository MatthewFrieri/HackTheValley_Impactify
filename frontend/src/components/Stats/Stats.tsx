import { useEffect, useState } from "react";
import api from "../../utils/api";
import { HIT_THRESHOLD } from "../../utils/constants";

interface LiveChartProps {
  sessionId: string;
}

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

// Fetches session data based on the session ID stored in local storage
async function FetchSessionData(sessionId: string) {
  try {
    // Make the API call to fetch session stats
    const response = await api.get<DataPoint[]>("/users/session/data", {
      params: { session_id: sessionId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching session data:", error);
    return []; // Handle error case appropriately
  }
}

export default function NumHits({ sessionId }: LiveChartProps) {
  const [numHits, setNumHits] = useState(0);
  const [biggestHit, setBiggestHit] = useState(0);
  const [mostVulnerable, setMostVulnerable] = useState("...");

  useEffect(() => {
    // Function that triggers every second
    const interval = setInterval(() => {
      calculateStats();
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const calculateStats = async () => {
    const sessionData = await FetchSessionData(sessionId);
    const values = sessionData.map(
      (dataPoint) =>
        dataPoint.pressure_l +
        dataPoint.pressure_r +
        dataPoint.pressure_t +
        dataPoint.pressure_b
    ); // SAME FORMULA AS LIVE CHART

    // Calculate numHits
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
    setNumHits(hitCount);

    // Calculate biggestHit
    setBiggestHit(Math.round(Math.max(...values)));

    // Calculate vulnerableSide
    const leftDamage: [number, string] = [
      sessionData
        .map((dataPoint) => dataPoint.pressure_l)
        .reduce((a, b) => a + b, 0),
      "Left",
    ];
    const rightDamage: [number, string] = [
      sessionData
        .map((dataPoint) => dataPoint.pressure_r)
        .reduce((a, b) => a + b, 0),
      "Right",
    ];
    const topDamage: [number, string] = [
      sessionData
        .map((dataPoint) => dataPoint.pressure_t)
        .reduce((a, b) => a + b, 0),
      "Top",
    ];
    const backDamage: [number, string] = [
      sessionData
        .map((dataPoint) => dataPoint.pressure_b)
        .reduce((a, b) => a + b, 0),
      "Back",
    ];

    const sides: [number, string][] = [
      leftDamage,
      rightDamage,
      topDamage,
      backDamage,
    ];

    sides.sort((a, b) => b[0] - a[0]);

    setMostVulnerable(sides[0][1]);
  };

  return (
    <>
      <div>
        <p># hits taken:</p>
        <h1>{numHits}</h1>
      </div>
      <div>
        <p>biggest hit:</p>
        <h1>{biggestHit}</h1>
      </div>
      <div>
        <p>most vulnerable</p>
        <h1>{mostVulnerable}</h1>
      </div>
    </>
  );
}
