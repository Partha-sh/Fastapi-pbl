export type SessionUser = {
  id: string;
  username: string;
  email: string;
  profile_picture: string | null;
  created_at?: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};
