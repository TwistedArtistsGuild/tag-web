import { Node, mergeAttributes } from "@tiptap/core";

function toVimeoEmbedUrl(url) {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();
  let parsed;

  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (host.includes("player.vimeo.com")) {
    const videoIndex = segments.findIndex((segment) => segment.toLowerCase() === "video");
    const idFromPlayer = videoIndex >= 0 ? segments[videoIndex + 1] : segments[0];
    const id = idFromPlayer && /^\d+$/.test(idFromPlayer) ? idFromPlayer : null;
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  if (!host.includes("vimeo.com")) {
    return null;
  }

  const idSegment = [...segments].reverse().find((segment) => /^\d+$/.test(segment));
  if (!idSegment) {
    return null;
  }

  return `https://player.vimeo.com/video/${idSegment}`;
}

const Vimeo = Node.create({
  name: "vimeo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 640,
      },
      height: {
        default: 360,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe[src*='player.vimeo.com/video/']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        src: HTMLAttributes.src,
        width: HTMLAttributes.width,
        height: HTMLAttributes.height,
        frameborder: "0",
        allow: "autoplay; fullscreen; picture-in-picture",
        allowfullscreen: "true",
      }),
    ];
  },

  addCommands() {
    return {
      setVimeoVideo:
        (options) =>
        ({ commands }) => {
          const src = toVimeoEmbedUrl(options?.src);
          if (!src) {
            return false;
          }

          const width = Number(options?.width) || 640;
          const height = Number(options?.height) || 360;

          return commands.insertContent(
            `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="true"></iframe><p></p>`
          );
        },
    };
  },
});

export { toVimeoEmbedUrl };
export default Vimeo;
