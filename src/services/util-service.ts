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
    * @param { number } data - string data read from a file
    */
    formatFileToHtmlString: (data: string): string => {
      let html = '';
      data.split('\n').forEach((item : string) => {
        html += `<p>${item.replace(/\s/g, '&nbsp;')}</p>`;
      })
      return html;
    },
};

  module.exports = utilService;
  