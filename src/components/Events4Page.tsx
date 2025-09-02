// Wrapper to render Events App inside ACN4.0


import { useEffect } from "react";
import App from './events/App';

export default function Events4Page() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/events4.css";
    link.id = "events4-css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return <App />;
}
