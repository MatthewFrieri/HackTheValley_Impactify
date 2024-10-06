import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

// Function to get title and message based on health value
const getInsights = (health: number) => {
  if (health === 1) {
    return {
      title: "🟢 All Clear",
      messages: [
        "Your head has been well-protected. Keep playing safely and maintain your good form.",
        "Protecting your brain is key to long-term health.",
        "Remember to stay aware of your surroundings, follow safety protocols, and listen to your body. Keep up the good work and enjoy the game!"
      ]
    };
  } else if (health > 0.75) {
    return {
      title: "🟢 Minor Impacts",
      messages: [
        "You've taken a few hits, but nothing serious so far. Stay cautious, and be aware of the force of impacts.",
        "It’s normal to feel some bumps along the way, but keeping track of your hits is crucial.",
        "Monitor how you feel and take breaks if needed. Prioritize your well-being—your brain will thank you!"
      ]
    };
  } else if (health > 0.5) {
    return {
      title: "🟡 Moderate Impacts Detected",
      messages: [
        "You've received some moderate impacts. It's a good idea to monitor the situation closely and avoid further hard hits.",
        "Moderate impacts can add up. Pay close attention to any changes in how you feel —— dizziness, confusion, or headaches are signals to take a break.",
        "Consider adjusting your strategy to protect your head and keep enjoying the game safely!"
      ]
    };
  } else if (health > 0.25) {
    return {
      title: "🔴 Significant Impacts",
      messages: [
        "You've taken some serious hits. Consider taking a break and assessing if it's safe to continue playing.",
        "Significant impacts can have lasting effects. Take a moment to evaluate how you feel —— rest is essential.",
        "If you're experiencing any symptoms like headaches or confusion, it's best to step back."
      ]
    };
  } else if (health > 0) {
    return {
      title: "🔴 Critical Impact Detected",
      messages: [
        "You've experienced a heavy blow to the head. Immediate medical attention is recommended to ensure there are no long-term effects.",
        "It's crucial to get checked by a healthcare professional as soon as possible. Trust your instincts—taking care of your brain is vital for your health.",
      ]
    };
  } else {
    return {
      title: "🚨 Emergency Situation",
      message:
        "Severe trauma detected. Immediate medical attention is necessary. Stop playing and seek emergency assistance right away!",
    };
  }
};

type InsightsProps = {
  health: number;
};

export const Insights: React.FC<InsightsProps> = ({ health }) => {
  const { title, messages } = getInsights(health);

  return (
    <Card sx={{ width: "85%", height: "50vh", margin: "20px auto", padding: "20px", boxShadow: 5 }}>
      <Typography variant="h5" component="div" textAlign={"left"}>
      Insights ✨ 
      </Typography>
      <Typography variant="subtitle1" component="div" textAlign={"left"}>
      See the insights below to understand how well your brain is protected during the session.
      </Typography>
      <CardContent>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      {messages?.map((message, index) => (
          <>
            <Typography variant="body1" color="text.secondary" marginTop={2}>
              {message}
            </Typography>
          </>
        ))
      }
      
      </CardContent>
    </Card>
  );
};

export default Insights;
