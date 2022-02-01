import * as fs from 'fs';

export const htmlHelper = {
  /**
   * Reads html file an creates a DOM
   * @param { string } htmlFileName - html file to be parsed
   */
  createPage: async (htmlFileName: string) => {
    return new Promise((resolve, reject) => {
      fs.readFile(`src/views/${htmlFileName}.html`, 'utf8', function (
        err,
        data,
      ) {
        if (err) {
          reject(err);
        }
        const page = document.createElement('html');
        page.innerHTML = data.toString();
        resolve(page);
      });
    });
  },
  /**
   * Parses html string and gets rquested element by tag name
   * @param { string } htmlString - html file inside a string
   * @param { string } elementTag - element to be searched for
   */
  getHTmlElements: (
    htmlString: string,
    elementTag: string,
  ): HTMLCollectionOf<Element> => {
    const el = document.createElement('html');
    el.innerHTML = htmlString;
    return el.getElementsByTagName(elementTag);
  },
};
