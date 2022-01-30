import * as fs from 'fs';
import Logger from '../../src/config/winston';

export const htmlHelper = {
    /**
     * Reads html file an creates a DOM
     * @param { string } htmlFileName - html file to be parsed
     */
    createPage: async (htmlFileName: string) => {
        return new Promise((resolve, reject) => {
            fs.readFile(`src/views/${htmlFileName}.html`, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                const page = document.createElement( 'html' );
                page.innerHTML = data.toString();
                Logger.info(`--------------------- page created: '/home.html' ---------------------`);
                resolve(page);
            });
        });
    },
    /**
     * Parses html string and gets page title text
     * @param { string } htmlString - selected repo to view commits from
     */
    checkPageTitle: (htmlString: string) => {
        const el = document.createElement( 'html' );
        el.innerHTML = htmlString;
        return el.getElementsByTagName( 'title' )[0].textContent;
    }
}
  