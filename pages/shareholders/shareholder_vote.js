/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useState } from 'react';

const ShareholderVote = () => {
  const [vote, setVote] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (choice) => {
    setVote(choice);
  };

  const handleSubmit = () => {
    if (vote) {
      setSubmitted(true);
      // Here you would send the vote to the backend for processing
      console.log(`Vote submitted: ${vote}`);
    } else {
      alert('Please select an option before submitting.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-primary mb-6">Shareholder Vote</h1>
      <p className="text-lg text-base-content mb-4">Should we donate an additional 5% of profits to an art community project for the following fiscal year?</p>

      {!submitted ? (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <button className="btn btn-success mr-4" onClick={() => handleVote('Yes')}>Yes</button>
            <button className="btn btn-error" onClick={() => handleVote('No')}>No</button>
          </div>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Vote</button>
        </div>
      ) : (
        <p className="text-lg text-success">Thank you for voting! Your input has been recorded.</p>
      )}
    </div>
  );
};

export default ShareholderVote;