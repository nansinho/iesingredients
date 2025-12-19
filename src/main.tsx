import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Capture runtime errors to avoid silent blank pages and to make logs visible.
window.addEventListener("error", (event) => {
  // eslint-disable-next-line no-console
  console.error("[window.error]", event.error ?? event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  // eslint-disable-next-line no-console
  console.error("[window.unhandledrejection]", event.reason);
});

createRoot(document.getElementById("root")!).render(<App />);
