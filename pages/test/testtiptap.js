/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import DOMPurify from "dompurify";
import TTSingleLine from "@/components/social/TT_SingleLine";
import TTTitleLine from "@/components/social/TT_TitleLine";
import TTArticle from "@/components/social/TT_Article";
import TTPortfolio from "@/components/social/TT_Portfolio";
import { TTCommentsEditorCard } from "@/components/social/TT_Comments";
import TTDirectMessages from "@/components/social/TT_DirectMessages";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";

function sanitize(html) {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

function PreviewCard({ title, html }) {
  const sanitizedPreview = useMemo(() => sanitize(html), [html]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-base-300 bg-base-100 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-base-content/70">
          {title} HTML Output
        </h3>
        <pre className="max-h-48 overflow-auto rounded bg-base-200 p-3 text-xs whitespace-pre-wrap">
          {html || "(empty)"}
        </pre>
      </div>
      <div className="rounded-lg border border-base-300 bg-base-100 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-base-content/70">
          {title} Rendered Preview
        </h3>
        <div
          className="prose max-w-none rounded bg-base-200 p-3"
          dangerouslySetInnerHTML={{ __html: sanitizedPreview || "<p>(empty)</p>" }}
        />
      </div>
    </div>
  );
}

export default function TiptapTestPage() {
  const [titleLineValue, setTitleLineValue] = useState("");
  const [singleLineValue, setSingleLineValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState("");
  const [articleValue, setArticleValue] = useState("");
  const [articleSubmitted, setArticleSubmitted] = useState("");
  const [portfolioValue, setPortfolioValue] = useState("");
  const [portfolioDraft, setPortfolioDraft] = useState("");
  const [portfolioPublished, setPortfolioPublished] = useState("");

  return (
    <>
      <Head>
        <title>Wysiwyg Module Test - Twisted Artists Guild</title>
        <meta
          name="description"
          content="Test page for validating production TiptapEditor presets and rich text behavior"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-base-200 p-4 md:p-8">
        <section className="mx-auto max-w-5xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Wysiwyg Module Test</h1>
            <Link href="/test" className="btn btn-sm btn-ghost">
              Back to /test
            </Link>
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-4">
            <p className="text-sm text-base-content/80">
              All sections use <code>TiptapEditor</code> directly. WysiwygSingleLine and
              WysiwygTextArea are deprecated.
            </p>
          </div>

          <TTSingleLine value={singleLineValue} onChange={setSingleLineValue} />

          <PreviewCard title="Single Line" html={singleLineValue} />

          <TTTitleLine value={titleLineValue} onChange={setTitleLineValue} />

          <PreviewCard title="Title Line" html={titleLineValue} />

          <TTCommentsEditorCard
            value={commentValue}
            onChange={setCommentValue}
            onSubmit={setCommentSubmitted}
            onCancel={() => setCommentValue("")}
          />

          <PreviewCard title="Comment Submitted" html={commentSubmitted} />

          <TTArticle
            value={articleValue}
            onChange={setArticleValue}
            onSubmit={setArticleSubmitted}
            onCancel={() => setArticleValue("")}
          />

          <PreviewCard title="Article Submitted" html={articleSubmitted} />

          <TTPortfolio
            value={portfolioValue}
            onChange={setPortfolioValue}
            onSaveDraft={setPortfolioDraft}
            onPublish={setPortfolioPublished}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <PreviewCard title="Portfolio Draft" html={portfolioDraft} />
            <PreviewCard title="Portfolio Published" html={portfolioPublished} />
          </div>

          <div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
            <h2 className="text-lg font-semibold">Direct Messages (Demo Simulation)</h2>
            <p className="text-sm text-base-content/70">
              Interactive chat simulation using the direct messages component in demo mode.
            </p>
            <SocialRealtimeProvider>
              <TTDirectMessages demoMode maxHeight={560} />
            </SocialRealtimeProvider>
          </div>
        </section>
      </main>
    </>
  );
}
