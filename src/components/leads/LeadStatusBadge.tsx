import { LeadStatus } from "@/integrations/supabase/types/enums";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.MISSED_TRANSFER:
      case LeadStatus.INTERESTED:
        return "bg-green-100 text-green-700"; // Green for positive statuses
      case LeadStatus.CONTACT_LATER:
      case LeadStatus.SEND_TO_CLIENT:
        return "bg-yellow-100 text-yellow-700"; // Yellow for pending statuses
      case LeadStatus.NOT_INTERESTED:
      case LeadStatus.UNQUALIFIED:
      case LeadStatus.BAD_PHONE_NUMBER:
      case LeadStatus.DO_NOT_CONTACT:
        return "bg-red-100 text-red-700"; // Red for negative statuses
      case LeadStatus.POTENTIAL:
      case LeadStatus.CONNECTED:
        return "bg-blue-100 text-blue-700"; // Blue for active statuses
      case LeadStatus.SEND_AI_TEXT:
        return "bg-gray-100 text-gray-700"; // Default for AI text status
      default:
        return "bg-gray-100 text-gray-700"; // Default fallback
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

export default LeadStatusBadge;