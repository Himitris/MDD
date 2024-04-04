import { Pipe, PipeTransform } from '@angular/core';
import { Article } from './interfaces/article.interface';

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  transform(
    articles: Article[] | null,
    sortBy: 'dateAsc' | 'dateDesc'
  ): Article[] | null {
    if (!articles || !sortBy) {
      return null;
    }

    return articles.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortBy === 'dateAsc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
}
