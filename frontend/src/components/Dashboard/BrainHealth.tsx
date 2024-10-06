import { useEffect, useState } from "react";
import api from "../../utils/api.ts";
import {
  DASHBOARD_REFRESH_TIME,
  NUM_HITS_FOR_DEATH,
} from "../../utils/constants.ts";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { getNumHits, getValues } from "../../utils/helpers.ts";
import Insights from "./Insights.tsx";
import { Box, Grid2, Typography } from "@mui/material";

interface LiveChartProps {
  sessionId: string;
  isLive?: boolean;
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

export default function BrainHealth({ sessionId, isLive }: LiveChartProps) {
  const [health, setHealth] = useState(1);

  useEffect(() => {
    console.log("health changed", health);

    if (health <= 0) {
      const alreadySentText = localStorage.getItem("sent_text");

      if (alreadySentText) {
        if (!Boolean(alreadySentText)) {
          SendText();
          localStorage.setItem("sent_text", "true");
        }
      } else {
        SendText();
        localStorage.setItem("sent_text", "true");
      }
    }
  }, [health]);

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
    // Call first time
    calculateHealth();
    // Function that triggers every second
    const interval = setInterval(() => {
      if (isLive) {
        calculateHealth();
      }
    }, DASHBOARD_REFRESH_TIME);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  });

  const calculateHealth = async () => {
    const sessionData = await FetchSessionData(sessionId);
    const values = getValues(sessionData);
    const numHits = getNumHits(values);
    const health = (NUM_HITS_FOR_DEATH - numHits) / NUM_HITS_FOR_DEATH;
    setHealth(Math.max(0, health));
  };

  return (
    <>
      <Typography variant="h4" gutterBottom textAlign={"left"}>
        Monitor your Brain Health 🧠
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        gutterBottom
        textAlign={"left"}
      >
        Monitor your brain health in real-time to ensure you're playing safely.
      </Typography>

      <Grid2 container alignItems={"center"}>
        <Box sx={{ width: "40%" }}>
          <Doughnut
            data={{
              labels: ["Damage Taken", "Brain Health"],
              datasets: [
                {
                  data: [(1 - health) * 100.0, health * 100.0],
                  backgroundColor: ["#d40d0d", "#0c7015"],
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
                      const label = context.label || "";
                      const value = (context.raw as number) || 0;
                      return `${label}: ${value.toFixed(2)}%`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
        <Box sx={{ width: "60%" }}>
          <Insights health={health} />
        </Box>
      </Grid2>
    </>
  );
}
