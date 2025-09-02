import React from "react";
import { motion } from "framer-motion";

// Example sponsor logos (replace with actual paths or URLs)
import gold1 from "../images/Sponsors/Ashok_Leyland.png";
import gold2 from "../images/Sponsors/Innspark.png";
import gold3 from "../images/Sponsors/CISAI.png";
import gold4 from "../images/Sponsors/CUB.png";
import gold5 from "../images/Sponsors/Hack_The_Box.png";

import event1 from "../images/Sponsors/Ashok_Leyland.png";
import event2 from "../images/Sponsors/Wipro.png";
import event3 from "../images/Sponsors/Hack_The_Box.png";
import event4 from "../images/Sponsors/Innspark.png";
import event5 from "../images/Sponsors/ISEA.png";
import event6 from "../images/Sponsors/Manag_Engine.png";
import event7 from "../images/Sponsors/MRF.jpg";
import event8 from "../images/Sponsors/Quick_Heal.png";
import event9 from "../images/Sponsors/Skills_Da.png";
import event10 from "../images/Sponsors/TCS.png";

const SponsorsPage = () => {
  const goldSponsors = [gold1, gold2, gold3, gold4, gold5];
  const eventSupporters = [
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
    event7,
    event8,
    event9,
    event10,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Sponsors</h1>
        <p className="text-gray-600">
          We proudly thank our Gold Sponsors & Event Supporters
        </p>
      </div>

      {/* Gold Sponsors */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-8 text-center">
          🌟 Gold Sponsors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {goldSponsors.map((logo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl flex items-center justify-center w-40 h-28"
            >
              <img
                src={logo}
                alt={`Gold Sponsor ${idx + 1}`}
                className="max-h-16 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Supporters */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-600 mb-8 text-center">
          🤝 Event Supporters
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {eventSupporters.map((logo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center w-32 h-20"
            >
              <img
                src={logo}
                alt={`Supporter ${idx + 1}`}
                className="max-h-12 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SponsorsPage;
