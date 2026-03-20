import React from 'react';
import { MapPin, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint }) => {
  const [upvotes, setUpvotes] = React.useState(complaint.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = React.useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      // Here you'd trigger a toast in a real app
    }
  };

  return (
    <div className="card hover:-translate-y-1 transition-transform cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm">
            {complaint.user?.avatar || 'AC'}
          </div>
          <div>
            <p className="font-semibold text-sm">{complaint.user?.name || 'Anonymous Citizen'}</p>
            <p className="text-xs text-gray-400">{complaint.timestamp}</p>
          </div>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded-md text-xs font-semibold text-gray-600">
          {complaint.category}
        </div>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <MapPin size={16} className="text-saffron" />
        <span>{complaint.location}</span>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <StatusBadge status={complaint.status} />
        
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpvote(); }}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${hasUpvoted ? 'text-saffron' : 'text-gray-500 hover:text-saffron'}`}
          >
            <ThumbsUp size={18} className={hasUpvoted ? 'fill-saffron' : ''} />
            <span>{upvotes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors">
            <MessageSquare size={18} />
            <span>{complaint.comments}</span>
          </button>
          <button className="text-gray-400 hover:text-navy transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
