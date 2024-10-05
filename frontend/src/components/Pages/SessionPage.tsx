import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LiveChart from "../charts/LiveChart";
import Stats from "../Stats/Stats";

const SessionPage: React.FC = () => {
  const location = useLocation();

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  useEffect(() => {
    console.log("QUERY");

    console.log(getQueryParams().get("session_id"));
  }, []);

  return (
    <>
      <LiveChart sessionId={getQueryParams().get("session_id") || ""} />
      <Stats sessionId={getQueryParams().get("session_id") || ""} />
    </>
  );
};

export default SessionPage;
