/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { HeartIcon, MessageCircleIcon, ShareIcon, EyeIcon, TrophyIcon, VoteIcon } from "lucide-react"
import { SocialRealtimeProvider } from "/components/social/SocialRealtimeContext"

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
  // Social data state for competitions
  const [socialData, setSocialData] = useState({
    "monthly-surreal": { views: 1456, loves: 203, comments: 87, shares: 134, votes: 89 },
    "quarterly-cityscape": { views: 2234, loves: 312, comments: 156, shares: 201, votes: 167 },
    "winner-jane": { views: 987, loves: 156, comments: 43, shares: 67, votes: 234 },
    "winner-john": { views: 1234, loves: 189, comments: 67, shares: 89, votes: 278 }
  });

  const handleSocialAction = (competitionId, action) => {
    setSocialData(prev => ({
      ...prev,
      [competitionId]: {
        ...prev[competitionId],
        [action]: prev[competitionId][action] + 1
      }
    }));
  };

  return (
    <SocialRealtimeProvider>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">Art Competitions</h1>
      
      {/* Social Features Badge */}
      <div className="flex justify-center mb-8">
        <div className="badge badge-primary badge-lg gap-2">
          <TrophyIcon className="w-4 h-4" />
          <span>Competition Social Features Enabled</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((competition, index) => {
            const competitionId = index === 0 ? "monthly-surreal" : "quarterly-cityscape";
            return (
              <div key={index} className="p-4 bg-white shadow-md rounded-lg group hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold">{competition.type} Competition</h3>
                <p className="mt-2">Prompt: {competition.prompt}</p>
                <p className="mt-2 text-gray-600">Deadline: {competition.deadline}</p>
                
                {/* Enhanced Social Section */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <EyeIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData[competitionId].views}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction(competitionId, 'loves')}
                      className="flex items-center gap-1 text-red-500 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData[competitionId].loves}</span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageCircleIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData[competitionId].comments}</span>
                    </div>
                    <button 
                      onClick={() => handleSocialAction(competitionId, 'votes')}
                      className="flex items-center gap-1 text-purple-600 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <VoteIcon className="w-4 h-4" />
                      <span className="text-xs">{socialData[competitionId].votes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    </SocialRealtimeProvider>
  );
};

export default CompetitionsPage;