import { LeadStatus } from "@/integrations/supabase/types/enums";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case "Missed Transfer":
      case "Interested":
        return "bg-green-100 text-green-700"; // Green for positive statuses
      case "Contact Later":
      case "Send to Client":
        return "bg-yellow-100 text-yellow-700"; // Yellow for pending statuses
      case "Not Interested":
      case "Unqualified":
      case "Bad Phone Number":
      case "Do Not Contact":
        return "bg-red-100 text-red-700"; // Red for negative statuses
      case "Potential":
      case "Connected":
        return "bg-blue-100 text-blue-700"; // Blue for active statuses
      case "Send AI Text (Continue Outreach)":
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