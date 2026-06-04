import sanitizeHtml from "sanitize-html";

const DEFAULT_ALLOWED_SCHEMES = ["https", "mailto"];

const DEFAULT_ALLOWED_SCHEMES_BY_TAG = {
  img: ["https"],
  iframe: ["https"],
};

const TRUSTED_IFRAME_HOSTNAMES = [
  "player.vimeo.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
];

const UNIFORM_CARD_ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "div",
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "span",
];

const BLOG_BODY_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "div",
  "img",
  "iframe",
  "blockquote",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
];

function ensureSafeAnchorRel(tagName, attribs) {
  const nextAttribs = { ...attribs };
  if (nextAttribs.target === "_blank") {
    const relValues = new Set(
      String(nextAttribs.rel || "")
        .split(/\s+/)
        .filter(Boolean)
        .map((value) => value.toLowerCase())
    );
    relValues.add("noopener");
    relValues.add("noreferrer");
    nextAttribs.rel = Array.from(relValues).join(" ");
  }

  return {
    tagName,
    attribs: nextAttribs,
  };
}

export function stripHtmlText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeCardHtml(html) {
  return sanitizeHtml(String(html || ""), {
    allowedTags: UNIFORM_CARD_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      div: ["style"],
      p: ["style"],
      span: ["style"],
    },
    allowedSchemes: DEFAULT_ALLOWED_SCHEMES,
    transformTags: {
      a: ensureSafeAnchorRel,
    },
    allowedStyles: {
      h1: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
      h2: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
      h3: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
      div: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
      p: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
      span: {
        "text-align": [/^left$/, /^center$/, /^right$/],
        "font-family": [/^[\w\s\-",']+$/],
      },
    },
  });
}

export function sanitizeDefaultHtml(html) {
  return sanitizeHtml(String(html || ""), {
    allowedTags: BLOG_BODY_ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel"],
      p: ["style"],
      span: ["style"],
      div: ["style"],
      img: ["src", "alt", "title", "width", "height", "style", "class"],
      iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "style"],
      h1: ["id", "style"],
      h2: ["id", "style"],
      h3: ["id", "style"],
      h4: ["id", "style"],
      h5: ["id", "style"],
      blockquote: ["style"],
    },
    allowedSchemes: DEFAULT_ALLOWED_SCHEMES,
    allowedSchemesByTag: DEFAULT_ALLOWED_SCHEMES_BY_TAG,
    allowedIframeHostnames: TRUSTED_IFRAME_HOSTNAMES,
    transformTags: {
      a: ensureSafeAnchorRel,
    },
    allowedStyles: {
      p: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      span: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      div: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      h1: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      h2: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      h3: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      h4: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      h5: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      blockquote: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      img: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
      iframe: {
        "text-align": [/^left$/, /^center$/, /^right$/],
      },
    },
  });
}


