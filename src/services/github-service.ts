import { Commit } from '../classes/commit';
import { repo, Repo } from '../classes/repo';
import { utilService } from './util-service';

export const githubService = {
  /**
   * Sort repos github repos by importance + coolness
   * @param { * } repos - repos to be sorted
   */
  sortReposByImportance: (repos: any[]): any[] => {
    const comp = {};

    const uniqueLanguageRepos = [];
    const dupes = [];
    const boringRepos = [];
    const starRepos = [];
    const importantLanguageRepos = [];

    const boringNames = ['onabeat.com', 'ChristianGracia'];
    const starRepoNames = [
      'christiangracia.com4.0',
      'Algorithms',
      'christiangracia-API',
      'Harvard-cs50',
    ];
    const importantLanguages = ['C', 'C#', 'Python', 'Java', 'Kotlin'];

    for (const repo of repos) {
      const { language, name } = repo;
      if (starRepoNames.includes(name)) {
        comp[language] = language;
        starRepos.push(repo);
      } else {
        if (comp[language]) {
          if (language === 'JavaScript') {
            boringRepos.push(repo);
          } else if (importantLanguages.includes(language)) {
            importantLanguageRepos.push(repo);
          } else {
            dupes.push(repo);
          }
        } else {
          if (boringNames.includes(name)) {
            boringRepos.push(repo);
          } else {
            comp[language] = language;
            uniqueLanguageRepos.push(repo);
          }
        }
      }
    }
    const weightedRepos = [
      ...starRepos,
      ...uniqueLanguageRepos,
      ...importantLanguageRepos,
      ...dupes,
      ...boringRepos,
    ];
    return weightedRepos;
  },
  /**
   * Get all github repos
   * @param { repo } repos - repos received from github API
   */
  formatRepos: function (repos: repo[]): Repo[] {
    return this.sortReposByImportance(
      repos
        .sort((a: repo, b: repo) => (a.updated_at > b.updated_at ? -1 : 1))
        .map((repo: repo) => {
          return new Repo({
            ...repo,
            updated_at: utilService.formatDateAndTime(repo.updated_at),
          });
        }),
    );
  },
  /**
   * Get all commits from selected repo
   * @param { * } repo - selected repo to view commits from
   */
  formatCommits: (repo: any[]): any[] => {
    return repo.map((commitData: any) => {
      const { commit, html_url } = commitData;

      return new Commit({
        author: utilService.formatDateAndTime(commit.author.date),
        message: commit.message,
        html_url,
      });
    });
  },
};
