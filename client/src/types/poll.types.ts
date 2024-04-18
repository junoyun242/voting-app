export interface ICreatePollReq {
  title: string;
  description: string;
  token: string;
  expirationDate?: string;
  options: string[];
}

export interface IPoll {
  id: number;
  title: string;
  description: string;
  token: string;
  creatorID: number | null;
  createdAt: string;
  expirationDate: string;
}

export interface IOption {
  id: number;
  option: string;
  pollID?: number;
}
export interface IVote {
  id: number;
  createdAt: string | null;
  userID: number | null;
  optionID: number;
}

export interface ICreatePollRes {
  poll: IPoll;
  options: IOption[];
}

export interface IReadPollRes {
  poll: IPoll;
  options: IOption[];
  votes: IVote[];
}
