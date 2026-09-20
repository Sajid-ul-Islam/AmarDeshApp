import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Send } from 'lucide-react';
import { useReactionsStore } from '../../store/useReactionsStore';
import { useAppStore } from '../../store/useAppStore';

interface CommentsSectionProps {
  articleId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const { isDarkMode } = useAppStore();
  const { comments, addComment, likeComment, getCommentsForArticle } = useReactionsStore();
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const articleComments = getCommentsForArticle(articleId);
  const featuredComments = articleComments
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;
    
    addComment(articleId, newComment.trim(), authorName.trim());
    setNewComment('');
  };

  return (
    <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`font-bold text-base mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <MessageCircle size={18} />
        মন্তব্য ({articleComments.length})
      </h3>

      {/* Featured Comments */}
      {featuredComments.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            🔥 জনপ্রিয় মন্তব্য
          </p>
          <div className="space-y-3">
            {featuredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {comment.author}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {new Date(comment.timestamp).toLocaleDateString('bn-BD')}
                  </span>
                </div>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {comment.text}
                </p>
                <button
                  onClick={() => likeComment(comment.id)}
                  className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`}
                >
                  <ThumbsUp size={12} />
                  <span>{comment.likes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="আপনার নাম"
          className={`w-full px-3 py-2 rounded-lg text-sm ${
            isDarkMode
              ? 'bg-gray-700 text-white placeholder:text-gray-500'
              : 'bg-white text-gray-900 placeholder:text-gray-400'
          }`}
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="মন্তব্য লিখুন..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder:text-gray-500'
                : 'bg-white text-gray-900 placeholder:text-gray-400'
            }`}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || !authorName.trim()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
