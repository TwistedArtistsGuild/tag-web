/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
const ContactCard = ({ links }) => {
  if (!links.length) {
    return (
      <div className="card-body text-base-content">
        <p>No contact information available for this artist.</p>
      </div>
    )
  }

  return (
    <div className="card-body text-base-content">
      <h2 className="card-title text-primary mb-4">Contact Information</h2>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <li key={index} className="border-b border-base-200 pb-4 last:border-b-0">
            {link.URL && (
              <p className="mb-1">
                <span className="font-semibold">Website:</span>{" "}
                <a href={link.URL} target="_blank" rel="noopener noreferrer" className="link link-primary">
                  {link.Label || link.URL}
                </a>
              </p>
            )}
            {link.Address && (
              <div className="mt-2">
                <p className="font-semibold">Address:</p>
                <p>{link.Address.AddressLine1}</p>
                <p>
                  {link.Address.City}, {link.Address.State} {link.Address.ZipCode}
                </p>
                <p>
                  <span className="font-semibold">Hours:</span> {link.Address.OperationHours}
                </p>
              </div>
            )}
            {link.PhoneContact && (
              <div className="mt-2">
                <p className="font-semibold">Phone:</p>
                <p>{link.PhoneContact.PhoneNumber}</p>
                <p>{link.PhoneContact.Description}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContactCard
