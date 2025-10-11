import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Health check function to ping the API on app load/refresh
const performHealthCheck = async () => {
  try {
    const response = await fetch(
      "https://janrakshak-pre-alert-model.onrender.com/health"
    );
    const data = await response.json();
    console.log("JanRakshak API Health Check:", data);
    console.log("API Status:", data.status);
    console.log("Timestamp:", data.timestamp);
  } catch (error) {
    console.error("JanRakshak API Health Check Failed:", error);
  }
};

// Perform health check when app loads
performHealthCheck();

// Set up interval to hit the health endpoint every 40 seconds
const healthCheckInterval = setInterval(performHealthCheck, 40000);

// Clean up interval when page is unloaded
window.addEventListener("beforeunload", () => {
  clearInterval(healthCheckInterval);
});

createRoot(document.getElementById("root")!).render(<App />);
