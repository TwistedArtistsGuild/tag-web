import Link from "next/link";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth/next";
import TagSEO from "@/components/TagSEO";
import StaffContextNav from "@/components/portal/StaffContextNav";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff, hasPermission } from "@/utils/authHelpers";
import { PERMISSIONS } from "@/utils/permissions";
import getApiURL from "@/components/widgets/GetApiURL";
import { stripHtmlText } from "@/components/security/sanitize";

export default function MotionsIndex(props) {
    const { sessionUser, canCreate } = props;
    const [motions, setMotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMotions = async () => {
            const api_url = getApiURL();
            try {
                const res = await fetch(`${api_url}motions`);
                if (res.ok) {
                    const data = await res.json();
                    setMotions(data);
                }
            } catch (err) {
                console.error("Failed to load motions", err);
            }
            setLoading(false);
        };
        fetchMotions();
    }, []);

    return (
        <div className="p-4 pt-12 bg-base-200 min-h-screen">
            <TagSEO metadataProp={{ title: "Board Motions" }} canonicalSlug="portal/staff/motions" />
            
            <StaffContextNav />
            
            <div className="max-w-6xl mx-auto space-y-6 mt-8">
                <div className="flex justify-between items-center bg-base-100 shadow border border-base-300 p-6 rounded-box">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Board Motions</h1>
                        <p className="text-base-content/70">Review, second, and vote on motions.</p>
                    </div>
                    {canCreate && (
                        <Link href="/portal/staff/motions/create" className="btn btn-primary">
                            Propose New Motion
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="text-center p-10 pt-20"><span className="loading loading-spinner loading-lg"></span></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {motions.map(motion => (
                            <Link href={`/portal/staff/motions/${motion.id}`} key={motion.id} className="card bg-base-100 shadow border border-base-300 hover:border-primary cursor-pointer transition">
                                <div className="card-body">
                                    <h2 className="card-title text-primary line-clamp-2">
                                        {stripHtmlText(motion.title)}
                                    </h2>
                                    <p className="text-sm font-semibold">{stripHtmlText(motion.subject)}</p>
                                    <div className="mt-2 text-xs text-base-content/70">
                                        <p>Proposed by: {motion.proposedBy?.name || 'Unknown'}</p>
                                        <p>Status: <span className={`badge badge-sm ${motion.status === 'Seconded' ? 'badge-success' : 'badge-warning'}`}>{motion.status}</span></p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {motions.length === 0 && <p className="text-center w-full col-span-3">No active motions found.</p>}
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
        return { notFound: true }; // Hide page completely if no VIEW permission
    }
    
    const canCreate = hasPermission(session, PERMISSIONS.MOTION.CREATE);

    return { 
        props: { 
            sessionUser: session.user,
            canCreate 
        } 
    };
}