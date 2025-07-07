/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



/**
 * Static Page - Contact - Shows how to get in touch with the guild
 * @returns Next and React components
 */
import { useState, useEffect } from "react";
import { useAppContext } from "/components/Context";
import TagSEO from "@/components/TagSEO";
import Header from "/components/Header/Header";

export default function Careers() {
  const { setPageSections } = useAppContext();

  const pageMetaData = {
    title: "TAG Careers Page",
    description: "A list of our available jobs",
    keywords: "tech, art, hiring, employer",
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "TAG Careers Page",
      description: "A list of our available jobs",
    },
  };

  const jobListings = [
    {
      id: "director-of-technology",
      title: "Director of Technology",
      description:
        "Lead our tech vision as we scale toward a global business model. You'll oversee the development team, report on infrastructure health, ensure uptime reliability, and drive innovation while maintaining seamless operations.",
      responsibilities: [
        "Oversee website, network, hosting, and IT operations",
        "Lead development teams, report project progress, and drive strategic growth",
        "Ensure system documentation to prevent knowledge silos",
        "Maintain high uptime standards and cost efficiency",
      ],
      graphic: "/images/director-of-technology.png",
    },
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      description:
        "Build and maintain the user-facing parts of our platform using modern frameworks like React and Next.js. Collaborate with designers to create accessible, responsive, and visually stunning interfaces.",
      responsibilities: [
        "Develop and optimize user interfaces using Next.js and Tailwind CSS",
        "Ensure accessibility compliance (WCAG standards)",
        "Collaborate with backend developers to integrate APIs",
        "Write clean, maintainable, and scalable code",
      ],
      graphic: "/images/frontend-developer.png",
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      description:
        "Design and implement robust backend systems using .NET and Entity Framework. Ensure high performance, scalability, and security for our platform.",
      responsibilities: [
        "Develop and maintain APIs using .NET and Entity Framework",
        "Implement secure authentication and authorization mechanisms",
        "Optimize database queries and ensure data integrity",
        "Collaborate with frontend developers to deliver seamless user experiences",
      ],
      graphic: "/images/backend-developer.png",
    },
    {
      id: "director-of-artist-relations",
      title: "Director of Artist Relations",
      description:
        "Be the voice of our artist community—engaging creators, running competitions, fostering connections, and ensuring diversity in artistic representation.",
      responsibilities: [
        "Run artist polls, competitions, and community initiatives",
        "Advocate for member needs and drive creative trend responses",
        "Report total Guild sales, highlighting success stories",
        "Foster growth and diversity among our artist network",
      ],
      graphic: "/images/director-of-artist-relations.png",
    },
    {
      id: "director-of-supply-chain",
      title: "Director of Supply Chain",
      description:
        "Manage contracts, vet vendors, and oversee procurement for a seamless operation. You'll ensure we work with the best suppliers while optimizing costs and fundraising strategies to expand distribution channels.",
      responsibilities: [
        "Oversee PMO operations and procurement strategies",
        "Research and recommend business tools for efficiency",
        "Negotiate vendor contracts and secure approvals for payments",
        "Manage logistics and fundraising efforts",
      ],
      graphic: "/images/director-of-supply-chain.png",
    },
    {
      id: "director-of-events",
      title: "Director of Events",
      description:
        "Take charge of our live experiences—fundraisers, promotional events, and art showcases. You’ll refine ticketing systems, coordinate festivals, and build regional event calendars that bring art to life.",
      responsibilities: [
        "Organize promotional and sales events",
        "Develop event ticketing and management tools",
        "Assist in expanding festival planning efforts",
        "Track attendance, margins, and revenue from in-person sales",
      ],
      graphic: "/images/director-of-events.png",
    },
    {
      id: "director-of-customer-care",
      title: "Director of Customer Care",
      description:
        "Champion the user experience, ensuring public customers enjoy seamless engagement while buying art. You’ll advocate for UI improvements, run focus groups, and collect insights from artist members and general audiences to enhance satisfaction.",
      responsibilities: [
        "Advocate for customer and artist-friendly platform updates",
        "Gather feedback through polls, focus groups, and market research",
        "Report customer sentiment and refine public outreach",
        "Lead complaint resolution efforts to improve overall experience",
      ],
      graphic: "/images/director-of-customer-care.png",
    },
  ];

  // Navigation sections for quick jump
  const sections = jobListings.map((job) => ({ id: job.id, label: job.title }));

  // Set page sections in context when component mounts
  useEffect(() => {
    setPageSections(sections);

    // Clean up when component unmounts
    return () => {
      setPageSections([]);
    };
  }, [setPageSections]);

  return (
    <div className="p-10 bg-base-100 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="careers" />

      <h1 className="text-3xl font-bold mb-6">Join Our Team</h1>
      <p className="text-lg mb-4">
        We’re building something revolutionary—a dynamic fusion of art, ecommerce, social connection, and fintech. If you’re passionate about shaping a creative, inclusive, and high-performance ecosystem, check out our open leadership roles below.
      </p>

      {jobListings.map((job) => (
        <section key={job.id} id={job.id} className="mb-8 card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
            <p className="mb-2">{job.description}</p>
            <img src={job.graphic} alt={job.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="font-medium">Key Responsibilities:</h3>
            <ul className="list-disc list-inside ml-4">
              {job.responsibilities.map((responsibility, idx) => (
                <li key={idx}>{responsibility}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

    </div>
  );
}
