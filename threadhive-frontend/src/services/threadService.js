import fetchAPI from "../api/apiClient";
import { THREAD_API } from "../config/apiConfig";

// Fetch all recent threads
export const fetchRecentThreads = async () => {
  const res = await fetchAPI(THREAD_API.GET_ALL, {
    method: "GET",
  });

  return res.data;   // ✅ FIX: return only the array
};

// Fetch a single thread by ID
export const fetchThreadById = async (id) => {
  const res = await fetchAPI(THREAD_API.GET_BY_ID(id), {
    method: "GET",
  });

  return res.data;   // backend wraps response → return the thread object
};

// Create a new thread
export const createThread = async (threadData) => {
  const res = await fetchAPI(THREAD_API.CREATE, {
    method: "POST",
    body: JSON.stringify(threadData),
  });

  return res.data;   // return created thread
};

// Upvote a thread
export const upvoteThread = async (id) => {
  const res = await fetchAPI(THREAD_API.UPVOTE(id), {
    method: "POST",
  });

  return res.data;   // return updated thread
};

// Downvote a thread
export const downvoteThread = async (id) => {
  const res = await fetchAPI(THREAD_API.DOWNVOTE(id), {
    method: "POST",
  });

  return res.data;   // return updated thread
};


