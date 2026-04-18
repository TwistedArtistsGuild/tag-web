/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

function decodeHtmlEntities(value) {
  if (!value) {
    return "";
  }

  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .replaceAll(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
}

function extractTitle(html) {
  if (!html) {
    return "";
  }

  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match || !match[1]) {
    return "";
  }

  return decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
  if (!rawUrl) {
    res.status(400).json({ error: "Missing url" });
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid protocol");
    }
  } catch {
    res.status(400).json({ error: "Invalid url" });
    return;
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "TAG-LinkTitleFetcher/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const html = await response.text();
    const title = extractTitle(html);

    res.status(200).json({ title: title || "" });
  } catch {
    res.status(502).json({ error: "Failed to fetch title" });
  }
}
