// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Forms18vs19 from "./pages/Forms18vs19";
import EffectEvent19_2 from "./pages/EffectEvent19_2";
import Activity19_2 from "./pages/Activity19_2";
import Notes19vs19_1 from "./pages/Notes19vs19_1";
import ".//style.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/18-vs-19/forms", element: <Forms18vs19 /> },
  { path: "/19-vs-19_1/notes", element: <Notes19vs19_1 /> },
  { path: "/19_1-vs-19_2/effect-event", element: <EffectEvent19_2 /> },
  { path: "/19_2/activity", element: <Activity19_2 /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
