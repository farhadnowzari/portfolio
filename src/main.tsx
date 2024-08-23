import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './assets/styles/app.scss';
import App from './App';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
