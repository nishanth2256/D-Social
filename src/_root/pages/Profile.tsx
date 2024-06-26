
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";

import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser, useGetFollowing, useGetUserById, useUnfollowUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";
import { IFollowUser } from "@/types";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-dark-1">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || "");
  const { followUserAction } = useFollowUser();
  const { unfollowUserAction } = useUnfollowUser();
  const { data: following } = useGetFollowing(user?.id || "");

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (following && currentUser) {
      setIsFollowing(following.some((f: IFollowUser) => f.followingId === currentUser.$id));
    }
  }, [following, currentUser]);

  const handleFollow = async () => {
    if (currentUser) {
      await followUserAction(user?.id || "", currentUser.$id);
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    if (currentUser) {
      await unfollowUserAction(user?.id || "", currentUser.$id);
      setIsFollowing(false);
    }
  };

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts"/>
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {user?.id === currentUser.$id && (
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-grey-2 px-5 text-dark-1 flex-center gap-2 rounded-lg">
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            )}
            {user?.id !== currentUser.$id && (
              <Button
              type="button"
              className={`px-8 ${isFollowing ? 'shad-button_secondary' : 'shad-button_primary'}`}
              onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            )}
          </div>
        </div>
      </div>
      <hr className="border w-full border-light-6/60" />
      {currentUser.$id === user?.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-grey-2"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-grey-2"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
          <Route
            index
            element={<GridPostList posts={currentUser.posts} showUser={false} />}
          />
          {currentUser.$id === user.id && (
            <Route path="/liked-posts" element={<LikedPosts />} />
          )}
      </Routes>

      <Outlet />
    </div>
  );
};

export default Profile;
