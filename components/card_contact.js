/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useEffect, useState } from "react";

const ContactCard = ({ links }) => {
	if (!links.length) {
		return <p>No contact information available for this artist.</p>;
	}

	return (
		<div>
			<h2>Contact Information</h2>
			<ul>
				{links.map((link, index) => (
					<li key={index}>
						{link.URL && (
							<a href={link.URL} target="_blank" rel="noopener noreferrer">
								{link.Label || link.URL}
							</a>
						)}
						{link.Address && (
							<div>
								<p>{link.Address.AddressLine1}</p>
								<p>{link.Address.City}, {link.Address.State} {link.Address.ZipCode}</p>
								<p>Hours: {link.Address.OperationHours}</p>
							</div>
						)}
						{link.PhoneContact && (
							<div>
								<p>Phone: {link.PhoneContact.PhoneNumber}</p>
								<p>{link.PhoneContact.Description}</p>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactCard;
