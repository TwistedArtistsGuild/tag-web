/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, memo } from "react";
import Image from "next/image";
import { useAppContext } from "/components/Context";
import TagSEO from "@/components/TagSEO";

/* Palette (derived from Tailwind / daisyUI theme for consistency) */
const PALETTE = {
  primary: "#06b6d4", // teal
  accent: "#f59e0b", // amber
  muted: "#94a3b8", // slate-400
  bg: "#f8fafc",
};

/* Simple reusable SVG job graphic (small, themeable, performant) */
function JobGraphic({ title, color = PALETTE.primary, accent = PALETTE.accent }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      role="img"
      aria-label={title}
      className="rounded-lg overflow-hidden"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor={accent} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <rect width="256" height="256" rx="12" fill="url(#g1)" />
      <g transform="translate(28,36)" fill="#fff" opacity="0.92">
        <circle cx="48" cy="36" r="28" fill="#ffffff22" />
        <rect x="0" y="88" width="180" height="14" rx="4" fill="#ffffff33" />
        <rect x="0" y="112" width="120" height="10" rx="3" fill="#ffffff33" />
        <rect x="0" y="132" width="80" height="8" rx="3" fill="#ffffff22" />
      </g>

      <text
        x="50%"
        y="92%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="12"
        fill="#04111a"
        fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      >
        {title}
      </text>
    </svg>
  );
}

/* Memoized JobCard uses SVG graphic (fast, accessible) */
const JobCard = memo(({ job, index }) => {
  const graphicColor = index % 2 === 0 ? PALETTE.primary : PALETTE.accent;
  return (
    <section
      id={job.id}
      className="mb-8 card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      role="article"
      aria-labelledby={`${job.id}-title`}
    >
      <div className="card-body">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {job.roleType && (
              <div className="badge badge-primary badge-outline mb-2">
                {job.roleType}
              </div>
            )}
            <h2 id={`${job.id}-title`} className="text-2xl font-semibold mb-2 text-primary">
              {job.title}
            </h2>
            {job.reportsTo && (
              <div className="text-sm text-base-content/70 mb-3">
                Reports to: <span className="font-medium">{job.reportsTo}</span>
              </div>
            )}
            <p className="mb-4 text-base-content/90 leading-relaxed">{job.description}</p>

            {job.responsibilities && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-3 text-secondary">Key Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-2 text-base-content/80" role="list">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.qualifications && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Qualifications</h4>
                <ul className="list-disc list-inside text-base-content/80">
                  {job.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SVG Job Graphic */}
          <div className="flex-shrink-0 lg:w-64">
            <div className="w-full h-48 lg:h-full min-h-[200px] rounded-lg overflow-hidden bg-base-100">
              <JobGraphic title={job.title} color={graphicColor} accent={PALETTE.muted} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card-actions justify-end mt-6 pt-4 border-t border-base-300">
          <div className="btn-group">
            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                (window.location.href = `mailto:careers@twistedartistsguild.com?subject=Application for ${encodeURIComponent(
                  job.title
                )}`)
              }
              aria-label={`Apply for ${job.title} position`}
            >
              Apply Now
            </button>
            <a
              className="btn btn-ghost btn-sm"
              href="#contact-info"
              aria-label="Learn more about application process"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
JobCard.displayName = "JobCard";

/* Careers Page */
export default function Careers() {
  const { setPageSections } = useAppContext();

  const pageMetaData = {
    title: "TAG Careers Page",
    description: "Leadership and contributor roles at the Twisted Artists Guild",
    keywords: "tech, art, hiring, cooperative, jobs",
    robots: "index, follow",
    author: "Twisted Artists Guild",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: "Join TAG — Careers",
      description: "Explore leadership and contributor opportunities at TAG",
    },
  };

  const jobListings = useMemo(
    () => [
      /* Technology Department (Board Director: Director of Technology; Executive: CTO) */
      {
        id: "chief-technology-officer",
        title: "Chief Technology Officer (CTO)",
        department: "Technology",
        boardDirector: "Director of Technology",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "DevOps Engineer",
          "Full Stack Developer",
          "QA Analyst",
          "Technical Writer",
        ],
        description:
          "Oversee TAG’s hosting, network, and platform stability; translate Board directives into technical priorities; make time-sensitive decisions to restore uptime; and ensure systems are documented and socialized to prevent silos.",
        responsibilities: [
          "Oversees hosting, network, and platform stability",
          "Communicates Board directives to development teams",
          "Makes time-sensitive decisions to restore uptime",
          "Ensures systems are documented and socialized to prevent silos",
        ],
        metrics: [
          "99.999% uptime",
          "Cost of Services Sold (dev/cloud/vendor)",
          "PMO-approved KPIs",
        ],
        graphic: "/images/chief-technology-officer.png",
      },

      /* Artist Relations & News (Board Director: Director of Artist Relations; Executive: CTPO) */
      {
        id: "chief-talent-partnerships-officer",
        title: "Chief Talent & Partnerships Officer (CTPO)",
        department: "Artist Relations & News",
        boardDirector: "Director of Artist Relations",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "Artist Liaison",
          "Community Manager",
          "Editorial Lead",
          "Member Success Advocate",
        ],
        description:
          "Serve as chief voice of artist members, facilitate engagement across web and social channels, organize community programs and competitions, and report economic outcomes for the Guild.",
        responsibilities: [
          "Serves as chief voice of artist members",
          "Facilitates engagement via website and social media",
          "Organizes competitions, raffles, and community events",
          "Pitches common stockholder resolutions",
          "Reports total sales, costs, and margins across the Guild",
          "Highlights top earners and analyzes success factors",
        ],
        metrics: ["New member growth", "Viral trend success", "Diversity of people and artforms"],
        graphic: "/images/chief-talent-partnerships-officer.png",
      },

      /* Business Operations & Supply Chain (Board Director: Director of Supply Chain; Executive: COO) */
      {
        id: "chief-operations-officer",
        title: "Chief Operations Officer (COO)",
        department: "Business Operations & Supply Chain",
        boardDirector: "Director of Supply Chain",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "Vendor Manager",
          "Procurement Specialist",
          "Contract Administrator",
          "Logistics Coordinator",
        ],
        description:
          "Vets tools and vendors, negotiates SLAs, manages procurement and payments, and oversees sourcing, distribution, and fundraising logistics for TAG.",
        responsibilities: [
          "Vets business tools and vendors",
          "Negotiates SLAs and manages onboarding",
          "Oversees contracts, PO issuance, invoicing, and payments",
          "Manages sourcing, distribution, and fundraising logistics",
        ],
        metrics: ["New opportunities", "Cost avoidance", "Return/rejection rates", "Vendor satisfaction"],
        graphic: "/images/chief-operations-officer.png",
      },

      /* Event Management (Board Director: Director of Events; Executive: CXO) */
      {
        id: "chief-experience-officer",
        title: "Chief Experience Officer (CXO)",
        department: "Event Management",
        boardDirector: "Director of Events",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "Event Producer",
          "Regional Coordinator",
          "Festival Planner",
          "Sponsorship Manager",
        ],
        description:
          "Develops event best practices, runs promotional and fundraising events, builds regional schedules, and scales festival operations over time.",
        responsibilities: [
          "Develops best practices for event management modules",
          "Runs promotional and fundraising events with PMO",
          "Builds regional schedules of art events",
          "Long-term: manages festivals and large-scale gatherings",
        ],
        metrics: ["Event attendance", "Margins", "In-person vending revenue"],
        graphic: "/images/chief-experience-officer.png",
      },

      /* Accounting & Financial Strategy (Board Director: Director of Accounts; Executive: CFO) */
      {
        id: "chief-financial-officer",
        title: "Chief Financial Officer (CFO)",
        department: "Accounting & Financial Strategy",
        boardDirector: "Director of Accounts",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "Staff Accountant",
          "Financial Analyst",
          "Investment Manager",
          "Treasury Operations Lead",
        ],
        description:
          "Maintains double-entry accounting, analyzes financial trends, collaborates on fintech tools, manages the stock plan, and reports on fiscal health for the cooperative.",
        responsibilities: [
          "Maintains double-entry accounting system",
          "Analyzes financial trends and forecasts spending",
          "Collaborates on accounting and fintech tools",
          "Develops BaaS products for artist banking",
          "Manages art-related investment portfolio",
          "Executes and reports on the stock plan",
        ],
        metrics: [
          "Quarterly report processing time",
          "Overdraft charges",
          "ROI",
          "Average artist salaries",
        ],
        graphic: "/images/chief-financial-officer.png",
      },

      /* Customer Experience (Board Director: Director of Customer Care; Executive: CCO) */
      {
        id: "chief-customer-officer",
        title: "Chief Customer Officer (CCO)",
        department: "Customer Experience",
        boardDirector: "Director of Customer Care",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "Customer Support Specialist",
          "UX Researcher",
          "Feedback Analyst",
          "Helpdesk Coordinator",
        ],
        description:
          "Advocates for public customers, collaborates on UX improvements, reports sentiment, and runs research to improve satisfaction across customers and artist members.",
        responsibilities: [
          "Advocates for public customers who buy art",
          "Collaborates with dev team on UI/UX improvements",
          "Reports public sentiment and feedback",
          "Runs focus groups, polls, and satisfaction surveys",
          "Collaborates with Artist Relations on member feedback",
        ],
        metrics: ["Complaints logged/resolved", "Customer satisfaction scores"],
        graphic: "/images/chief-customer-officer.png",
      },

      /* Human Resources & Compliance (Board Director: Director of Employee Success; Executive: CSO) */
      {
        id: "chief-success-officer",
        title: "Chief Success Officer (CSO)",
        department: "Human Resources & Compliance",
        boardDirector: "Director of Employee Success",
        roleType: "Board-Appointed Executive",
        reportsTo: "Board of Directors",
        exampleEmployeeTitles: [
          "HR Generalist",
          "Compliance Officer",
          "Diversity & Inclusion Lead",
          "Training Program Manager",
        ],
        description:
          "Oversees legal and ethical compliance, builds HR policies and training programs, and manages employee success initiatives aligned with cooperative values.",
        responsibilities: [
          "Oversees legal and ethical compliance",
          "Builds HR policies, procedures, and systems",
          "Hires and manages HR personnel",
          "Develops training programs for staff and artist members",
          "Collaborates on health insurance offerings",
          "Reports on safety incidents and responses",
        ],
        metrics: ["Diversity & inclusion metrics", "Employee retention", "Compliance KPIs"],
        graphic: "/images/chief-success-officer.png",
      },

      /* Flexible contributor pathway (keeps open contributor role) */
      {
        id: "open-contributor-role",
        title: "Open Contributor Role",
        department: "Cross-Functional Contributors",
        roleType: "Flexible Contributor Pathway",
        reportsTo: "Relevant Executive or Board Committee",
        exampleEmployeeTitles: ["Developer", "Design Contributor", "Governance Contributor", "Community Contributor"],
        description:
          "TAG welcomes contributors across departments. If you're aligned with our mission and want to help build artist-owned infrastructure, contribute via the pathway below.",
        responsibilities: [
          "Collaborate on open-source infrastructure and documentation",
          "Support artist onboarding, outreach, or event planning",
          "Contribute to governance, financial modeling, or UX research",
        ],
        metrics: ["Contributions accepted", "Onboarding completion rate"],
        graphic: "/images/open-contributor-role.png",
      },
    ],
    []
  );

  const sections = jobListings.map((job) => ({ id: job.id, label: job.title }));

  useEffect(() => {
    setPageSections(sections);
    return () => setPageSections([]);
  }, [setPageSections, sections]);

  return (
    <div className="p-8 md:p-12 bg-base-100 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="careers" />

      {/* Hero (photographic, optimized via Next/Image) */}
      <header className="relative mb-10 rounded-lg overflow-hidden bg-base-200">
        <div className="max-w-7xl mx-auto flex items-center gap-8 px-6 py-12 lg:py-20">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-lg text-base-content/85 mb-6">
              We’re building a cooperative platform that centers artists. If you’re passionate about tech, governance, or community, explore leadership and contributor roles with TAG.
            </p>
            <div className="flex gap-3">
              <a className="btn btn-primary" href="#open-roles">View Open Roles</a>
              <a className="btn btn-ghost" href="#contact-info">Contact</a>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2">
            <div className="relative w-full h-48 lg:h-64 rounded-md overflow-hidden">
              <Image
                src="/images/careers-hero.avif"
                alt="TAG team collaborating"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Job list */}
      <main id="open-roles" className="max-w-7xl mx-auto space-y-8 px-4">
        {jobListings.map((job, idx) => (
          <JobCard key={job.id} job={job} index={idx} />
        ))}

        {/* Contact / apply info */}
        <section id="contact-info" className="mt-12 card bg-base-200 p-6">
          <h3 className="text-xl font-semibold mb-2">Application & Contact Info</h3>
          <p className="mb-2">
            To apply, email <a href="mailto:careers@twistedartistsguild.com" className="link">careers@twistedartistsguild.com</a> with a short note and resume or portfolio.
          </p>
          <p className="text-sm text-base-content/70">
            We welcome applicants from diverse backgrounds. If you would like to contribute in a different capacity, mention the role or skillset in your email.
          </p>
        </section>
      </main>
    </div>
  );
}
