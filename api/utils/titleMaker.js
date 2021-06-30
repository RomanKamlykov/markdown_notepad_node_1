// @ts-check
/**
 * @param {string} str
 * @returns {string}
 */
module.exports = function titleMaker(str) {
  if (!str) return '';
  const firstLine = str.split('\n')[0];
  const title = firstLine.replace(/#/g, '').trim();
  return title;
};
