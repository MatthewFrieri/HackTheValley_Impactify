import { useEffect, useState } from "react";
import api from "../../utils/api";
import { DASHBOARD_REFRESH_TIME } from "../../utils/constants";
import { Doughnut } from "react-chartjs-2";
import { getNumHits, getValues } from "../../utils/helpers";
import Insights from "./Insights";

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
    const response = await api.get("/users/session/data", {
      params: { session_id: sessionId },
    });

    return response.data.data as DataPoint[];
  } catch (error) {
    console.error("Error fetching session data:", error);
    return []; // Handle error case appropriately
  }
}

export default function BrainHealth({ sessionId }: LiveChartProps) {
  const [health, setHealth] = useState(1);

  useEffect(() => {
    // Function that triggers every second
    const interval = setInterval(() => {
      calculateHealth();
    }, DASHBOARD_REFRESH_TIME);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const calculateHealth = async () => {
    const sessionData = await FetchSessionData(sessionId);
    const values = getValues(sessionData);
    const numHits = getNumHits(values);
    const damage = numHits * 0.05;
    setHealth(1 - damage > 0 ? 1 - damage : 0);
  };

  return (
    <>
      <h1>Health: {health}</h1>
      <Doughnut
        data={{
          labels: ["", ""],
          datasets: [
            {
              data: [1 - health, health],
              backgroundColor: ["red", "green"],
              borderColor: ["black", "black"],
              borderWidth: 1,
            },
          ],
        }}
      />
      <h1>Insights:</h1>
      <Insights health={health} />
    </>
  );
}
