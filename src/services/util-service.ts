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
  };

  module.exports = utilService;
  