export enum NotificationType {
  Elearning=1
}


export class UserPost {
  userPostId: number;
  userId: number;
  postId: number;
  state: number;
  creationDate: Date;
  submittedDate: Date;
  reactivationDate: Date;
}
