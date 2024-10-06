import { useEffect, useState } from "react";
import api from "../../utils/api";
import { DASHBOARD_REFRESH_TIME } from "../../utils/constants";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { getNumHits, getValues } from "../../utils/helpers";
import Insights from "./Insights";
import { Box, Grid2, Typography } from "@mui/material";

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

  async function SendText() {
    console.log("sending text");

    const userId = localStorage.getItem("user_id");
    if (userId) {
      console.log("USER_ID:", userId);

      try {
        // Make the API call to send text message
        const response = await api.get("/users/sms/", {
          params: { user_id: userId },
        });
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    }
  }

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
      <Typography variant="h4" gutterBottom textAlign={"left"}>
        Your Brain Health ✔
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom textAlign={"left"}>
        Monitor your brain health in real-time to ensure you're playing safely.
      </Typography>
      <button onClick={SendText}>Send text</button>

      <Grid2 container>
        <Box sx={{ width: '40%' }}>
          <Doughnut
            data={{
              labels: ["Damage Taken", "Brain Health"],
              datasets: [
                {
                  data: [(1 - health) * 100.0, health * 100.0],
                  backgroundColor: ["red", "green"],
                  borderColor: ["black", "black"],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              maintainAspectRatio: true,
              responsive: true,
              aspectRatio: 1,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || '';
                      const value = context.raw as number || 0;
                      return `${label}: ${value.toFixed(2)}%`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
        <Box sx={{ width: '60%' }}>
          <Insights health={health} />
        </Box>
      </Grid2>
    </>
  );
}
