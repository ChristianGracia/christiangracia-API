export class Song {
  public url: string = '';
  public updatedAt: string = '';
  public description: string = '';
  public name: string = '';
  public language: string = '';
  public topics: string = '';
  constructor(
    html_url: string,
    updated_at: string,
    description: string,
    name: string,
    language: string,
    topics,
  ) {
    this.url = html_url;
    this.updatedAt = updated_at;
    this.description = description;
    this.name = name;
    this.language = language;
    this.topics = topics;
  }
}
