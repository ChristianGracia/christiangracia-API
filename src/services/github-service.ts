import e from 'express';

export const githubService = {
  /**
   * sort repos github repos by first update time and then unique language used
   * @param { * } sortRepos - repos to be sorted
   */
  sortRepos: (repos: any[]): any[] => {
    const sortedRepos = repos.sort(function (a, b) {
      return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0;
    });

    const comp = {};
    const uniqueLangugeRepos = [];
    const dupes = [];
    const boringRepos = [];
    const starRepos = [];
    const importantLanguageRepos = [];
    const boringNames = ['onabeat.com'];
    const starRepoNames = [
      'christiangracia.com4.0',
      'Algorithms',
      'christiangracia-API',
    ];
    const importantLanguages = ['C', 'C#', 'Python', 'Java'];
    for (const repo of sortedRepos) {
      const language = repo.language;
      const name = repo.name;
      if (starRepoNames.includes(name)) {
        comp[language] = language;
        starRepos.push(repo);
      } else {
        if (comp[language]) {
          if (language === 'Javascript') {
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
            uniqueLangugeRepos.push(repo);
          }
        }
      }
    }
    const weightedRepos = [
      ...starRepos,
      ...uniqueLangugeRepos,
      ...importantLanguageRepos,
      ...dupes,
      ...boringRepos,
    ];
    return weightedRepos;
  },
  /**
   * Get all github repos
   * @param { * } repos - repos received from github API
   */
  formatRepos: function (repos: any[]): any[] {
    return this.sortRepos(
      repos.map((repo: any) => {
        return {
          url: repo.html_url,
          description: repo.description,
          name: repo.name,
          language: repo.language,
          updatedAt: repo.updated_at,
        };
      }),
    );
  },
  /**
   * Get all commits from selected repo
   * @param { * } repo - selected repo to view commits from
   */
  formatCommits: (repo: any[]): any[] => {
    return repo.map((commit: any) => {
      return {
        time: commit.commit.author.date,
        message: commit.commit.message,
        url: commit.html_url,
      };
    });
  },
};
