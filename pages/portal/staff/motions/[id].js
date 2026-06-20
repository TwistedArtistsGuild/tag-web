import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff, hasPermission } from "@/utils/authHelpers";
import { PERMISSIONS } from "@/utils/permissions";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import getApiURL from "@/components/widgets/GetApiURL";
import TagSEO from "@/components/TagSEO";
import StaffContextNav from "@/components/portal/StaffContextNav";
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

    const api_url = getApiURL();

    const fetchMotion = async () => {
        if (!id) return;
        setLoading(true);
        const res = await fetch(`${api_url}motions/${id}`);
        if (res.ok) setMotion(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchMotion(); }, [id]);

    const handleSecond = async () => {
        setSubmitting(true);
        const res = await fetch(`${api_url}motions/${id}/second`, {
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
        const res = await fetch(`${api_url}motions/${id}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, voteValue })
        });
        if (res.ok) fetchMotion();
        else alert(await res.text());
        setSubmitting(false);
    };

    if (loading) return <div className="p-10 pt-20 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!motion) return <div className="p-10 pt-20 text-center text-error">Motion not found.</div>;

    const hasVoted = motion.votes?.some(v => v.voterId === userId);

    return (
        <div className="p-4 pt-12 bg-base-200 min-h-screen">
            <TagSEO metadataProp={{ title: stripHtmlText(motion.title) }} canonicalSlug={`portal/staff/motions/${id}`} />
            <StaffContextNav />
            
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
                                    <div><strong>Seconded By:</strong> {motion.secondedBy?.name}</div>
                                    <div><strong>Status:</strong> {motion.status}</div>
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
                        {motion.status === "Seconded" && !hasVoted && canVote && (
                            <div className="mt-8 bg-primary/10 p-6 rounded-box text-center">
                                <h3 className="text-2xl font-bold mb-4">Cast Your Vote</h3>
                                <div className="flex gap-4 justify-center">
                                    <button className="btn btn-success" onClick={() => handleVote("Yes")} disabled={submitting}>Yes</button>
                                    <button className="btn btn-error" onClick={() => handleVote("No")} disabled={submitting}>No</button>
                                    <button className="btn btn-outline" onClick={() => handleVote("Abstain")} disabled={submitting}>Abstain</button>
                                </div>
                            </div>
                        )}

                        {hasVoted && (
                            <div className="mt-8 bg-success/20 p-4 rounded-box">
                                <p className="font-bold text-success text-center">You have successfully voted on this motion.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vote Tally */}
                {motion.status === "Seconded" && (
                    <div className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body">
                            <h3 className="card-title">Live Vote Tally</h3>
                            <div className="flex gap-8">
                                <div className="text-success font-bold">Yes: {motion.votes?.filter(v => v.voteValue === "Yes").length || 0}</div>
                                <div className="text-error font-bold">No: {motion.votes?.filter(v => v.voteValue === "No").length || 0}</div>
                                <div className="font-bold">Abstain: {motion.votes?.filter(v => v.voteValue === "Abstain").length || 0}</div>
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
        return { redirect: { destination: `/api/auth/signin?callbackUrl=/portal/staff/motions`, permanent: false } };
    }
    
    if (!isStaff(session) && !isAdmin(session)) {
        return { notFound: true }; 
    }

    if (!hasPermission(session, PERMISSIONS.MOTION.VIEW)) {
        return { notFound: true }; // Hide page if they can't even view motions
    }
    
    const canSecond = hasPermission(session, PERMISSIONS.MOTION.SECOND);
    const canVote = hasPermission(session, PERMISSIONS.MOTION.VOTE);

    return { 
        props: {
            canSecond,
            canVote
        } 
    };
}