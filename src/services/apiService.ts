const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://randomplayables.com/api';

let sessionPromise: Promise<any> | null = null;

export const initGameSession = (gameId: string) => {
  if (sessionPromise) {
    return sessionPromise;
  }
  
  sessionPromise = fetch(`${API_BASE_URL}/game-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  }).then(res => {
    if(!res.ok) throw new Error("Failed to create session");
    return res.json();
  }).catch(err => {
      console.error("Session creation failed, using local session.", err);
      return { sessionId: `local-${Date.now()}` };
  });

  return sessionPromise;
};

export const saveGameData = async (roundNumber: number, roundData: any) => {
    const session = await initGameSession('rectify'); // Ensure session exists
    
    if (session.sessionId.startsWith('local-')) {
        console.log("Offline mode: Data not sent to server.", { roundNumber, roundData });
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/game-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: session.sessionId,
                roundNumber,
                roundData,
            }),
        });
        if(!response.ok) throw new Error("Failed to save game data.");
        console.log("Round data saved successfully.");
    } catch (err) {
        console.error("Could not save game data.", err);
    }
};