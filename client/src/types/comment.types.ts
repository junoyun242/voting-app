export interface IComment {
  id: number;
  userID: number | null;
  nickname: string;
  pollID: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReadCommentsRes {
  data: IComment[];
}
