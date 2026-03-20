import React from 'react';

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'Pending':
        return 'bg-status-pending-bg text-status-pending-text';
      case 'In Progress':
        return 'bg-status-in-progress-bg text-status-in-progress-text';
      case 'Assigned':
        return 'bg-status-assigned-bg text-status-assigned-text';
      case 'Under Inspection':
        return 'bg-status-inspection-bg text-status-inspection-text';
      case 'Resolved':
        return 'bg-status-resolved-bg text-status-resolved-text';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`status-pill ${getColors()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
