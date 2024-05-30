import {useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createUserAccount, signInAccount, signOutAccount, createPost, getRecentPosts, likePost, savePost, deleteSavedPost, getCurrentUser, getPostById, updatePost, deletePost, getInfinitePosts, searchPosts, getUsers, getUserById, updateUser, getUserPosts, commentPost, followUser, unfollowUser, getFollowers, getFollowing, createComment } from '../appwrite/api'
import { IFollowUser, INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys';
import exp from 'constants';

// Creating user
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
}

//Signing in user
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user),
    });
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
}
export const useCreatePost = () => {
const queryClient = useQueryClient();
return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    });
    },
});
};

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const useLikePost = () => {
const queryClient = useQueryClient();

return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string; likesArray:
    string[] }) => likePost(postId, likesArray),
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
        })
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
        })
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS]
        })
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER]
        })
    }
})
}


export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };


export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}


export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}


export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
        deletePost(postId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

export const useGetUsers = (limit?: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: () => getUsers(limit),
    });
  };

  export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };

  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
        });
      },
    });
  };

  export const useGetUserPosts = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
      queryFn: () => getUserPosts(userId),
      enabled: !!userId,
    });
  };





export const useFollowUser = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
      mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
          followUser(followerId, followingId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_FOLLOWERS], // Invalidate followers query 
          });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_FOLLOWING], // Invalidate followers query 
          });
      },
  });

  const followUserAction = (followerId: string, followingId: string) => {
      followMutation.mutate({ followerId, followingId });
  };

  return { followUserAction, followMutation };
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  const unfollowMutation = useMutation({
      mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
          unfollowUser(followerId, followingId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_FOLLOWERS], // Invalidate followers query 
          });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_FOLLOWING], // Invalidate followers query 
          });
      },
  });

  const unfollowUserAction = (followerId: string, followingId: string) => {
      unfollowMutation.mutate({ followerId, followingId });
  };

  return { unfollowUserAction, unfollowMutation };
};

export const useGetFollowers = (userId?: string) => {
  return useQuery({
      queryKey: [QUERY_KEYS.GET_FOLLOWERS, userId],
      queryFn: () => getFollowers(userId!),
      enabled: !!userId,
  });
};

export const useGetFollowing = (userId?: string) => {
  return useQuery({
      queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
      queryFn: () => getFollowing(userId!),
      enabled: !!userId, // Only run the query if userId is provided
  });
};








 

