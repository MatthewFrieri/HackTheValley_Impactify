import React from "react";
import api from "../../utils/api";
import { Typography, Stack } from "@mui/material";
import SessionLink from "../buttons/SessionLink";
import NewSession from "../buttons/NewSession";
import StopSession from "../buttons/StopSession";
import PlayerSessionView from "./PlayerSessionView";
import AddPlayer from "../buttons/AddPlayer";

interface CoachSessionViewProps {
    userId: string;
}

interface Session {
  session_id: string;
  session_name: string;
  time_start: string;
  time_end: string;
}

interface Player {
    user_id: string;
    username: string;
}

const CoachSessionView: React.FC<CoachSessionViewProps> = ({ userId }) => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [players, setPlayers] = React.useState<Player[]>([]);
  
    const getCoachsPlayers = async () => {
      setLoading(true);
      // Using the user ID, get all the players that the coach has sessions with
      const response = await api.get(`/users/coach/players/`, { params: { user_id: userId } });;
      // Set the state to the session IDs
      setPlayers(response.data.data || []);
      // Stop loading
      setLoading(false);
    };
  
    // Get the players on mount
    React.useEffect(() => { getCoachsPlayers() }, []);
  
    return (
        <>
            <Stack direction="column" spacing={2} alignItems="flex-start" sx={{ maxWidth: '600px', width: '100%', marginBottom: '20px' }}>
                <AddPlayer onAddPlayer={getCoachsPlayers} />
            </Stack>
            {
                loading ? (
                    <Typography variant="body1" gutterBottom>
                        Loading players...
                    </Typography>
                ) : (
                    Array.isArray(players) && players.length > 0 ? (
                        players.map((p, index) => (
                            <>
                                <Typography variant="h5" gutterBottom textAlign={"left"}>
                                    {p.username}'s Sessions
                                </Typography>
                                <PlayerSessionView userId={p.user_id} allowNewSession={false} key={index} />
                            </>
                            
                        )
                    )
                    ) : (
                        <Typography variant="body1" gutterBottom>
                            Your team is empty! Add some players to get started.
                        </Typography>
                    )
                )
            }
        </>
    );
  };
  
  export default CoachSessionView;
  