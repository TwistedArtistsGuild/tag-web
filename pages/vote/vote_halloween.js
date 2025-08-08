/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ThumbsUpIcon, MessageSquareIcon } from "lucide-react" // Import icons for voting and comments
import { getRandomStockPhotoByCategory } from "@/utils/stockPhotos"

const getRandomStockPhoto = () => getRandomStockPhotoByCategory('general')

export default function HalloweenContest() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: "Spooky Haunted Mansion",
      artist: "Ghostly Painter",
      imageUrl: getRandomStockPhoto(),
      description: "A chilling digital painting of a mansion where spirits linger.",
      votes: 125,
      comments: [
        { id: 1, author: "ArtLover", text: "So atmospheric! Love the details." },
        { id: 2, author: "SpookyFan", text: "Gave me chills, amazing work!" },
      ],
    },
    {
      id: 2,
      title: "Pumpkin Patch Nightmare",
      artist: "Carving King",
      imageUrl: getRandomStockPhoto(),
      description: "An intricate pumpkin carving that comes alive at night.",
      votes: 98,
      comments: [{ id: 3, author: "JackOLantern", text: "Best pumpkin I've ever seen!" }],
    },
    {
      id: 3,
      title: "Witch's Brew Cauldron",
      artist: "Mystic Sculptor",
      imageUrl: getRandomStockPhoto(),
      description: "A bubbling cauldron sculpture, perfect for a witch's lair.",
      votes: 150,
      comments: [
        { id: 4, author: "PotionMaster", text: "The details on the bubbles are fantastic!" },
        { id: 5, author: "MagicUser", text: "I can almost smell the potion!" },
      ],
    },
    {
      id: 4,
      title: "Zombie Apocalypse",
      artist: "Undead Illustrator",
      imageUrl: getRandomStockPhoto(),
      description: "A gruesome comic-style illustration of the end of days.",
      votes: 80,
      comments: [{ id: 6, author: "HorrorFan", text: "Brutally good!" }],
    },
  ])

  const [newCommentText, setNewCommentText] = useState("")

  const handleVote = (id) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, votes: entry.votes + 1 } : entry)))
  }

  const handleAddComment = (entryId) => {
    if (newCommentText.trim() === "") return

    setEntries(
      entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              comments: [
                ...entry.comments,
                { id: entry.comments.length + 1, author: "Anonymous", text: newCommentText.trim() },
              ],
            }
          : entry,
      ),
    )
    setNewCommentText("") // Clear the comment input after adding
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300 py-8 px-4" data-theme="halloween">
      <div className="container mx-auto">
        {/* Hero Section for Halloween Contest */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-700">
            🎃 Halloween Art Contest 👻
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-6">
            Vote for your favorite spooky creations and help crown our Halloween champion!
          </p>
          <p className="text-lg text-base-content max-w-3xl mx-auto">
            Welcome to the Twisted Artists Guild&apos;s annual Halloween Art Contest! Explore a gallery of eerie, enchanting,
            and outright terrifying artworks submitted by our talented community. Cast your vote for the pieces that
            send shivers down your spine or capture the true spirit of Halloween.
          </p>
        </section>

        {/* Contest Rules/Guidelines Section */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Contest Guidelines</h2>
          <ul className="list-disc pl-5 text-lg text-base-content space-y-2">
            <li>Each user can vote once per artwork.</li>
            <li>Voting closes on November 1st at 11:59 PM PST.</li>
            <li>Winners will be announced on November 3rd on our main blog.</li>
            <li>Be respectful in comments and support your fellow artists!</li>
          </ul>
        </section>

        {/* Contest Entries Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">Contest Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <figure className="relative h-60 w-full">
                  <Image
                    src={entry.imageUrl || "/placeholder.svg"}
                    alt={entry.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-box"
                  />
                </figure>
                <div className="card-body p-6">
                  <h3 className="card-title text-2xl text-primary">{entry.title}</h3>
                  <p className="text-lg text-gray-700">By: {entry.artist}</p>
                  <p className="text-sm text-base-content line-clamp-3">{entry.description}</p>
                  <div className="card-actions justify-between items-center mt-4">
                    <button onClick={() => handleVote(entry.id)} className="btn btn-primary btn-sm">
                      <ThumbsUpIcon className="w-4 h-4 mr-1" />
                      Vote ({entry.votes})
                    </button>
                    <div className="flex items-center text-gray-600">
                      <MessageSquareIcon className="w-4 h-4 mr-1" />
                      {entry.comments.length} Comments
                    </div>
                  </div>

                  {/* Comments Section for each entry */}
                  <div className="mt-6 pt-4 border-t border-base-200">
                    <h4 className="text-lg font-semibold text-primary mb-3">Comments</h4>
                    {entry.comments.length > 0 ? (
                      <div className="space-y-3 max-h-32 overflow-y-auto pr-2">
                        {entry.comments.map((comment) => (
                          <div key={comment.id} className="text-sm bg-base-200 p-2 rounded-lg">
                            <span className="font-medium text-secondary">{comment.author}:</span> {comment.text}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="input input-bordered input-sm flex-grow"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(entry.id)
                          }
                        }}
                      />
                      <button onClick={() => handleAddComment(entry.id)} className="btn btn-primary btn-sm">
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Main Contest Page */}
        <div className="mt-12 text-center">
          <Link href="/vote" className="btn btn-secondary btn-lg">
            Back to Contest Hub
          </Link>
        </div>
      </div>
    </div>
  )
}
