import { createRoot } from "react-dom/client";
import "./index.css";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
