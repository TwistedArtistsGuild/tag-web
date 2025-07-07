/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React from 'react';

const PublicPricing = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">Transparent Pricing</h1>
        <p className="text-xl mb-8 text-base-content">
          At Twisted Artists Guild, we believe in simplicity and transparency. Here’s what you need to know:
        </p>
        <div className="card bg-base-100 shadow-xl p-8 mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-secondary">For the Public</h2>
          <ul className="list-none space-y-4 text-left">
            <li className="flex items-start gap-4">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Free shipping on all purchases.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Taxes are included in the final price.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">A 6.5% guild fee is already factored into the price.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-semibold">The price you see is the price you pay.</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">No external advertisements or obligations to buy.</span>
            </li>
          </ul>
          <p className="text-lg mt-8 text-base-content">
            We kindly invite you to compare our prices to our competitors’ final prices, including shipping and taxes. We’re confident you’ll find our pricing fair and transparent.
          </p>
          <p className="text-lg mt-4 text-base-content">
            At Twisted Artists Guild, we are committed to driving fair and sustainable pricing. Our guild only earns its fee when we help artists sell their work. This means we work tirelessly to help artists find the right price—balancing affordability for buyers with ensuring artists can put food on the table and pay their rent.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PublicPricing;