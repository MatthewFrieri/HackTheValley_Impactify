import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// Function to get title and message based on health value
const getInsights = (health: number) => {
  if (health === 1) {
    return {
      title: "All Clear!",
      message:
        "Your head has been well-protected. Keep playing safely and maintain your good form.",
    };
  } else if (health > 0.75) {
    return {
      title: "Minor Impacts",
      message:
        "You've taken a few hits, but nothing serious so far. Stay cautious, and be aware of the force of impacts.",
    };
  } else if (health > 0.5) {
    return {
      title: "Moderate Impacts Detected",
      message:
        "You've received some moderate impacts. It's a good idea to monitor the situation closely and avoid further hard hits.",
    };
  } else if (health > 0.25) {
    return {
      title: "Significant Impacts",
      message:
        "You've taken some serious hits. Consider taking a break and assessing if it's safe to continue playing.",
    };
  } else if (health > 0) {
    return {
      title: "Critical Impact Detected",
      message:
        "You've experienced a heavy blow to the head. Immediate medical attention is recommended to ensure there are no long-term effects.",
    };
  } else {
    return {
      title: "Emergency Situation",
      message:
        "Severe trauma detected. Immediate medical attention is necessary. Stop playing and seek emergency assistance right away.",
    };
  }
};

type InsightsProps = {
  health: number;
};

export const Insights: React.FC<InsightsProps> = ({ health }) => {
  const { title, message } = getInsights(health);

  return (
    <Card sx={{ maxWidth: 400, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Insights;
