/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from "/components/Context"; // Import context to update header sections

const Investing = () => {
  const { setPageSections } = useAppContext(); // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "buyback", label: "Stock Buyback Program" },
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
        <title>Investing | Twisted Artists Guild</title>
        <meta name="description" content="Learn about the TAG Stock Plan Overview, including ESPP, AMSPP, and Buyback Program." />
      </Head>

      <section id="overview" className="py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">TAG Stock Plan Overview</h1>
          <p className="text-xl mb-8 text-base-content">
            At Twisted Artists Guild, we believe in empowering our community through ownership. Here’s how you can participate:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl p-6">
              <h2 className="text-3xl font-bold mb-4 text-secondary">Employee Stock Purchase Plan (ESPP)</h2>
              <p className="text-lg">
                Our ESPP allows employees to purchase company stock at a discounted price, typically 10–15% off the market price. This program is designed to reward and retain our dedicated team members.
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl p-6">
              <h2 className="text-3xl font-bold mb-4 text-secondary">Artist Member Stock Purchase Program (AMSPP)</h2>
              <p className="text-lg">
                The AMSPP enables artists to transfer a portion of their profits to a quarterly purchase program that buys Common stocks. This gives artists a stronger percentage of voting shares, empowering them to have a voice in the Guild’s future. This is the only way to earn voting shares, other than winning sponsored contests.
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl p-6">
              <h2 className="text-3xl font-bold mb-4 text-secondary">Win Voting Shares Through Contests</h2>
              <p className="text-lg">
                Artists can also earn voting shares by participating in and winning sponsored contests. These contests are designed to celebrate creativity and reward exceptional talent within our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="buyback" className="py-16 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary">Stock Buyback Program</h2>
          <p className="text-lg mb-8 text-base-content">
            Our Buyback Program outlines how the company repurchases shares from the market to provide liquidity. This ensures a healthy stock ecosystem and supports our long-term growth strategy.
          </p>
          <div className="card bg-base-100 shadow-xl p-6 mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-4 text-secondary">Download the Stock Plan Flowchart</h3>
            <p className="text-lg mb-4">
              For a detailed overview of our stock plans, download the flowchart below:
            </p>
            <a
              href="https://tagstatic.blob.core.windows.net/content/TAG%20Stock%20Plan%20Flowchart.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download PDF
            </a>
            <iframe
              src="https://tagstatic.blob.core.windows.net/content/TAG%20Stock%20Plan%20Flowchart.pdf#toolbar=0&navpanes=0"
              className="w-full h-[48rem] mt-6 border rounded-lg"
              title="TAG Stock Plan Flowchart"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investing;