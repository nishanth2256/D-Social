// import { Models } from "appwrite";
// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

// // Define the type for a comment
// interface Comment {
//   id: number;
//   name: string;
//   text: string;
//   date: string;
// }

// // Mock function to fetch existing comments (replace with actual data fetching logic)
// const fetchComments = async (): Promise<Comment[]> => {
//   // Replace with actual API call to fetch comments
//   return [];
// };

// // CommentSection component
// const CommentSection: React.FC = () => {
//   const { data: currentUser } = useGetCurrentUser();
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [text, setText] = useState<string>("");

//   useEffect(() => {
//     const loadComments = async () => {
//       const fetchedComments = await fetchComments();
//       setComments(fetchedComments);
//     };
//     loadComments();
//   }, []);

//   const handleAddComment = () => {
//     if (text && currentUser) {
//       const newComment: Comment = {
//         id: comments.length + 1,
//         name: currentUser.name,
//         text: text,
//         date: new Date().toLocaleString(),
//       };
//       setComments([...comments, newComment]);
//       setText("");
//     }
//   };

//   return (
//     <div className="comment-section">
//       {!currentUser ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <textarea
//             placeholder="Your comment"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button onClick={handleAddComment}>Add Comment</button>
//           <div className="comments-list">
//             {comments.length === 0 ? (
//               <p>No comments available</p>
//             ) : (
//               comments.map((comment) => (
//                 <div key={comment.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0" }}>
//                   <p><strong>{comment.name}</strong> <em>on {comment.date}</em></p>
//                   <p>{comment.text}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Render the CommentSection component
// ReactDOM.render(<CommentSection />, document.getElementById('root'));




import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useCreateComment,
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostDetailStats = ({ post, userId }: PostStatsProps) => {
  const { user } = useUserContext();
  const commentList = post.comment.map((comment: Models.Document) => comment.$id);

  const [userCommented ] = useState(commentList);
  const { mutate: createComment } = useCreateComment();
  const [ textContent, setCommentText ] = useState("");

  const { data: currentUser } = useGetCurrentUser();


  const handleCommentPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (textContent.trim() === "") {
      return;
    };
    console.log("Calling createComment with values:", { post: post.$id, user: userId, textContent: textContent });
    await createComment({ 
      post: post.$id, 
      user: userId,
      textContent: textContent });
      
    setCommentText("");
  };

  return (
    <div
      className={`flex flex-col ${containerStyles}`}>
      <div>
        <form
          onSubmit={handleCommentPost}
          className="flex flex-row justify-between inputcomment text-dark-1 gap-3 w-full max-w-5xl">
          <input
            type="text"
            className="labelcomment"
            placeholder="Add Comment..."
            value={textContent}
            onChange={(e) => setCommentText(e.target.value)}>
          </input>
          <button
              type="submit"
              className="sendcomment">
              <img
              width={19}
              height={19} 
              src="/assets/icons/sendcomment.svg" alt="Send" />
            </button>
        </form> 
      </div>
    </div>
  );
};

export default Commentpage;
