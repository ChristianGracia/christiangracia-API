const inlineCss = require('inline-css');
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);
import * as fs from 'fs';
import * as path from 'path';

export const utilService = {
  /**
   * Get time passed in code execution using startTime
   * @param { Logger } logger - logger to write messages to console
   * @param { string } message - message tp write to console
   * @param { string } endTime - endTime in ms
   * @param { string } startTime - startTime in ms
   * @param { string } logLevel - level to log messages to console, warn debug etc
   */
  timePassed: (startTime): string => {
    return `${(new Date().getTime() - startTime) / 1000} seconds`;
  },
  /**
   * Gets random number in range min max
   * @param { number } min - range start
   * @param { number } max - range end
   */
  randonNumberInRange: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  /**
   * Reads a file and returns a string
   * @param { string } filePath - path of file to be read.
   */
  readFile: async function (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },
  /**
   * Converts files read as strings to html
   * @param { string } data - string data read from a file
   */
  parseCodeFileToHtml: async function (file: string, cssFilePath: string) {
    const html2 = await this.readFile('src/classes/spotify.ts');

    // const supportedLanguages = { 'ts': 'typescript' };
    // const fileArr = file.toString().split(".");
    // const fileType = fileArr[fileArr.length - 1];
    // if (!Object.keys(supportedLanguages).includes(fileType)) {
    //     return { status: 400, data: 'Unsupported file type language' };
    // }

    if (html2) {
      const htmlString = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <meta charset="utf-8" />
        <title>Christian Gracia | API</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <head>
        <style>
        </style>
        <link rel="stylesheet" href='src/assets/code-snippet.css'>
        </head>
        <body>
        <pre id='code-div'><code lang="typescript">${
          hljs.highlight(html2, { language: 'typescript' }).value
        }</code></pre>
        </body>
        </html>
        `;
      // return await htmlString;
      return inlineCss(htmlString, {
        url:
          'file://' +
          __dirname +
          '/' +
          path.dirname('../../code-snippet.css') +
          '/',
      }).then(function (html: string) {
        const startIndex = html.indexOf('<pre');
        const endIndex = html.indexOf('</pre>') + 6;
        return html.slice(startIndex, endIndex);
      });
    }
    return { status: 400, data: 'Error big errorinline css' };
  },
};
