/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useEffect } from 'react';
import Head from 'next/head';
import PublicPricing from '/components/PublicPricing';
import Link from 'next/link';
import { useAppContext } from "/components/Context"; // Import context to update header sections

const Pricing = () => {
  const { setPageSections } = useAppContext(); // Get access to context to set sections

  useEffect(() => {
    // Updated sections with more descriptive labels and IDs
    const updatedSections = [
      { id: "public-pricing", label: "Public Pricing" },
      { id: "artist-pricing", label: "Artist Pricing Details" },
      { id: "key-differentiators", label: "Key Differentiators" },
    ];

    setPageSections(updatedSections);

    return () => {
      setPageSections([]); // Clear sections on unmount
    };
  }, [setPageSections]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Pricing | Twisted Artists Guild</title>
        <meta name="description" content="Learn about our transparent pricing structure for the public and artists." />
      </Head>

      {/* Public Pricing Section */}
      <section id="public-pricing">
        <PublicPricing />
      </section>

      {/* Artist Pricing Details Section */}
      <section id="artist-pricing" className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">How Artists Price Their Items</h2>
          <p className="text-lg mb-6">
            Pricing your artwork effectively ensures you cover your costs and earn a fair profit. Here’s how to do it:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Step 1: Calculate Costs</h3>
              <ul className="list-disc list-inside space-y-3">
                <li>Determine the cost of materials used in your artwork.</li>
                <li>Estimate the hours spent creating the piece and set an hourly rate.</li>
                <li>Add desired profit margin to ensure your efforts are rewarded.</li>
              </ul>
            </div>

            <div className="card bg-base-100 shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Step 2: Include Additional Costs</h3>
              <ul className="list-disc list-inside space-y-3">
                <li>Factor in shipping and handling costs.</li>
                <li>Account for taxes based on local tax laws.</li>
                <li>Include the 6.5% credit card transaction fee in the final price.</li>
              </ul>
            </div>
          </div>
          <p className="text-lg mt-6">
            Remember, there are no listing fees on our platform, so you can focus on creating and selling your art without additional overhead.
          </p>
        </div>
      </section>

      {/* Key Differentiators Section */}
      <section id="key-differentiators" className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Key Differentiators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-opacity-20 bg-white shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">For the Public</h3>
              <p>No external advertisements, no expectation to purchase, and access to a large network of independent artists.</p>
            </div>
            <div className="card bg-opacity-20 bg-white shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">For Event Lovers</h3>
              <p>Enjoy a unique experience with no add-on service fees, anti-scalping features, and transparent ticket transfers.</p>
            </div>
            <div className="card bg-opacity-20 bg-white shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-4">For Artists</h3>
              <p>Eliminate listing fees, access comprehensive business tools, and participate in our <Link href="/about/investing" className="text-white underline">Artist Member Stock Purchase Program (AMSPP)</Link>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;