/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React from 'react';

const PrintEnv = () => {
  // Collect all environment variables
  const envVariables = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING: process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING,
    AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS: process.env.AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
    SHIPPOTOKEN: process.env.SHIPPOTOKEN,
    NEXT_PUBLIC_TAG_API_URL: process.env.NEXT_PUBLIC_TAG_API_URL,
    APPINSIGHTS: process.env.APPINSIGHTS,
  };

  // Log all environment variables to the console
  console.log('Environment Variables:', envVariables);

  return (
    <div>
      <h1>Environment Variables</h1>
      <ul>
        {Object.entries(envVariables).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value || 'Not Defined'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrintEnv;
