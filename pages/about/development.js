/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from "/components/Context"; // Import context to update header sections

const Development = () => {
  const { setPageSections } = useAppContext(); // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "frontend", label: "Front End" },
    { id: "backend", label: "Back End" },
    { id: "etc", label: "Etc." },
  ];

  useEffect(() => {
    setPageSections(sections);

    return () => {
      setPageSections([]);
    };
  }, [setPageSections]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Developer Resources | Twisted Artists Guild</title>
        <meta name="description" content="Explore our API documentation and developer resources to integrate with the Twisted Artists Guild platform." />
      </Head>

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">Developer Resources & API Documentation</h1>
          <p className="text-xl mb-8 text-base-content">
            Welcome to the Twisted Artists Guild Developer Resources page. Our platform is open to third-party integrations and is designed to form a vibrant ecosystem of apps. Whether you’re building tools for artists, enhancing the user experience, or integrating with external services, we’re here to support you.
          </p>
          <p className="text-lg mb-8 text-base-content">
            Our documentation and resource guides are built to help developers quickly understand and contribute to our system. We believe in building our own tools where appropriate, while integrating external apps for specialized needs. For example, we leverage double-entry accounting APIs to avoid reinventing the wheel and pass through payment vendor services to ensure secure transactions without storing credit card information.
          </p>
        </div>
      </section>

      {/* Front End Section */}
      <section id="frontend" className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-primary">Front End</h2>
          <ul className="list-disc list-inside text-lg text-base-content space-y-4">
            <li>We use Next.js with DaisyUI for themes and TailwindCSS for simplified, modular styling.</li>
            <li>When a module can be built for reuse across the platform, it should be developed as a standalone component.</li>
            <li>Building forms that are stored in the database allows for updates without a code push.</li>
            <li>All front-end components and interfaces are designed to be fully mobile friendly.</li>
            <li>Social media features include liking, commenting, and sharing art posts, with direct and group messaging systems.</li>
            <li>Bloomscrolling feature for endless art browsing, tailored to user preferences, with internal sponsored and contest winner labels.</li>
          </ul>
        </div>
      </section>

      {/* Back End Section */}
      <section id="backend" className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-primary">Back End</h2>
          <ul className="list-disc list-inside text-lg text-base-content space-y-4">
            <li>Our backend uses C# Entity Framework with a Code-First Approach. We automate structural migrations in the CI/CD pipeline.</li>
            <li>Generic CRUD endpoints (get, post, put, delete) are implemented for all models.</li>
            <li>Specific API routes include related data models, such as artist profiles with listings and cover pictures.</li>
            <li>Authorization middleware secures sensitive routes.</li>
            <li>Supports anti-scalping features for event ticketing, including FIFO waitlist queues and ticket transfer validation.</li>
            <li>Double-entry accounting system integration for unified revenue and expense tracking.</li>
          </ul>
        </div>
      </section>

      {/* Etc. Section */}
      <section id="etc" className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-primary">Etc.</h2>
          <ul className="list-disc list-inside text-lg text-base-content space-y-4">
            <li>We utilize GitHub Enterprise for feature and bug tracking as well as code hosting. Our deployment workflow pipes code over to regionally distributed, scaling applications on Azure into designated staging and production slots.</li>
            <li>Future plans include native iOS and Android apps with offline caching for event management and printer integration.</li>
            <li>Event management tools include ticketing, promotion, and analytics dashboards for attendance tracking.</li>
            <li>Artists can participate in themed art competitions with public voting and awards.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Development;