/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Head from 'next/head';
import { useState } from 'react';

export default function Competitions() {
    const [competitions, setCompetitions] = useState([
        { id: 1, theme: 'Halloween', category: 'Video - Dance', likes: 120, comments: ['Amazing choreography!', 'So spooky and fun!'] },
        { id: 2, theme: 'Halloween', category: 'Painting', likes: 85, comments: ['Beautiful colors!', 'This captures the Halloween spirit perfectly.'] },
        { id: 3, theme: 'Halloween', category: 'Yard Art Sculpture', likes: 150, comments: ['Incredible detail!', 'This is the clear winner for me.'] },
        { id: 4, theme: 'Halloween', category: 'Digital Art', likes: 60, comments: ['Very creative!', 'Love the concept.'] },
        { id: 5, theme: 'Halloween', category: 'Costume Design', likes: 45, comments: ['Great craftsmanship!', 'This is so unique.'] },
    ]);

    const [filter, setFilter] = useState({ category: 'All', theme: 'All' });

    const handleLike = (id) => {
        setCompetitions(competitions.map(comp => comp.id === id ? { ...comp, likes: comp.likes + 1 } : comp));
    };

    const handleComment = (id, comment) => {
        setCompetitions(competitions.map(comp => comp.id === id ? { ...comp, comments: [...comp.comments, comment] } : comp));
    };

    const filteredCompetitions = competitions.filter(comp => {
        return (filter.category === 'All' || comp.category === filter.category) &&
               (filter.theme === 'All' || comp.theme === filter.theme);
    });

    return (
        <>
            <Head>
                <title>Competitions - Twisted Artists Guild</title>
            </Head>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">Art Competitions</h1>

                <div className="mb-4">
                    <label htmlFor="categoryFilter" className="block text-lg font-medium">Filter by Category:</label>
                    <select
                        id="categoryFilter"
                        className="border rounded px-2 py-1"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="All">All</option>
                        <option value="Video - Dance">Video - Dance</option>
                        <option value="Painting">Painting</option>
                        <option value="Yard Art Sculpture">Yard Art Sculpture</option>
                        <option value="Digital Art">Digital Art</option>
                        <option value="Costume Design">Costume Design</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="themeFilter" className="block text-lg font-medium">Filter by Theme:</label>
                    <select
                        id="themeFilter"
                        className="border rounded px-2 py-1"
                        value={filter.theme}
                        onChange={(e) => setFilter({ ...filter, theme: e.target.value })}
                    >
                        <option value="All">All</option>
                        <option value="Halloween">Halloween</option>
                        {/* Add more themes here */}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCompetitions.map(comp => (
                        <div key={comp.id} className="border rounded p-4 shadow">
                            <h2 className="text-2xl font-semibold">{comp.theme}</h2>
                            <p className="text-sm text-gray-600">Category: {comp.category}</p>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => handleLike(comp.id)}
                            >
                                Like ({comp.likes})
                            </button>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium">Comments:</h3>
                                <ul className="list-disc pl-5">
                                    {comp.comments.map((comment, index) => (
                                        <li key={index} className="text-sm">{comment}</li>
                                    ))}
                                </ul>
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    className="border rounded px-2 py-1 mt-2 w-full"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            handleComment(comp.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                
            </main>
        </>
    );
}