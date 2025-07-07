/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React from 'react';
import 'tailwindcss/tailwind.css';

const competitions = [
  {
    type: 'Monthly',
    prompt: 'Create a surreal landscape',
    deadline: 'October 31, 2023',
  },
  {
    type: 'Quarterly',
    prompt: 'Design a futuristic cityscape',
    deadline: 'December 31, 2023',
  },
];

const previousWinners = [
  {
    name: 'Jane Doe',
    competition: 'Monthly - September 2023',
    artwork: 'https://example.com/artwork1.jpg',
  },
  {
    name: 'John Smith',
    competition: 'Quarterly - Q2 2023',
    artwork: 'https://example.com/artwork2.jpg',
  },
];

const CompetitionsPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Art Competitions</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((competition, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-bold">{competition.type} Competition</h3>
              <p className="mt-2">Prompt: {competition.prompt}</p>
              <p className="mt-2 text-gray-600">Deadline: {competition.deadline}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Previous Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previousWinners.map((winner, index) => (
            <div key={index} className="p-4 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-bold">{winner.name}</h3>
              <p className="mt-2 text-gray-600">Competition: {winner.competition}</p>
              <img
                src={winner.artwork}
                alt={`Artwork by ${winner.name}`}
                className="mt-4 w-full h-48 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CompetitionsPage;