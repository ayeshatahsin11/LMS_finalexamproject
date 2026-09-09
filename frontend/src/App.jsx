import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await api.get("/test");

        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        setMessage("Backend connection failed!");
      }
    };

    testBackend();
  }, []);

  return (
    <div>
      <h1>LMS</h1>

      <p>{message}</p>
    </div>
  );
}

export default App;