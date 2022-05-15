export type commitData = {
  message: string;
  html_url: string;
  author: string;
};
export class Commit {
  public url: string = '';
  public time: string = '';
  public message: string = '';

  constructor(newCommit: commitData) {
    const { message, author, html_url } = newCommit;
    this.time = author ?? '';
    this.message = message ?? '';
    this.url = html_url ?? '';
  }
}
