export declare module FollowerResponse {
  export interface Datum {
    from_id: string;
    from_login: string;
    from_name: string;
    to_id: string;
    to_name: string;
    followed_at: Date;
  }

  export interface Pagination {
    cursor: string;
  }

  export interface RootObj {
    total: number;
    data: Datum[];
    pagination: Pagination;
  }
}
export interface FollowerGoal {
  total: number;
  goal: number;
}

export default FollowerResponse;
