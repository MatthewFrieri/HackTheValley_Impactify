import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import api from "../../utils/api";

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

    // Return the data received from the API
    const values = response.data.map(
      (dataPoint) =>
        dataPoint.pressure_l +
        dataPoint.pressure_r +
        dataPoint.pressure_t +
        dataPoint.pressure_b
    );

    //   return response.data;
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
      label: "My dataset",
      data: [0],
      fill: true,
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

export default function LiveChart({ sessionId }: LiveChartProps) {
  const [data, setData] = useState(initialData);
  let alsoData = initialData;

  useEffect(() => {
    // Function that triggers every second
    const interval = setInterval(() => {
      handleAddEntries();
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Calculate the maximum y-axis value dynamically (110% of highest value in dataset)
  const getMaxValue = () => {
    const allData = data.datasets.flatMap((dataset) => dataset.data);
    const maxValue = Math.max(...allData);
    return Math.round(maxValue * 1.1); // Set max value to 110% of highest value
  };

  // Chart options including dynamic y-axis scale
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: getMaxValue(), // Set the max dynamically
      },
    },
  };

  const addNewEntries = (newValues: number[]) => {
    const NUM_POINTS = 100;
    const currentLength = alsoData.datasets[0].data.length;
    const proposedLength = currentLength + newValues.length;

    const newLabels = Array(
      proposedLength > NUM_POINTS ? NUM_POINTS : currentLength
    ).fill("");

    let newPoints: number[] = [];
    if (proposedLength > NUM_POINTS) {
      newPoints = [
        ...alsoData.datasets[0].data.slice(proposedLength - NUM_POINTS),
        ...newValues,
      ];
    } else {
      newPoints = [...alsoData.datasets[0].data, ...newValues];
    }

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

    const nextValues = [...allSessionValues];
    const currentValues = alsoData.datasets[0].data;
    const areEqual =
      JSON.stringify(nextValues) === JSON.stringify(currentValues);

    if (!areEqual) {
      const valuesToUse =
        alsoData.datasets[0].data.length == 1
          ? allSessionValues
          : allSessionValues.slice(-10);

      addNewEntries(valuesToUse);
    }
  };

  return <Line data={data} options={options} />;
}
