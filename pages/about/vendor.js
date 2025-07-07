/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppContext } from "/components/Context"; // Import context to update header sections

const Vendor = () => {
  const { setPageSections } = useAppContext(); // Get access to context to set sections

  // Navigation sections for quick jump
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Vendor Requirements" },
    { id: "benefits", label: "Benefits of Partnership" },
    { id: "application", label: "Application Process" },
    { id: "faq", label: "FAQs" },
  ];

  useEffect(() => {
    setPageSections(sections);

    return () => {
      setPageSections([]);
    };
  }, [setPageSections]);

  // Section content
  const Overview = () => (
    <section id="overview" className="py-8">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <p>
        We are seeking partners and vendors to help us in our mission. We imagine relationships where your firm will offer a discount to our roster of artistic businesses who need services. Together, we can create a thriving ecosystem for artists and their supporters.
      </p>
    </section>
  );

  const VendorRequirements = () => (
    <section id="requirements" className="py-8">
      <h2 className="text-2xl font-bold mb-4">Vendor Requirements</h2>
      <p>
        We’re seeking vendors who can provide the following services to our organization and artist members:
      </p>
      <ul className="list-disc list-inside">
        <li>Health, dental, vision, and mental health insurance for our employees and artist members</li>
        <li>Retirement plans for ourselves and our artist members</li>
        <li>Accounting and legal representation for both the organization and individual artist members</li>
        <li>Screen printers, archivists, framing services, art supplies stores, and other art-related services</li>
      </ul>
    </section>
  );

  const BenefitsOfPartnership = () => (
    <section id="benefits" className="py-8">
      <h2 className="text-2xl font-bold mb-4">Benefits of Partnership</h2>
      <p>
        By partnering with us, you’ll gain access to a vibrant community of artists and creatives who are eager to collaborate and grow. Your services will be highlighted as part of our ecosystem, and you’ll play a key role in supporting the arts.
      </p>
    </section>
  );

  const ApplicationProcess = () => (
    <section id="application" className="py-8">
      <h2 className="text-2xl font-bold mb-4">Application Process</h2>
      <p>
        Interested in becoming a partner or vendor? Reach out to us with details about your services and how you envision collaborating with our community. We’ll review your application and get back to you with next steps.
      </p>
    </section>
  );

  const FAQs = () => (
    <section id="faq" className="py-8">
      <h2 className="text-2xl font-bold mb-4">FAQs</h2>
      <p>
        <strong>Q: What types of artists do you work with?</strong><br />
        A: We work with a diverse range of artists, including painters, sculptors, digital artists, and more.
      </p>
      <p>
        <strong>Q: How can I contribute to your mission?</strong><br />
        A: You can contribute by offering your services, providing feedback on our initiatives, or collaborating on projects that support the arts.
      </p>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <Head>
        <title>Vendor Information | Twisted Artists Guild</title>
        <meta name="description" content="Details for vendors working with the Twisted Artists Guild." />
      </Head>

      {/* Navigation Pane */}
      <nav className="bg-base-100 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/about" className="text-primary font-bold text-lg">About Us</Link>
          <div className="flex space-x-4">
            <Link href="/about/pricing" className="text-base-content hover:text-primary">Pricing</Link>
            <Link href="/about/vendor" className="text-base-content hover:text-primary">Vendor</Link>
            <Link href="/about/development" className="text-base-content hover:text-primary">Development</Link>
            <Link href="/about/investing" className="text-base-content hover:text-primary">Investing</Link>
          </div>
        </div>
      </nav>

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-primary">Vendor Information</h1>
          <p className="text-xl mb-8 text-base-content">
            Welcome to the Vendor Information page. Here you’ll find all the details you need to work with the Twisted Artists Guild.
          </p>
        </div>
      </section>

      <Overview />
      <VendorRequirements />
      <BenefitsOfPartnership />
      <ApplicationProcess />
      <FAQs />
    </div>
  );
};

export default Vendor;