// API Endpoints Configuration
// All paths are relative - the base URL is handled by apiClient.js

// Authentication API Endpoints
export const AUTH_API = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
};

// Thread API Endpoints
export const THREAD_API = {
  GET_ALL: '/api/threads',
  GET_BY_ID: (id) => `/api/threads/${id}`,
  CREATE: '/api/threads',
  UPVOTE: (id) => `/api/threads/${id}/upvote`,
  DOWNVOTE: (id) => `/api/threads/${id}/downvote`,
};

// Comment API Endpoints
export const COMMENT_API = {
  GET_BY_THREAD: (threadId) => `/api/comments/thread/${threadId}`,
  CREATE: '/api/comments',
  UPVOTE: (id) => `/api/comments/${id}/upvote`,
  DOWNVOTE: (id) => `/api/comments/${id}/downvote`,
};

// Subreddit API Endpoints
export const SUBREDDIT_API = {
  GET_ALL: '/api/subreddits',
  GET_BY_ID: (id) => `/api/subreddits/${id}`,
  GET_WITH_THREADS: (id) => `/api/subreddits/${id}/threads`,
  CREATE: '/api/subreddits',
};

// User API Endpoints
export const USER_API = {
  GET_BY_ID: (id) => `/api/users/${id}`,
  GET_PROFILE: '/api/users/profile',
};

export default {
  AUTH_API,
  THREAD_API,
  COMMENT_API,
  SUBREDDIT_API,
  USER_API,
};
