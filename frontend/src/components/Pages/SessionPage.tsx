import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stats from "../Dashboard/Stats";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../utils/api";
import LiveChart from "../Dashboard/LiveChart";
import BrainHealth from "../Dashboard/BrainHealth";

const SessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState<string | null>(null);
  const [isLiveSession, setIsLiveSession] = useState<boolean>(false);

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await api.get(`/session/${sessionId}`);
      setSessionName(response.data.session_name);
    } catch (error) {
      console.error("Error fetching session details", error);
    }
  };

  useEffect(() => {
    const sessionId = getQueryParams().get("session_id");
    if (sessionId) {
      fetchSessionDetails(sessionId);
    }
    const isLive = getQueryParams().get("live");
    if (isLive) {
      setIsLiveSession(Boolean(isLive));
    }
    console.log(isLive)
  }, [location.search]);

  return (
    <div>
      <h1>My New Session</h1>
      <p>{isLiveSession ? "Live 🔴" : "Not Live"}</p>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} // Navigate back to the previous page
        variant="outlined"
        sx={{ ml: "auto" }} // Ensure the button stays on the far right
      >
        Back
      </Button>

      <LiveChart sessionId={getQueryParams().get("session_id") || ""} />
      <Stats sessionId={getQueryParams().get("session_id") || ""} />
      <BrainHealth sessionId={getQueryParams().get("session_id") || ""} />
    </div>
  );
};

export default SessionPage;
