import { Article } from "./article.interface";

export interface Feed {
    [topicName: string]: Article[];
  }