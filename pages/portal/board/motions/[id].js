import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff } from "@/utils/authHelpers";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TagSEO from "@/components/TagSEO";
import BoardContextNav from "@/components/portal/BoardContextNav";
import { sanitizeDefaultHtml, stripHtmlText } from "@/components/security/sanitize";

export default function MotionDetails(props) {
    const router = useRouter();
    const { id } = router.query;
    const { data: session } = useSession();
    const userId = session?.user?.id ? parseInt(session.user.id) : null;
    
    const { canSecond, canVote } = props;

    const [motion, setMotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchMotion = async () => {
        if (!id) return;
        setLoading(true);
        const res = await fetch(`/api/motions/${id}`);
        if (res.ok) setMotion(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchMotion(); }, [id]);

    const handleSecond = async () => {
        setSubmitting(true);
        const res = await fetch(`/api/motions/${id}/second`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userId)
        });
        if (res.ok) fetchMotion();
        else alert("Failed to second motion.");
        setSubmitting(false);
    };

    const handleVote = async (voteValue) => {
        setSubmitting(true);
        const res = await fetch(`/api/motions/${id}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, voteValue })
        });
        if (res.ok) fetchMotion();
        else {
            const errorText = await res.text();
            alert(errorText || "Voting closed or failed.");
        }
        setSubmitting(false);
    };

    // Calculate expiration Date if seconded based on categorical string
    let expirationDate = null;
    let isExpired = false;
    
    if (motion?.secondedOn && motion?.duration) {
        expirationDate = new Date(motion.secondedOn);
        
        const dur = motion.duration.toLowerCase();
        
        if (dur.includes('week')) {
            expirationDate.setDate(expirationDate.getDate() + 7);
        } else if (dur.includes('month')) {
            expirationDate.setDate(expirationDate.getDate() + 30);
        } else if (dur.includes('quarter')) {
            expirationDate.setDate(expirationDate.getDate() + 90);
        } else if (dur.includes('year')) {
            expirationDate.setDate(expirationDate.getDate() + 365);
        } else {
            expirationDate.setDate(expirationDate.getDate() + 7); // Default
        }
        
        if (new Date() > expirationDate) {
            isExpired = true;
        }
    }
    
    // CALCULATE CONSENT LEVEL
    let consentLevel = "None";
    let yesVotes = 0;
    let totalVotes = 0;
    let yesPercentage = 0;

    if (motion && motion.votes) {
        yesVotes = motion.votes.filter(v => v.voteValue === "Yes").length;
        totalVotes = motion.votes.length;

        if (totalVotes > 0) {
            yesPercentage = (yesVotes / totalVotes) * 100;

            if (yesPercentage === 100) {
                consentLevel = "Unanimous";
            } else if (yesPercentage >= 70) {
                consentLevel = "Board Consent";
            } else if (yesPercentage >= 50) {
                consentLevel = "Majority";
            } else if (yesPercentage >= 30) {
                consentLevel = "Minority";
            } else {
                consentLevel = "Failed";
            }
        }
    }

    if (loading) return <div className="p-10 pt-20 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!motion) return <div className="p-10 pt-20 text-center text-error">Motion not found.</div>;

    const hasVoted = motion.votes?.some(v => v.voterId === userId);

    return (
        <div className="p-4 pt-12 bg-base-200 min-h-screen">
            <TagSEO metadataProp={{ title: stripHtmlText(motion.title) }} canonicalSlug={`portal/board/motions/${id}`} />
            <BoardContextNav />
            
            <div className="max-w-4xl mx-auto mt-8 space-y-6">

                <div className="card bg-base-100 shadow border border-base-300">
                    <div className="card-body">
                        {/* Safely render HTML in the Title */}
                        <div 
                            className="text-4xl font-bold text-primary [&>p]:mb-0" 
                            dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(motion.title) }} 
                        />
                        <div 
                            className="text-xl font-medium text-secondary [&>p]:mb-0" 
                            dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(motion.subject) }} 
                        />

                        <div className="divider"></div>

                        <div className="prose max-w-none mb-6">
                            <h3 className="text-lg font-semibold">Description</h3>
                            <div dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(motion.description) }} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm bg-base-200 p-4 rounded-box">
                            <div><strong>Proposed By:</strong> {motion.proposedBy?.name}</div>
                            <div><strong>Proposed On:</strong> {new Date(motion.proposedOn).toLocaleDateString()}</div>
                            
                            {motion.secondedBy && (
                                <>
                                    <div className="col-span-2 border-t border-base-300 my-2 pt-2"></div>
                                    <div><strong>Seconded By:</strong> {motion.secondedBy?.name}</div>
                                    <div><strong>Seconded On:</strong> {new Date(motion.secondedOn).toLocaleDateString()}</div>
                                    
                                    <div>
                                        <strong>Status:</strong> 
                                        <span className={`ml-2 badge badge-sm ${motion.status === 'Closed' ? 'badge-error' : 'badge-success'}`}>
                                            {motion.status}
                                        </span>
                                    </div>
                                    
                                    {expirationDate && (
                                        <div>
                                            <strong>Voting Closes:</strong> 
                                            <span className={`ml-2 ${isExpired ? 'text-error line-through' : 'font-semibold font-mono'}`}>
                                                {expirationDate.toLocaleDateString()}
                                            </span>
                                            {isExpired && <span className="ml-2 text-error font-bold">(EXPIRED)</span>}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* SECOND MOTION LOGIC Check Permission & Proposer Restriction */}
                        {motion.status === "Proposed" && canSecond && motion.proposedById !== userId && (
                            <div className="mt-6 flex flex-col items-end gap-2">
                                <button className="btn btn-warning" onClick={handleSecond} disabled={submitting}>
                                    Second This Motion
                                </button>
                            </div>
                        )}

                        {/* VOTING LOGIC Check Permission */}
                        {motion.status === "Seconded" && !hasVoted && canVote && !isExpired && (
                            <div className="mt-8 bg-primary/10 p-6 rounded-box text-center">
                                <h3 className="text-2xl font-bold mb-4">Cast Your Vote</h3>
                                <div className="flex gap-4 justify-center">
                                    <button className="btn btn-success" onClick={() => handleVote("Yes")} disabled={submitting}>Yes</button>
                                    <button className="btn btn-error" onClick={() => handleVote("No")} disabled={submitting}>No</button>
                                    <button className="btn btn-outline" onClick={() => handleVote("Abstain")} disabled={submitting}>Abstain</button>
                                </div>
                            </div>
                        )}

                        {motion.status === "Closed" && (
                            <div className="mt-8 bg-base-300 p-4 rounded-box text-center text-base-content/70 font-semibold">
                                Voting has closed for this motion.
                            </div>
                        )}

                        {hasVoted && !isExpired && (
                            <div className="mt-8 bg-success/20 p-4 rounded-box">
                                <p className="font-bold text-success text-center">You have successfully voted on this motion.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vote Tally with Consent Level */}
                {(motion.status === "Seconded" || motion.status === "Closed") && (
                    <div className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body">
                            <h3 className="card-title justify-between">
                                Live Vote Tally
                                {totalVotes > 0 && (
                                    <span className={`badge ${
                                        consentLevel === "Unanimous" ? "badge-success" : 
                                        consentLevel === "Board Consent" ? "badge-primary" : 
                                        consentLevel === "Majority" ? "badge-info" :
                                        consentLevel === "Minority" ? "badge-warning" : "badge-error"
                                    }`}>
                                        Consent Level: {consentLevel}
                                    </span>
                                )}
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                <div className="stat place-items-center bg-base-200 rounded-box py-4">
                                    <div className="stat-title">Yes</div>
                                    <div className="stat-value text-success">{yesVotes}</div>
                                </div>
                                <div className="stat place-items-center bg-base-200 rounded-box py-4">
                                    <div className="stat-title">No</div>
                                    <div className="stat-value text-error">
                                        {motion.votes?.filter(v => v.voteValue === "No").length || 0}
                                    </div>
                                </div>
                                <div className="stat place-items-center bg-base-200 rounded-box py-4">
                                    <div className="stat-title">Abstain</div>
                                    <div className="stat-value">
                                        {motion.votes?.filter(v => v.voteValue === "Abstain").length || 0}
                                    </div>
                                </div>
                                <div className="stat place-items-center bg-base-300 rounded-box py-4">
                                    <div className="stat-title">Approval Rate</div>
                                    <div className="stat-value text-primary">{yesPercentage.toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    if (!session?.user) {
        return { redirect: { destination: `/api/auth/signin?callbackUrl=/portal/board/motions`, permanent: false } };
    }
    
    if (!isStaff(session) && !isAdmin(session)) {
        return { notFound: true }; 
    }

    // TODO(board-permission-role): Restore board-scoped VIEW/SECOND/VOTE permission checks when board roles are available.
    const canSecond = true;
    const canVote = true;

    return { 
        props: {
            canSecond,
            canVote
        } 
    };
}