import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Edition2022 from './editions/pages/Edition2022';
import Edition2023 from './editions/pages/Edition2023';
import Edition2024 from './editions/pages/Edition2024';
import { createRoot } from 'react-dom/client';

import App from './App';
import EventsApp from './EventsApp';
import './index.css';
import './events.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/events/*" element={<EventsApp />} />
        <Route path="/editions/2022" element={<Edition2022 />} />
        <Route path="/editions/2023" element={<Edition2023 />} />
        <Route path="/editions/2024" element={<Edition2024 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
