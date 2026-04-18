import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { getFontOptions, getTiptapExtensions } from "@/components/widgets/tiptap-presets";
import { toVimeoEmbedUrl } from "@/components/widgets/tiptap-vimeo";

function normalizeUrl(rawUrl) {
  if (!rawUrl) {
    return "";
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function normalizeHeadingLevels(inputLevels, fallbackLevels) {
  if (!Array.isArray(inputLevels) || inputLevels.length === 0) {
    return fallbackLevels;
  }

  const normalized = inputLevels
    .map((level) => Number(level))
    .filter((level) => Number.isInteger(level) && level >= 1 && level <= 3);

  if (normalized.length === 0) {
    return fallbackLevels;
  }

  return Array.from(new Set(normalized)).sort((a, b) => a - b);
}

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      className={`btn btn-xs h-8 min-h-8 px-2 normal-case ${
        active ? "btn-primary" : "btn-ghost border border-base-300"
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      <span className="inline-flex items-center justify-center leading-none">
        {children || label}
      </span>
    </button>
  );
}

export default function TiptapEditor({
  value = "",
  onChange = () => {},
  placeholder = "Write something...",
  readOnly = false,
  preset = "minimal",
  className = "",
  onKeyDown,
  singleLine = false,
  minHeight = 96,
  actionPreset = "none",
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  emptySubmitMessage = "Write something before submitting.",
  clearOnSubmit = false,
  onSaveDraft,
  onPublish,
  saveDraftLabel = "Save Draft",
  publishLabel = "Publish",
  fontScope,
  allowedFonts = [],
  enableSingleLineFontSelection = false,
  headingLevels,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const [actionValue, setActionValue] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [actionLabelDirty, setActionLabelDirty] = useState(false);
  const [titleLookupStatus, setTitleLookupStatus] = useState("idle");
  const [suggestedLabel, setSuggestedLabel] = useState("");
  const [actionError, setActionError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fontOptions = getFontOptions({ preset, fontScope, allowedFonts });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getTiptapExtensions(preset, placeholder),
    content: value || "",
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "prose max-w-none p-3 focus:outline-none",
        style: `min-height: ${minHeight}px;`,
      },
      handleKeyDown: (view, event) => {
        if (singleLine && event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          return true;
        }

        if (onKeyDown) {
          onKeyDown(event);
          return event.defaultPrevented;
        }

        return false;
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const next = value || "";
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next, false);
    }
  }, [editor, value]);

  const resetActionUi = useCallback(() => {
    setActiveAction(null);
    setActionValue("");
    setActionLabel("");
    setActionLabelDirty(false);
    setTitleLookupStatus("idle");
    setSuggestedLabel("");
    setActionError("");
  }, []);

  const runInsertWithFallback = useCallback(
    (insertFn) => {
      if (!editor) {
        return false;
      }

      const firstAttempt = insertFn();
      if (firstAttempt) {
        return true;
      }

      editor.commands.focus("end");
      return insertFn();
    },
    [editor]
  );

  const normalizeAndValidateUrl = useCallback((rawUrl) => {
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) {
      return "";
    }

    try {
      const parsed = new URL(normalized);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return "";
      }
      return normalized;
    } catch {
      return "";
    }
  }, []);

  const openAction = useCallback(
    (type) => {
      if (!editor) {
        return;
      }

      setActionError("");
      setActiveAction(type);

      if (type === "link") {
        const currentHref = editor.getAttributes("link").href || "";
        const selectedText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          " "
        );
        setActionValue(currentHref);
        setActionLabel(selectedText || "");
        setActionLabelDirty(Boolean(selectedText?.trim()));
        setSuggestedLabel("");
        setTitleLookupStatus("idle");
        return;
      }

      setActionValue("");
      setActionLabel("");
      setActionLabelDirty(false);
      setSuggestedLabel("");
      setTitleLookupStatus("idle");
    },
    [editor]
  );

  useEffect(() => {
    if (activeAction !== "link") {
      return;
    }

    const normalizedUrl = normalizeAndValidateUrl(actionValue);
    if (!normalizedUrl || actionLabelDirty) {
      setTitleLookupStatus("idle");
      setSuggestedLabel("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      setTitleLookupStatus("loading");

      try {
        const response = await fetch(`/api/link-title?url=${encodeURIComponent(normalizedUrl)}`);
        if (!response.ok) {
          throw new Error("Link title lookup failed");
        }

        const data = await response.json();
        const title = (data?.title || "").trim();

        if (title) {
          setActionLabel(title);
          setSuggestedLabel(title);
          setTitleLookupStatus("resolved");
          return;
        }

        setSuggestedLabel("");
        setTitleLookupStatus("idle");
      } catch {
        setTitleLookupStatus("error");
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [activeAction, actionLabelDirty, actionValue, normalizeAndValidateUrl]);

  const submitAction = useCallback(() => {
    if (!editor) {
      return;
    }

    if (!activeAction) {
      return;
    }

    if (actionValue.trim() === "") {
      setActionError("Enter a URL first.");
      return;
    }

    const normalizedUrl = normalizeAndValidateUrl(actionValue);
    if (!normalizedUrl) {
      setActionError("That URL looks invalid.");
      return;
    }

    if (activeAction === "link") {
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        " "
      );

      if (selectedText.trim()) {
        const linkText = actionLabel.trim();
        const selectionFrom = editor.state.selection.from;
        const didLink = linkText
          ? editor
              .chain()
              .focus()
              .insertContent(linkText)
              .setTextSelection({
                from: selectionFrom,
                to: selectionFrom + linkText.length,
              })
              .setLink({ href: normalizedUrl })
              .run()
          : editor.chain().focus().setLink({ href: normalizedUrl }).run();

        if (!didLink) {
          setActionError("Could not apply link to current selection.");
          return;
        }

        resetActionUi();
        return;
      }

      let label = actionLabel.trim();
      if (!label) {
        label = normalizedUrl;
      }

      try {
        if (!actionLabel.trim()) {
          label = new URL(normalizedUrl).hostname.replace(/^www\./i, "");
        }
      } catch {
        if (!actionLabel.trim()) {
          label = normalizedUrl;
        }
      }

      const from = editor.state.selection.from;
      const didInsert = runInsertWithFallback(() =>
        editor
          .chain()
          .focus()
          .insertContent(label)
          .setTextSelection({ from, to: from + label.length })
          .setLink({ href: normalizedUrl })
          .run()
      );

      if (!didInsert) {
        setActionError("Could not insert link at cursor.");
        return;
      }

      resetActionUi();
      return;
    }

    if (activeAction === "image") {
      const hasSetImage = typeof editor.commands.setImage === "function";
      const didInsert = runInsertWithFallback(() =>
        hasSetImage
          ? editor.chain().focus().setImage({ src: normalizedUrl }).run()
          : editor
              .chain()
              .focus()
              .insertContent(`<img src="${normalizedUrl}" alt="Embedded image" />`)
              .run()
      );

      if (!didInsert) {
        setActionError("Could not insert image in this editor context.");
        return;
      }

      resetActionUi();
      return;
    }

    if (activeAction === "youtube") {
      const didInsert =
        typeof editor.commands.setYoutubeVideo === "function" &&
        runInsertWithFallback(() => editor.commands.setYoutubeVideo({ src: normalizedUrl }));

      if (!didInsert) {
        setActionError("Could not insert YouTube video. Try a full watch URL.");
        return;
      }

      resetActionUi();
      return;
    }

    if (activeAction === "vimeo") {
      const embed = toVimeoEmbedUrl(normalizedUrl);
      if (!embed) {
        setActionError("Invalid Vimeo URL.");
        return;
      }

      let didInsert =
        typeof editor.commands.setVimeoVideo === "function" &&
        runInsertWithFallback(() => editor.commands.setVimeoVideo({ src: embed }));

      if (!didInsert) {
        didInsert = runInsertWithFallback(() =>
          editor
            .chain()
            .focus()
            .insertContent(
              `<iframe src="${embed}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="true"></iframe><p></p>`
            )
            .run()
        );
      }

      if (!didInsert) {
        setActionError("Could not insert Vimeo video. Try clicking into the editor body and retry.");
        return;
      }

      resetActionUi();
    }
  }, [
    activeAction,
    actionValue,
    actionLabel,
    editor,
    normalizeAndValidateUrl,
    resetActionUi,
    runInsertWithFallback,
  ]);

  const handleSubmitAction = useCallback(() => {
    if (!editor || typeof onSubmit !== "function") {
      return;
    }

    const html = editor.getHTML() || "";
    const textOnly = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!textOnly) {
      setSubmitError(emptySubmitMessage);
      return;
    }

    setSubmitError("");
    onSubmit(html);

    if (clearOnSubmit) {
      editor.commands.clearContent(true);
    }
  }, [clearOnSubmit, editor, emptySubmitMessage, onSubmit]);

  const handleCancelAction = useCallback(() => {
    setSubmitError("");

    if (typeof onCancel === "function") {
      onCancel();
    }
  }, [onCancel]);

  const handleSaveDraftAction = useCallback(() => {
    if (!editor || typeof onSaveDraft !== "function") {
      return;
    }

    const html = editor.getHTML() || "";
    const textOnly = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!textOnly) {
      setSubmitError(emptySubmitMessage);
      return;
    }

    setSubmitError("");
    onSaveDraft(html);
  }, [editor, emptySubmitMessage, onSaveDraft]);

  const handlePublishAction = useCallback(() => {
    if (!editor || typeof onPublish !== "function") {
      return;
    }

    const html = editor.getHTML() || "";
    const textOnly = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!textOnly) {
      setSubmitError(emptySubmitMessage);
      return;
    }

    setSubmitError("");
    onPublish(html);

    if (clearOnSubmit) {
      editor.commands.clearContent(true);
    }
  }, [clearOnSubmit, editor, emptySubmitMessage, onPublish]);

  const applyFontFamily = useCallback(
    (nextFontValue) => {
      if (!editor) {
        return;
      }

      if (!nextFontValue || nextFontValue === "__default__") {
        editor.chain().focus().unsetFontFamily().run();
        return;
      }

      editor.chain().focus().setFontFamily(nextFontValue).run();
    },
    [editor]
  );

  const toggleOrderedList = useCallback(() => {
    if (!editor) {
      return;
    }

    const hasText = editor.state.doc.textContent.trim().length > 0;
    if (hasText) {
      editor.chain().focus().toggleOrderedList().run();
      return;
    }

    editor.commands.setContent("<ol><li></li></ol>", false);
    editor.commands.focus("end");
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    if (!editor) {
      return;
    }

    const hasText = editor.state.doc.textContent.trim().length > 0;
    if (hasText) {
      editor.chain().focus().toggleBulletList().run();
      return;
    }

    editor.commands.setContent("<ul><li></li></ul>", false);
    editor.commands.focus("end");
  }, [editor]);

  if (!editor) {
    return <div className="h-24 w-full animate-pulse rounded bg-base-200" />;
  }

  const canUseRichBlocks = preset === "full";
  const canUseMedia = preset === "medium" || preset === "full";
  const canUseLists = !singleLine;
  const canUseFonts = (!singleLine || enableSingleLineFontSelection) && fontOptions.length > 0;
  const resolvedHeadingLevels = normalizeHeadingLevels(
    headingLevels,
    canUseRichBlocks ? [2] : []
  );
  const canUseHeadingButtons = resolvedHeadingLevels.length > 0;
  const showSubmitCancel = !readOnly && actionPreset === "submit-cancel";
  const showSavePublish = !readOnly && actionPreset === "save-publish";
  const activeFontFamily = editor.getAttributes("textStyle")?.fontFamily || "";
  const activeFontValue =
    activeFontFamily && fontOptions.some((font) => font.value === activeFontFamily)
      ? activeFontFamily
      : "__default__";

  return (
    <div className={`rounded border border-base-300 bg-base-100 ${className}`}>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 border-b border-base-300 bg-base-200 p-2">
          {canUseFonts && (
            <select
              className="select select-bordered select-xs h-8 min-h-8 w-40"
              aria-label="Select font"
              title="Select font family"
              value={activeFontValue}
              onChange={(event) => applyFontFamily(event.target.value)}
            >
              <option value="__default__">Font: Default</option>
              {fontOptions.map((font) => (
                <option key={font.key} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          )}
          <ToolbarButton
            label="B"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong className="font-extrabold">B</strong>
          </ToolbarButton>
          <ToolbarButton
            label="I"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em className="italic">I</em>
          </ToolbarButton>
          <ToolbarButton
            label="U"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="underline decoration-2">U</span>
          </ToolbarButton>
          <ToolbarButton
            label="S"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span className="line-through">S</span>
          </ToolbarButton>
          {canUseLists && (
            <>
              <ToolbarButton
                label="OL"
                active={editor.isActive("orderedList")}
                onClick={toggleOrderedList}
              >
                <span className="text-xs font-semibold">1.</span>
              </ToolbarButton>
              <ToolbarButton
                label="UL"
                active={editor.isActive("bulletList")}
                onClick={toggleBulletList}
              >
                <span className="text-xs font-semibold">•</span>
              </ToolbarButton>
            </>
          )}
          {canUseHeadingButtons && (
            <>
              {resolvedHeadingLevels.map((level) => (
                <ToolbarButton
                  key={level}
                  label={`H${level}`}
                  active={editor.isActive("heading", { level })}
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                >
                  <span className="text-xs font-bold">{`H${level}`}</span>
                </ToolbarButton>
              ))}
            </>
          )}
          {canUseRichBlocks && (
            <>
              <ToolbarButton
                label="Quote"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <span className="text-sm">❝</span>
              </ToolbarButton>
              <ToolbarButton
                label="HR"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <span className="w-4 border-t-2 border-current" />
              </ToolbarButton>
            </>
          )}
          <ToolbarButton
            label="Link"
            active={editor.isActive("link")}
            onClick={() => openAction("link")}
          >
            <span className="text-xs font-semibold">Link</span>
          </ToolbarButton>
          {canUseMedia && (
            <>
              <ToolbarButton label="Image" onClick={() => openAction("image")}>
                <span className="text-xs font-semibold">Image</span>
              </ToolbarButton>
              <ToolbarButton label="YouTube" onClick={() => openAction("youtube")}>
                <span className="text-xs font-semibold">YouTube</span>
              </ToolbarButton>
              <ToolbarButton label="Vimeo" onClick={() => openAction("vimeo")}>
                <span className="text-xs font-semibold">Vimeo</span>
              </ToolbarButton>
            </>
          )}
          <ToolbarButton
            label="Clear"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <span className="text-xs font-semibold">Clear</span>
          </ToolbarButton>
        </div>
      )}
      {!readOnly && activeAction && (
        <div className="flex flex-wrap items-center gap-2 border-b border-base-300 bg-base-100 px-3 py-2">
          <span className="text-xs font-semibold uppercase text-base-content/70">
            {activeAction === "link" ? "Link URL" : `${activeAction} URL`}
          </span>
          <input
            type="url"
            className="input input-bordered input-sm w-full max-w-md"
            placeholder="https://..."
            value={actionValue}
            onChange={(event) => {
              setActionValue(event.target.value);
              if (actionError) {
                setActionError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitAction();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                resetActionUi();
              }
            }}
            autoFocus
          />
          {activeAction === "link" && (
            <input
              type="text"
              className="input input-bordered input-sm w-full max-w-sm"
              placeholder="Link text (optional)"
              value={actionLabel}
              onChange={(event) => {
                setActionLabel(event.target.value);
                setActionLabelDirty(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitAction();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  resetActionUi();
                }
              }}
            />
          )}
          {activeAction === "link" && titleLookupStatus === "loading" && (
            <span className="text-xs text-base-content/70">Fetching page title...</span>
          )}
          {activeAction === "link" && suggestedLabel && actionLabelDirty && (
            <button
              type="button"
              className="btn btn-xs btn-ghost"
              onClick={() => {
                setActionLabel(suggestedLabel);
                setActionLabelDirty(false);
              }}
            >
              Use suggested title
            </button>
          )}
          {activeAction === "link" && titleLookupStatus === "error" && !actionError && (
            <span className="text-xs text-warning">Could not fetch page title.</span>
          )}
          <button type="button" className="btn btn-sm btn-primary" onClick={submitAction}>
            Insert
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={resetActionUi}>
            Cancel
          </button>
          {actionError && <p className="w-full text-xs text-error">{actionError}</p>}
        </div>
      )}
      <EditorContent editor={editor} />
      {showSubmitCancel && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-base-300 bg-base-100 p-2">
          <button type="button" className="btn btn-sm btn-outline" onClick={handleCancelAction}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={handleSubmitAction}>
            {submitLabel}
          </button>
          {submitError && <p className="w-full text-xs text-error">{submitError}</p>}
        </div>
      )}
      {showSavePublish && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-base-300 bg-base-100 p-2">
          <button type="button" className="btn btn-sm btn-outline" onClick={handleSaveDraftAction}>
            {saveDraftLabel}
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={handlePublishAction}>
            {publishLabel}
          </button>
          {submitError && <p className="w-full text-xs text-error">{submitError}</p>}
        </div>
      )}
    </div>
  );
}
