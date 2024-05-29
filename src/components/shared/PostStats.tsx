import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import { useCommentPost, useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";


type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post?.likes.map((user: Models.Document) => user.$id);
    // const commentList = post.comment.map((comment: Models.Document) => comment.$id);

    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
    const { mutate: commentPost } = useCommentPost();


    const { data: currentUser } = useGetCurrentUser();

    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post?.$id
    );

    // const [comments, setComments] = useState<Comment[]>([]);
    // const [commentText, setCommentText] = useState<string>('');
    // const [isCommentSectionVisible, setIsCommentSectionVisible] = useState<boolean>(false);

    useEffect(() => {
        setIsSaved(!!savedPostRecord);
    }, [currentUser]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post?.$id || '', likesArray: newLikes });
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ userId: userId, postId: post?.$id || '' });
            setIsSaved(true);
        }
    }

    // const handleCommentPost = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     if (!currentUser) return;

    //     const newComment: Comment = {
    //         id: `${comments.length + 1}`,
    //         userId: currentUser.$id,
    //         content: commentText,
    //         date: new Date().toISOString()
    //     };

    //     setComments([...comments, newComment]);
    //     setCommentText('');
    //     commentPost({
    //         userId: currentUser.$id,
    //         postId: post?.$id || '',
    //         commentsArray: [...comments, newComment]
    //     });
    // };

    // const toggleCommentSection = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setIsCommentSectionVisible(!isCommentSectionVisible);
    // };

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                    }
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>

                {/* <img
                    src="/assets/icons/chat.svg" // Your comment icon path
                    alt="comment"
                    width={20}
                    height={20}
                    onClick={handleCommentPost}
                    className="cursor-pointer"
                /> */}
            </div>

            
            {/* {isCommentSectionVisible && (
                <div className="comment-section">
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                <p><strong>{comment.creator}</strong> ({new Date(comment.date).toLocaleString()}): {comment.content}</p>
                            </li>
                        ))}
                    </ul>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={handleCommentPost}>Post Comment</button>
                </div>
            )} */}
            {/* <img
                src="/assets/icons/chat.svg" // Your comment icon path
                alt="comment"
                width={20}
                height={20}
                onClick={toggleCommentSection}
                className="cursor-pointer"
            /> */}

            <div className="flex gap-2">
                {isSavingPost || isDeletingSaved ? <Loader /> : <img
                    src={isSaved
                        ? "/assets/icons/saved.svg"
                        : "/assets/icons/save.svg"
                    }
                    alt="save"
                    width={20}
                    height={20}
                    onClick={handleSavePost}
                    className="cursor-pointer"
                />}
            </div>
        </div>
    )
}

export default PostStats;
