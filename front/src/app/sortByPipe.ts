import { Pipe, PipeTransform } from '@angular/core';
import { Article } from './interfaces/article.interface';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  transform(articles: Article[] | null, sortBy: 'title' | 'date'): Article[] | null {
    if (!articles || !sortBy) {
      return null; // Retourne null si articles ou sortBy est null
    }

    return articles.slice().sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'date') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });
  }
}
