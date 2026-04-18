import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import Vimeo from "@/components/widgets/tiptap-vimeo";

export const FONT_LIBRARY = [
  { key: "system-sans", label: "System Sans", value: "system-ui, sans-serif" },
  { key: "arial", label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { key: "helvetica", label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { key: "verdana", label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { key: "tahoma", label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { key: "trebuchet", label: "Trebuchet MS", value: "Trebuchet MS, Helvetica, sans-serif" },
  { key: "gill-sans", label: "Gill Sans", value: "Gill Sans, Gill Sans MT, Calibri, sans-serif" },
  { key: "segoe", label: "Segoe UI", value: "Segoe UI, Tahoma, sans-serif" },
  { key: "candara", label: "Candara", value: "Candara, Calibri, Segoe, sans-serif" },
  { key: "optima", label: "Optima", value: "Optima, Segoe, Candara, sans-serif" },
  { key: "palatino", label: "Palatino", value: "Palatino Linotype, Book Antiqua, Palatino, serif" },
  { key: "georgia", label: "Georgia", value: "Georgia, serif" },
  { key: "times", label: "Times New Roman", value: "Times New Roman, Times, serif" },
  { key: "garamond", label: "Garamond", value: "Garamond, Baskerville, serif" },
  { key: "baskerville", label: "Baskerville", value: "Baskerville, Palatino, serif" },
  { key: "courier-new", label: "Courier New", value: "Courier New, Courier, monospace" },
  { key: "lucida-console", label: "Lucida Console", value: "Lucida Console, Monaco, monospace" },
  { key: "consolas", label: "Consolas", value: "Consolas, Monaco, monospace" },
  {
    key: "playfair-display",
    label: "Playfair Display",
    value: "'Playfair Display', Georgia, serif",
  },
  {
    key: "dancing-script",
    label: "Dancing Script",
    value: "'Dancing Script', cursive",
  },
  {
    key: "great-vibes",
    label: "Great Vibes",
    value: "'Great Vibes', cursive",
  },
  {
    key: "parisienne",
    label: "Parisienne",
    value: "'Parisienne', cursive",
  },
  {
    key: "sacramento",
    label: "Sacramento",
    value: "'Sacramento', cursive",
  },
  {
    key: "pacifico",
    label: "Pacifico",
    value: "'Pacifico', cursive",
  },
  {
    key: "satisfy",
    label: "Satisfy",
    value: "'Satisfy', cursive",
  },
  {
    key: "courgette",
    label: "Courgette",
    value: "'Courgette', cursive",
  },
  { key: "cinzel", label: "Cinzel", value: "'Cinzel', 'Times New Roman', serif" },
  {
    key: "abril-fatface",
    label: "Abril Fatface",
    value: "'Abril Fatface', Georgia, serif",
  },
  {
    key: "cormorant-garamond",
    label: "Cormorant Garamond",
    value: "'Cormorant Garamond', Garamond, serif",
  },
  { key: "bebas-neue", label: "Bebas Neue", value: "'Bebas Neue', Impact, sans-serif" },
  { key: "raleway", label: "Raleway", value: "'Raleway', Arial, sans-serif" },
  { key: "oswald", label: "Oswald", value: "'Oswald', Arial, sans-serif" },
];

const FONT_SCOPE_MAP = {
  minimal: ["system-sans", "arial", "georgia", "courier-new"],
  medium: [
    "system-sans",
    "arial",
    "verdana",
    "trebuchet",
    "segoe",
    "georgia",
    "times",
    "courier-new",
  ],
  full: [
    "system-sans",
    "arial",
    "helvetica",
    "verdana",
    "tahoma",
    "trebuchet",
    "gill-sans",
    "segoe",
    "candara",
    "optima",
    "palatino",
    "georgia",
    "times",
    "garamond",
    "baskerville",
    "courier-new",
    "lucida-console",
    "consolas",
  ],
  comment: ["system-sans", "arial", "verdana", "georgia", "courier-new"],
  article: [
    "system-sans",
    "arial",
    "helvetica",
    "segoe",
    "palatino",
    "georgia",
    "times",
    "garamond",
    "baskerville",
    "courier-new",
    "consolas",
  ],
  title: [
    "dancing-script",
    "great-vibes",
    "parisienne",
    "sacramento",
    "pacifico",
    "satisfy",
    "courgette",
    "playfair-display",
    "abril-fatface",
    "raleway",
    "cinzel",
    "cormorant-garamond",
    "bebas-neue",
    "oswald",
    "georgia",
    "times",
    "system-sans",
  ],
  portfolio: FONT_LIBRARY.map((font) => font.key),
};

function resolveScopeKey(preset, fontScope) {
  if (fontScope && FONT_SCOPE_MAP[fontScope]) {
    return fontScope;
  }

  if (FONT_SCOPE_MAP[preset]) {
    return preset;
  }

  return "minimal";
}

function findFontOption(match) {
  if (!match) {
    return null;
  }

  const normalized = String(match).trim().toLowerCase();
  return (
    FONT_LIBRARY.find((font) => font.key === normalized) ||
    FONT_LIBRARY.find((font) => font.label.toLowerCase() === normalized) ||
    FONT_LIBRARY.find((font) => font.value.toLowerCase() === normalized) ||
    null
  );
}

export function getFontOptions({ preset = "minimal", fontScope, allowedFonts = [] } = {}) {
  const scopeKey = resolveScopeKey(preset, fontScope);
  const scopedKeys = FONT_SCOPE_MAP[scopeKey] || FONT_SCOPE_MAP.minimal;
  const scopedOptions = scopedKeys
    .map((key) => FONT_LIBRARY.find((font) => font.key === key))
    .filter(Boolean);

  if (!Array.isArray(allowedFonts) || allowedFonts.length === 0) {
    return scopedOptions;
  }

  // Reminder: pass allowedFonts to TiptapEditor for strict per-context limits.
  const limitedOptions = allowedFonts.map(findFontOption).filter(Boolean);
  if (limitedOptions.length === 0) {
    return scopedOptions;
  }

  return limitedOptions;
}

function baseExtensions(placeholder) {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    TextStyle,
    FontFamily,
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];
}

export function getTiptapExtensions(preset, placeholder) {
  const extensions = baseExtensions(placeholder);

  if (preset === "minimal") {
    return extensions;
  }

  if (preset === "medium" || preset === "full") {
    extensions.push(Image);
    extensions.push(
      Youtube.configure({
        controls: true,
        modestBranding: true,
        nocookie: true,
      })
    );
    extensions.push(Vimeo);
  }

  return extensions;
}
