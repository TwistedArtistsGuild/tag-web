/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from 'next/head';

export default function News() {
    return (
        <>
            <Head>
                <title>News - Twisted Artists Guild</title>
            </Head>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-4">News</h1>
                <p className="text-lg mb-4">Welcome to the Twisted Artists Guild News Service, where we bring you the latest updates, artist interviews, and insights into the art world. Our team of journalists is dedicated to supporting artists by conducting in-depth interviews, creating engaging content, and reporting on art-related topics with integrity and passion.</p>
                <section className="mt-8">
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-lg mb-4">Our news service is part of the marketing department but operates with journalistic ethical standards. Journalists will conduct market research by asking artists questions from a technical script, capturing close-up interviews, and creating social pieces that benefit the artists. Beyond that, they will report on anything art-related they deem fit, ensuring a vibrant and diverse coverage of the art community.</p>
                </section>
                <section className="mt-8">
                    <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
                    <article className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">Interview with Jane Doe: The Journey of a Digital Artist</h3>
                        <p className="text-lg">Jane Doe shares her experiences transitioning from traditional to digital art, her inspirations, and advice for aspiring artists. Discover how she uses technology to push the boundaries of creativity.</p>
                    </article>
                    <article className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">The Rise of AI in Art: A Double-Edged Sword</h3>
                        <p className="text-lg">Explore the impact of artificial intelligence on the art world, from generating stunning visuals to raising questions about originality and ethics. Our journalists dive deep into this controversial topic.</p>
                    </article>
                </section>
            </main>
        </>
    );
}