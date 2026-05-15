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

function getVimeoIdFromEmbedUrl(src) {
  if (!src) {
    return null;
  }

  const match = String(src).match(/player\.vimeo\.com\/video\/(\d+)/i);
  return match?.[1] || null;
}

function getVimeoThumbnailUrl(src) {
  const id = getVimeoIdFromEmbedUrl(src);
  return id ? `https://vumbnail.com/${id}.jpg` : "";
}

function applyPreviewAlignment(dom, align) {
  const value = String(align || "left").toLowerCase();

  if (value === "center") {
    dom.style.marginLeft = "auto";
    dom.style.marginRight = "auto";
    return;
  }

  if (value === "right") {
    dom.style.marginLeft = "auto";
    dom.style.marginRight = "0";
    return;
  }

  dom.style.marginLeft = "0";
  dom.style.marginRight = "auto";
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

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.className = "vimeo-preview-wrapper";
      dom.contentEditable = "false";
      dom.style.position = "relative";
      dom.style.display = "block";
      dom.style.maxWidth = "100%";

      const img = document.createElement("img");
      img.className = "vimeo-preview-image";
      img.alt = "Vimeo preview";
      img.draggable = false;
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.borderRadius = "0.5rem";
      img.style.border = "1px solid rgba(148, 163, 184, 0.45)";
      img.style.background = "rgba(15, 23, 42, 0.08)";

      const badge = document.createElement("div");
      badge.textContent = "Vimeo Preview";
      badge.style.position = "absolute";
      badge.style.left = "8px";
      badge.style.bottom = "8px";
      badge.style.fontSize = "11px";
      badge.style.fontWeight = "700";
      badge.style.padding = "2px 6px";
      badge.style.borderRadius = "999px";
      badge.style.color = "#fff";
      badge.style.background = "rgba(2, 6, 23, 0.66)";
      badge.style.pointerEvents = "none";

      const applyNodeState = (nextNode) => {
        const width = Number(nextNode.attrs?.width) || 640;
        const height = Number(nextNode.attrs?.height) || 360;
        const align = nextNode.attrs?.textAlign || "left";

        dom.style.width = `${width}px`;
        dom.style.height = `${height}px`;
        applyPreviewAlignment(dom, align);

        const thumbnail = getVimeoThumbnailUrl(nextNode.attrs?.src);
        if (thumbnail) {
          img.src = thumbnail;
        }
      };

      applyNodeState(node);
      dom.appendChild(img);
      dom.appendChild(badge);

      return {
        dom,
        update(nextNode) {
          if (nextNode.type.name !== "vimeo") {
            return false;
          }

          applyNodeState(nextNode);
          return true;
        },
      };
    };
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
