import { Line } from "react-chartjs-2";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS } from "chart.js";
import { useEffect, useState } from "react";
import api from "../../utils/api.ts";
import { DASHBOARD_REFRESH_TIME } from "../../utils/constants.tsx";
import { getValues } from "../../utils/helpers.tsx";

ChartJS.register(zoomPlugin.default);

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
    const response = await api.get("/users/session/data/", {
      params: { session_id: sessionId },
    });

    // Return the data received from the API
    const values = getValues(response.data.data as DataPoint[]);

    return values;
  } catch (error) {
    console.error("Error fetching session data:", error);
    return []; // Handle error case appropriately
  }
}

// Initial chart data
const initialData = {
  labels: [""],
  datasets: [
    {
      label: "Impact",
      data: [0],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

export default function LiveChart({ sessionId, isLive }: LiveChartProps) {
  const [data, setData] = useState(initialData);
  let alsoData = initialData;

  useEffect(() => {
    // Call function first time
    handleAddEntries();
    // Function that triggers every second
    const interval = setInterval(() => {
      if (isLive) {
        handleAddEntries();
      }
    }, DASHBOARD_REFRESH_TIME);
    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [isLive]);

  // Calculate the maximum y-axis value dynamically (110% of highest value in dataset)
  const getMaxValue = () => {
    const allData = data.datasets.flatMap((dataset) => dataset.data);
    const maxValue = Math.max(...allData);
    return Math.round(maxValue * 1.1); // Set max value to 110% of highest value
  };

  const addNewEntries = (newValues: number[]) => {
    const currentLength = alsoData.datasets[0].data.length;
    const proposedLength = currentLength + newValues.length;

    const newLabels = Array(proposedLength).fill("");
    const newPoints = [...alsoData.datasets[0].data, ...newValues];

    const newData = {
      labels: newLabels,
      datasets: [
        {
          ...alsoData.datasets[0],
          data: newPoints,
        },
      ],
    };

    alsoData = newData;
    setData(newData);
  };

  const handleAddEntries = async () => {
    const allSessionValues = await FetchSessionData(sessionId);

    const potentialValues = [0, ...allSessionValues];
    const currentValues = alsoData.datasets[0].data;
    const areEqual =
      JSON.stringify(potentialValues) === JSON.stringify(currentValues);

    if (!areEqual) {
      const valuesToUse =
        alsoData.datasets[0].data.length == 1
          ? allSessionValues
          : allSessionValues.slice(-10);

      addNewEntries(valuesToUse);
    } else {
      // do nothing
    }
  };

  return (
    <Line
      data={data}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: getMaxValue(), // Set the max dynamically
          },
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
              scaleMode: "x",
            },
            zoom: {
              wheel: {
                enabled: true, // Enable wheel zooming
              },
              mode: "x",
            },
          },
        },
      }}
    />
  );
}
