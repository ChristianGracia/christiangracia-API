const inlineCss = require('inline-css');
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);
import * as fs from 'fs';
import * as path from 'path';

const utilService = {
    /**
     * Get time passed in code execution using startTime
     * @param { Logger } logger - logger to write messages to console
     * @param { string } message - message tp write to console
     * @param { string } endTime - endTime in ms
     * @param { string } startTime - startTime in ms
     * @param { string } logLevel - level to log messages to console, warn debug etc
     */
    timePassed: (startTime): string => {
      return `${((new Date().getTime() - startTime) / 1000)} seconds`
    },
    /**
    * Gets random number in range min max
    * @param { number } min - range start
    * @param { number } max - range end
    */
    randonNumberInRange: (min: number, max: number): number => {
      return Math.floor(Math.random()*(max-min+1)+min);
    },

    /**
    * Converts files read as strings to html
    * @param { string } data - string data read from a file
    */
    formatFileToHtmlString: function (data: string)  {
      const startIndex = data.indexOf('<pre');
      const endIndex = data.indexOf('</pre>') + 6;
      const html = data.slice(startIndex, endIndex);
      return html;
    },
    /**
    * Converts files read as strings to html
    * @param { string } data - string data read from a file
    */
    parseCodeFileToHtml: function (file: string, language: string)  {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return err;
      }
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
      <pre id='code-div'><code lang="typescript">${hljs.highlight(data, {language : language}).value}</code></pre>
      </body>
      </html>
      `
      inlineCss(htmlString, {url: 'file://' + __dirname + '/'  + path.dirname('../../code-snippet.css') + '/'})
          .then(function(html) { 
            const startIndex = html.indexOf('<pre');
            const endIndex = html.indexOf('</pre>') + 6;
            html.slice(startIndex, endIndex);
            return html.slice(startIndex, endIndex);;
      });
      return "";
    })
  }
};

  module.exports = utilService;
  