import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Edition2022 from './editions/pages/Edition2022';
import Edition2023 from './editions/pages/Edition2023';
import Edition2024 from './editions/pages/Edition2024';
import { createRoot } from 'react-dom/client';


import Sponsors_Complete from './components/Sponsors_Complete';
import Events4Page from './components/Events4Page';
import EventsApp from './components/events/App';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editions/2022" element={<Edition2022 />} />
        <Route path="/editions/2023" element={<Edition2023 />} />
        <Route path="/editions/2024" element={<Edition2024 />} />
        <Route path="/sponsors-complete" element={<Sponsors_Complete />} />
  <Route path="/events4" element={<Events4Page />} />
  <Route path="/events" element={<EventsApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
