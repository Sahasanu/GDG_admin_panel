import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewsApi } from '@/services/api';
import { Review } from '@/types';

interface ReviewTabProps {
  eventId: string;
}

function ReviewTab({ eventId }: ReviewTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewsApi.getReviewsByEvent(eventId);
      if (response.data && response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await reviewsApi.deleteReview(reviewId);
      if (response.data && response.data.success) {
        toast.success("Review deleted successfully.");
        setReviews(reviews.filter(r => r._id !== reviewId));
      }
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-zinc-400 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Analyzing sentiments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center bg-[#0A0A0A] p-6 rounded-[2rem] border border-zinc-900 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Attendee Reviews
          </h3>
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-1">
            {reviews.length} Feedbacks Shared
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2" />
        <MessageSquare className="text-zinc-800 absolute right-6 top-1/2 -translate-y-1/2 opacity-20" size={64} />
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div 
              key={review._id} 
              className="group bg-[#0A0A0A] border border-zinc-900 rounded-[2rem] p-6 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight text-white">{review.user?.name || "Anonymous"}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{review.user?.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex items-center bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  <Star size={12} className="text-indigo-400 fill-indigo-400 mr-1" />
                  <span className="text-[11px] font-black text-indigo-400">{review.rating}</span>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  "{review.comment}"
                </p>
                
                <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem] bg-[#0A0A0A]/30">
          <div className="w-16 h-16 rounded-full bg-indigo-500/5 flex items-center justify-center text-zinc-700 mb-6 border border-zinc-900">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-xl font-bold mb-2">Silence in the Hall</h3>
          <p className="text-zinc-500 max-w-sm font-medium text-sm">
            No attendees have shared their experience yet. Once the reviews start coming in, you'll see them here.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewTab;
