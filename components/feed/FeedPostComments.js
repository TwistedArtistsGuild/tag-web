/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first*/

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoTrashOutline } from 'react-icons/io5';
import { timeAgo } from '@/utils/relativeTime';

export default function FeedPostComments({ comments, commentsLoading, session, addComment, deleteComment, refetchCount }) {
    const [newComment, setNewComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!session?.user?.id || !newComment.trim()) return;
        setCommentSubmitting(true);

        const result = await addComment({
            content: newComment.trim(),
            userId: parseInt(session.user.id),
        });

        if (result.success) {
            setNewComment('');
            refetchCount();
        }
        setCommentSubmitting(false);
    };

    const handleDeleteComment = async (commentId) => {
        if (!session?.user?.id) return;
        if (!window.confirm('Delete this comment?')) return;
        await deleteComment(commentId, parseInt(session.user.id));
        refetchCount();
    };

    return (
        <div className="border-t border-base-200 pt-3 space-y-3">
            {/* Comment input */}
            {session?.user ? (
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full bg-base-300">
                            <Image
                                src={session.user.image || '/blank_image.png'}
                                alt="You"
                                width={32} height={32}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            className="input input-bordered input-sm flex-1"
                            placeholder="Write a comment..."
                            maxLength={2000}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            disabled={commentSubmitting || !newComment.trim()}
                        >
                            {commentSubmitting ? <span className="loading loading-spinner loading-xs"></span> : 'Post'}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-xs text-base-content/50 text-center">
                    <Link href="/api/auth/signin" className="link link-primary">Sign in</Link> to comment
                </p>
            )}

            {/* Comments list */}
            {commentsLoading ? (
                <div className="flex justify-center py-3"><span className="loading loading-spinner loading-sm"></span></div>
            ) : comments.length === 0 ? (
                <p className="text-xs text-base-content/40 text-center py-2">No comments yet. Be the first!</p>
            ) : (
                <div className="space-y-3">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            session={session}
                            onDelete={handleDeleteComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentItem({ comment, session, onDelete }) {
    return (
        <div className="flex gap-2">
            <div className="avatar flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-base-300 overflow-hidden relative">
                    <Image
                        src={comment.user?.image || '/blank_image.png'}
                        alt={comment.user?.name || 'User'}
                        fill
                        sizes="28px"
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-base-200 rounded-box px-3 py-2">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-xs">{comment.user?.name || 'Anonymous'}</p>
                        {session?.user && parseInt(session.user.id) === comment.userId && (
                            <button
                                className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0"
                                onClick={() => onDelete(comment.id)}
                                title="Delete comment"
                            >
                                <IoTrashOutline className="text-sm" />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-base-content">{comment.content}</p>
                </div>
                <div className="flex gap-3 mt-0.5 px-1">
                    <span className="text-xs text-base-content/40" suppressHydrationWarning>
                        {timeAgo(new Date(comment.createdAt))}
                    </span>
                    {comment.isEdited && <span className="text-xs text-base-content/30">(edited)</span>}
                </div>
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                        {comment.replies.map(reply => (
                            <div key={reply.id} className="flex gap-2">
                                <div className="avatar flex-shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-base-300 overflow-hidden relative">
                                        <Image
                                            src={reply.user?.image || '/blank_image.png'}
                                            alt={reply.user?.name || 'User'}
                                            fill
                                            sizes="24px"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="bg-base-200 rounded-box px-3 py-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-xs">{reply.user?.name || 'Anonymous'}</p>
                                            {session?.user && parseInt(session.user.id) === reply.userId && (
                                                <button
                                                    className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0"
                                                    onClick={() => onDelete(reply.id)}
                                                    title="Delete reply"
                                                >
                                                    <IoTrashOutline className="text-sm" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-base-content">{reply.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}