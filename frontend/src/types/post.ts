export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  username: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  commenter_id: string;
  username: string;
  post_id: string;
}

export interface PostData {
  title: string;
  content: string;
  app_user_id: string;
}

export interface PostResponse {
  ok: boolean;
  json: () => Promise<{ message: string; data: object }>;
}
