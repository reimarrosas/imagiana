export interface ControllerResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
}

export interface AuthCreds {
  email: string;
  password: string;
}

export interface SignupCreds extends AuthCreds {
  fullName: string;
}

export interface PostData {
  description: string;
  imageData: string;
}

interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Users extends BaseEntity {
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export interface VerificationIds extends BaseEntity {
  verificationId: string;
  userId: number;
}

export interface Posts extends BaseEntity {
  description: string;
  imageUrl: string;
  userId: number;
}

export interface Comments extends BaseEntity {
  comment: string;
  postId: number;
  userId: number;
}

export interface Likes {
  userId: number;
  postId: number;
}

export interface CommentData {
    comment: string;
    postId: number;
}

export interface PostQuery extends Posts {
    email: string;
    fullName: string;
}

export interface PostResult extends PostQuery {
    comments: Comments[];
    likedByUser: boolean;
}
