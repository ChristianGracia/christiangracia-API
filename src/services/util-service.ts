const utilService = {
    /**
     * Get time passed in code execution using startTime
     * @param { string } startTime - startTime
     */
    timePassed: (startTime): string => {
      return `${((new Date().getTime() - startTime) / 1000)} seconds`
    },
  };

  module.exports = utilService;
  