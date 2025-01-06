import { LeadStatus } from "@/integrations/supabase/types/enums";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.MISSED_TRANSFER:
      case LeadStatus.INTERESTED:
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20"; // Green for positive statuses
      case LeadStatus.CONTACT_LATER:
      case LeadStatus.SEND_TO_CLIENT:
        return "bg-amber-50 text-amber-700 ring-amber-600/20"; // Yellow for pending statuses
      case LeadStatus.NOT_INTERESTED:
      case LeadStatus.UNQUALIFIED:
      case LeadStatus.BAD_PHONE_NUMBER:
      case LeadStatus.DO_NOT_CONTACT:
        return "bg-rose-50 text-rose-700 ring-rose-600/20"; // Red for negative statuses
      case LeadStatus.POTENTIAL:
      case LeadStatus.CONNECTED:
        return "bg-sky-50 text-sky-700 ring-sky-600/20"; // Blue for active statuses
      case LeadStatus.SEND_AI_TEXT:
        return "bg-slate-50 text-slate-700 ring-slate-600/20"; // Default for AI text status
      default:
        return "bg-slate-50 text-slate-700 ring-slate-600/20"; // Default fallback
    }
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  );
};

export default LeadStatusBadge;