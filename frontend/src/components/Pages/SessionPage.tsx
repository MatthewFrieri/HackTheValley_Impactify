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
  }, [location.search]);

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Back Button on the right */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)} // Navigate back to the previous page
          variant="outlined"
          sx={{ ml: "auto" }} // Ensure the button stays on the far right
        >
          Back
        </Button>
      </Box>

      <LiveChart sessionId={getQueryParams().get("session_id") || ""} />
      <Stats sessionId={getQueryParams().get("session_id") || ""} />
      <BrainHealth sessionId={getQueryParams().get("session_id") || ""} />
    </Box>
  );
};

export default SessionPage;
