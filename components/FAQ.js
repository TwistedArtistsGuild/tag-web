/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import { useRef, useState } from "react"

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [
	{
		question: "What is the Twisted Artists Guild (TAG) and who does it serve?",
		answer: (
			<div className="space-y-2 leading-relaxed">
				TAG is a dynamic B2B2C platform designed to bridge the gap between creative artists and appreciative art lovers. On one side, we empower independent artists and creative professionals by giving them a free, powerful space to showcase their portfolio, manage sales, and promote creative services and classes. On the other side, our art-loving public finds an aesthetic, easy-to-navigate marketplace to purchase unique art pieces, event tickets, merchandise, and exclusive classes. In short, TAG isn’t just an art gallery – it’s a full-service business manager that helps artists focus on creativity while we handle commerce, customer support, and reliable delivery.
			</div>
		),
	},
	{
		question: "How can I purchase art, tickets, or merchandise on TAG?",
		answer: (
			<div className="space-y-2 leading-relaxed">
				For our art-loving public, TAG is built with ease of use and beauty in mind. Once you visit our site, you’ll find curated listings that make finding your next art piece or event a breeze. Our streamlined checkout process guarantees timely delivery, and our customer support team is dedicated to smoothing out any issues – whether that’s tracking your order or handling special circumstances. Simply browse our intuitive marketplace and make your purchase with confidence, knowing that we stand behind every sale.
			</div>
		),
	},
	{
		question: "How do I register as an Artist Member and what benefits do I receive?",
		answer: (
			<div className="space-y-2 leading-relaxed">
				Becoming a TAG Artist Member is both free and empowering. Sign up at /artists/register/ to create your artist profile, where you can highlight your portfolio, link to your listings and events, and even showcase a timeline of your creative journey. Our platform is designed to be a business manager in your corner—providing you with tools such as a sales dashboard, CRM capabilities, event ticketing support, and even automated workflow forms to help streamline your day-to-day operations. Our goal is to reduce administrative burdens so you can focus on what you do best: creating art.
			</div>
		),
	},
	{
		question: "How does TAG ensure top-tier customer support for its buyers?",
		answer: (
			<div className="space-y-2 leading-relaxed">
				Our commitment to exceptional customer service underpins everything we do. For art buyers, TAG promises a hassle-free experience—from prompt shipping of art, tickets, and merchandise to proactive support if issues arise. Imagine having a live support system that intercepts last-minute inquiries (even those “Oops, when do doors open?” moments) and ensures you always get the information you need. And should any unforeseen circumstance occur (like an artist dealing with emergencies), we’re prepared with clear refund policies and resolution measures to keep you satisfied.
			</div>
		),
	},
	{
		question: "What are TAG’s pricing and fee structures?",
		answer: (
			<div className="space-y-2 leading-relaxed">
				For the most part, TAG is free for artists to set up their profiles and showcase their work. Our revenue model is based on a simple percentage fee on sales, helping us maintain and improve the platform while keeping access affordable. While there’s occasional discussion around introducing a nominal membership fee (projected at around $60 per year), our primary revenue remains a commission on successful transactions. This structure assures both artists and buyers that quality, transparency, and top-notch customer service remain our cornerstones.
			</div>
		),
	},
]

const Item = ({ item }) => {
	const accordion = useRef(null)
	const [isOpen, setIsOpen] = useState(false)

	return (
		<li>
			<button
				className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
				onClick={(e) => {
					e.preventDefault()
					setIsOpen(!isOpen)
				}}
				aria-expanded={isOpen}
			>
				<span
					className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
				>
					{item?.question}
				</span>
				<svg
					className={"flex-shrink-0 w-4 h-4 ml-auto fill-current"}
					viewBox="0 0 16 16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						y="7"
						width="16"
						height="2"
						rx="1"
						className={`transform origin-center transition duration-200 ease-out ${
							isOpen && "rotate-180"
						}`}
					/>
					<rect
						y="7"
						width="16"
						height="2"
						rx="1"
						className={`transform origin-center rotate-90 transition duration-200 ease-out ${
							isOpen && "rotate-180 hidden"
						}`}
					/>
				</svg>
			</button>

			<div
				ref={accordion}
				className={"transition-all duration-300 ease-in-out opacity-80 overflow-hidden"}
				style={
					isOpen
						? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
						: { maxHeight: 0, opacity: 0 }
				}
			>
				<div className="pb-5 leading-relaxed">{item?.answer}</div>
			</div>
		</li>
	)
}

const FAQ = () => {
	return (
		<section className="bg-base-200" id="faq">
			<div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
				<div className="flex flex-col text-left basis-1/2">
					<p className="inline-block font-semibold text-primary mb-4">FAQ</p>
					<p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
					</p>
				</div>

				<ul className="basis-1/2">
					{faqList.map((item, i) => (
						<Item key={i} item={item} />
					))}
				</ul>
			</div>
		</section>
	)
}

export default FAQ

