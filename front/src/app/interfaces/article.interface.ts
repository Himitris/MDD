export interface Article {
  id: number;
  title: string;
  content: string;
  authorId: number;
  topicId: number;
  authorUsername: string;
  topicName: string;
  createdAt: Date;
  updatedAt: Date;
}

