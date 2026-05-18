/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { CalendarIcon, MapPinIcon } from "lucide-react"

// Placeholder events until a real events API is wired up
const DUMMY_EVENTS = [
  {
    id: 1,
    title: "Gallery Opening",
    date: "2023-12-15",
    location: "Downtown Art Gallery",
    description: "Come see the latest collection of works in this exclusive gallery opening.",
  },
  {
    id: 2,
    title: "Art Workshop",
    date: "2024-01-10",
    location: "Community Center",
    description: "Learn techniques and tips in this hands-on workshop for artists of all levels.",
  },
  {
    id: 3,
    title: "Virtual Exhibition",
    date: "2024-01-25",
    location: "Online",
    description: "Join us online for a virtual tour of the newest artistic creations.",
  },
]

const ArtistEventsSection = ({ events = DUMMY_EVENTS }) => (
  <div id="events" className="mt-12">
    <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Upcoming Events</h2>
    {events.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
            <div className="card-body p-4">
              <h3 className="card-title text-primary text-lg">{event.title}</h3>
              <div className="flex items-center text-sm mb-1 text-base-content/70">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-sm mb-3 text-base-content/70">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {event.location}
              </div>
              <p className="text-sm text-base-content/80">{event.description}</p>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-sm btn-outline btn-primary">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-base-content/60">No upcoming events for this artist.</p>
    )}
  </div>
)

export default ArtistEventsSection
