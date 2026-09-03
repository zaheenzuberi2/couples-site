/**
 * Play rooms: the bucket list and quiz, standalone from the website product.
 * No owner_id, no auth - the edit_token is the only credential that exists.
 */
export type PlayRoom = {
  id: string;
  slug: string;
  edit_token: string;
  title: string;
  created_at: string;
};

export type PlayBucketItem = {
  id: string;
  room_id: string;
  item: string;
  done: boolean;
  sort_order: number;
  created_at: string;
};

/** `options` is 2-4 strings; correct_index picks one. */
export type PlayQuizQuestion = {
  id: string;
  room_id: string;
  question: string;
  options: string[];
  correct_index: number;
  sort_order: number;
};

/** One guest's finished attempt - a leaderboard row, not a submission form. */
export type PlayQuizAttempt = {
  id: string;
  room_id: string;
  guest_name: string;
  score: number;
  total: number;
  created_at: string;
};

export type PlayBundle = {
  room: PlayRoom;
  bucketItems: PlayBucketItem[];
  quizQuestions: PlayQuizQuestion[];
};
