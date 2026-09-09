import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await api.get("/test");

        console.log("BACKEND RESPONSE:", response.data);

        setMessage(response.data.message);
      } catch (error) {
        console.error("AXIOS ERROR:", error);

        setMessage("Axios connection failed!");
      }
    };

    testBackend();
  }, []);

  return (
    <div>
      <h1>LMS</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;