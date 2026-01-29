/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  Layout, 
  Edit3, 
  Trash2,
  AlertCircle
} from "lucide-react";

interface ActivityFeedProps {
  projectId: Id<"projects">;
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  const activities = useQuery(api.activities.getRecent, { projectId });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Update every minute (60000ms)
    const intervalId = setInterval(() => {
        setNow(Date.now());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (activities === undefined) {
    return <div className="text-white/40 text-center py-8">Loading activities...</div>;
  }

  if (activities.length === 0) {
    return (
      <GlassCard className="p-6">
        <h2 className="text-xl font-light text-white mb-4">Recent Activity</h2>
        <div className="text-white/40 text-sm text-center py-8">
          No recent activity to show
        </div>
      </GlassCard>
    );
  }

  const getIcon = (action: string) => {
    switch (action) {
      case "task_completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "task_created":
        return <Edit3 className="w-4 h-4 text-blue-400" />;
      case "file_uploaded":
        return <UploadCloud className="w-4 h-4 text-purple-400" />;
      case "project_status_updated":
        return <Layout className="w-4 h-4 text-orange-400" />;
      case "deliverable_approved":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "deliverable_changes_requested":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "task_deleted":
      case "file_deleted":
        return <Trash2 className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = now - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <GlassCard className="p-6">
       <h2 className="text-xl font-light text-white mb-6">Recent Activity</h2>
       <div className="space-y-6">
         {activities.map((activity: any) => (
           <div key={activity._id} className="flex gap-4 relative">
             {/* Timeline Line */}
             <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-white/5 last:hidden" />
             
             <div className="relative z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
               {getIcon(activity.action)}
             </div>
             
             <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                   <p className="text-white text-sm">
                     <span className="font-medium text-blue-300">{activity.userName}</span>
                     {" "}
                     <span className="text-white/60">
                        {activity.action.replace(/_/g, " ")}:
                     </span>
                     {" "}
                     <span className="text-white/80 font-medium">
                        &quot;{activity.entityName}&quot;
                     </span>
                   </p>
                   <span className="text-white/30 text-xs whitespace-nowrap ml-4">
                     {formatTime(activity.createdAt)}
                   </span>
                </div>
                {activity.userRole && (
                    <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1 block">
                        {activity.userRole}
                    </span>
                )}
             </div>
           </div>
         ))}
       </div>
    </GlassCard>
  );
}
