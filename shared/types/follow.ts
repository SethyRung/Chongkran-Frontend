export type FollowDto = {
  followingId: string;
};

export type FollowStatsResponse = {
  followersCount: number;
  followingCount: number;
};

export type IsFollowingResponse = {
  isFollowing: boolean;
};

export type FollowUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export type FollowersResponse = {
  followers: FollowUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type FollowingResponse = {
  following: FollowUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
