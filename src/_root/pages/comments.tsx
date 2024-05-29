import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

// Define the type for a comment
interface Comment {
  id: number;
  name: string;
  text: string;
  date: string;
}

// Mock function to fetch existing comments (replace with actual data fetching logic)
const fetchComments = async (): Promise<Comment[]> => {
  // Replace with actual API call to fetch comments
  return [];
};

// CommentSection component
const CommentSection: React.FC = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    };
    loadComments();
  }, []);

  const handleAddComment = () => {
    if (text && currentUser) {
      const newComment: Comment = {
        id: comments.length + 1,
        name: currentUser.name,
        text: text,
        date: new Date().toLocaleString(),
      };
      setComments([...comments, newComment]);
      setText("");
    }
  };

  return (
    <div className="comment-section">
      {!currentUser ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            placeholder="Your comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAddComment}>Add Comment</button>
          <div className="comments-list">
            {comments.length === 0 ? (
              <p>No comments available</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
                  <p><strong>{comment.name}</strong> <em>on {comment.date}</em></p>
                  <p>{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Render the CommentSection component
ReactDOM.render(<CommentSection />, document.getElementById('root'));





