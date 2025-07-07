/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React from 'react';
import Link from 'next/link';

const Shareholders = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Shareholders Portal</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Current Voting Issue</h2>
        <p className="text-base-content mb-4">Should we donate an additional 5% of profits to an art community project for the following fiscal year?</p>
        <Link href="/shareholders/shareholder_vote" className="btn btn-primary">Vote Now</Link>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Previous Decisions</h2>
        <ul className="list-disc list-inside text-base-content">
          <li>Approved funding for local art exhibitions in 2022.</li>
          <li>Increased budget allocation for community outreach programs in 2021.</li>
          <li>Supported the creation of a public art installation in 2020.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-secondary mb-4">Document Disclosures & Investor Relations</h2>
        <p className="text-base-content mb-4">Access important documents and stay informed about our financial performance and strategic decisions.</p>
        <Link href="/investor-relations" className="btn btn-secondary">View Documents</Link>
      </section>
    </div>
  );
};

export default Shareholders;