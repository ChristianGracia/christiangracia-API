export const githubService = {
  /**
   * Get all github repos
   * @param { * } repos - repos received from github API
   */
  formatRepos: (repos: any[]): any[] => {
    return repos
      .map((repo: any) => {
        return {
          url: repo.html_url,
          description: repo.description,
          name: repo.name,
          language: repo.language,
          updatedAt: repo.updated_at,
        };
      })
      .sort(function (a, b) {
        return a.updatedAt > b.updatedAt
          ? -1
          : a.updatedAt < b.updatedAt
          ? 1
          : 0;
      });
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
