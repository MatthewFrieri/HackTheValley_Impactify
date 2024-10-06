import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stats from "../Dashboard/Stats";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StopCircle from "@mui/icons-material/StopCircle";
import api from "../../utils/api";
import LiveChart from "../Dashboard/LiveChart";
import BrainHealth from "../Dashboard/BrainHealth";
import styles from "./LandingPage.module.css";
import { useSnackbar } from "notistack";
import StopSession from "../buttons/StopSession";

const SessionPage: React.FC = () => {
  // Get the current location and navigate function from the router
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // Set the session name and if the session is live
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [isLiveSession, setIsLiveSession] = useState<boolean>(false);
  // Get the query parameters from the URL
  const getQueryParams = () => new URLSearchParams(location.search);
  const sessionId = getQueryParams().get("session_id") || "";
  const userId = localStorage.getItem("user_id") || "";

  const fetchSessionDetails = async () => {
    try {
      const url = new URL(`/users/session/all/`, window.location.origin);
      // Append the session ID to the URL
      url.searchParams.append("user_id", userId);
      // Navigate to the new URL
      const response = await api.get(url.pathname + url.search);
      // Find the session with the matching ID
      const session = response.data.data.find(
        (session: any) => session.session_id === sessionId
      );
      // Set the session name
      setSessionName(session.session_name);
    } catch (error: any) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
  };

  const stopSession = async () => {
    // Mark the session as not live
    setIsLiveSession(false);
    // Fetch the session details
    fetchSessionDetails();
  };

  useEffect(() => {
    // Get the session details on mount
    fetchSessionDetails();
    // Check if the session is live
    const isLive = getQueryParams().get("live");
    // If the session is live, set the state
    setIsLiveSession(isLive === "true");
  }, [location.search]);

  return (
    <Box className={styles.sessionBox}>
      <Box className={styles.headerBox}>
        <Typography variant="h6" gutterBottom>
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            size="small"
            sx={{ ml: "auto" }}
          >
            <ArrowBackIcon sx={{ color: "green" }} />
          </Button>
          {isLiveSession ? "🔴" : "🟢"} {sessionName}
        </Typography>
        {isLiveSession && <StopSession onStopSession={stopSession} />}
      </Box>
      <Typography variant="h3" gutterBottom textAlign={"left"}>
        <strong>Live Impact</strong>
      </Typography>
      <LiveChart sessionId={sessionId} isLive={isLiveSession} />
      <Stats sessionId={sessionId} isLive={isLiveSession} />
      <BrainHealth sessionId={sessionId} isLive={isLiveSession} />
    </Box>
  );
};

export default SessionPage;
