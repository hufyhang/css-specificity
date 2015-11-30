'use strict';
(function (exports, undefined) {

  // All pseudo elements.
  var PSEUDO_ELEMENTS = [
   'after',
   'before',
   'first-letter',
   'first-line',
   'selection',
   'backdrop'
  ];

  /**
   * Search and remove substrings.
   * @param  {string} reg      Regular expression of the substrings to be hit.
   * @param  {string} selector CSS selector string.
   * @return {object}          {selector: 'processed selector string', length: 'times of hit'}
   */
  function search(reg, selector) {
    // Build up regex.
    var reg = new RegExp(reg, 'g');
    // Match all substrings.
    var hits = selector.match(reg) || [];
    // Clear all hit substrings.
    selector = selector.replace(reg, '');
    return {selector: selector, length: hits.length};
  }

  /**
   * Calculate specificity of a CSS selector.
   * @param  {string} selector A CSS selector to be calculated.
   * @return {number}          CSS specificity value.
   */
  function calculate (selector) {
    // If `selector` is not a string, throw an error.
    if (typeof selector !== 'string') {
      throw new Error('A "' + typeof selector +
                      '" type parameter found. Expected a "string".');
    }

    // The final specificity.
    var result = 0;
    var processed;
    // First off, iterate through pseudo elements. E.g.: :first-line, ::first-letter.
    PSEUDO_ELEMENTS.map(function (item) {
      processed = search(':{1,2}' + item, selector);
      // Each pseudo element worth 1 point.
      result += processed.length;
      // Update `selector` string.
      selector = processed.selector;
    });

    // Secondly, find all pseudo classes. E.g.: :hover, :nth-child(XXX).
    processed = search(':\\w+(\\-\\w+(\\(.*?\\))?)?', selector);
    // Each pseudo class worth 10 points.
    result += 10 * processed.length;
    // Update `selector` string.
    selector = processed.selector;

    // Thirdly, find all attributes. E.g.: [id="anId"], [required]
    processed = search('\\[.+?\\]', selector);
    // Each attribute worth 10 points.
    result += 10 * processed.length;
    selector = processed.selector;

    // Find all IDs. E.g.: #id, #this_is_an_id, #a-id.
    processed = search('#\\w+([_-]\\w+)?', selector);
    // Each ID worth 100 points.
    result += 100 * processed.length;
    selector = processed.selector;

    // Find all classes. E.g.: .cls, .push-btn.
    processed = search('\\.\\w+([_-]\\w+)?', selector);
    // Each class worth 10 points.
    result += 10 * processed.length;
    selector = processed.selector;

    // Find all elements. E.g.: a, li, a-element, *.
    // Before that, since there should be only ` `, `>`, `,`, and `+`
    // as symbols left in `selector` string, replace them with ` `.
    selector = selector.replace(/[>\,\+]/g, ' ');
    // Now replace continuous spaces with single space.
    selector = selector.replace(/[\ ]{2,}/g, ' ');
    processed = search('[\\*\\w]+(\\-*\\w*)?', selector);
    // Each element worth 1 point.
    result += processed.length;

    return result;

  }

  // Now, export `calculate`.
  exports.calc = calculate;

// If `exports` is available, then use it. Otherwise, export to `window.cssSpecificity`.
})(typeof exports !== 'undefined' ? exports : window.cssSpecificity);