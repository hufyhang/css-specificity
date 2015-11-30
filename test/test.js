'use strict';
/* global describe, it */
var should = require('should');
var calc = require('../index.js').calc;

var MIXED_CSS = '.a_1CamelCase div#id span#push-btn li[id="123"]:after:nth-child(2n+1) .something[data-x="some"] a::before b.first-line::after';

function isEqual(a, b) {
  should.equal(a.join(','), b.join(','));
}

describe('CSS Specificity Calculator', function () {
  describe('#calculate()', function () {

    it('should be successfully imported.', function () {
      should.exist(calc);
    });

    it('should throw error when received a non-string parameter.', function () {
      should.throws(function () {
        calc(0);
      });
    });

    it('should returns 1 for each pseudo element.', function () {
      isEqual(calc('::first-letter'), [0, 0, 0, 1]);
      isEqual(calc(':first-line'), [0, 0 ,0, 1]);
      isEqual(calc(':first-line ::before'), [0, 0, 0, 2]);
    });

    it('should returns 10 for each pseudo class.', function () {
      isEqual(calc(':first-child'), [0, 0, 1, 0]);
      isEqual(calc(':nth-child(0)'), [0, 0, 1, 0]);
      isEqual(calc(':first-child :nth-child(0)'), [0, 0, 2, 0]);
      isEqual(calc(':first-child :nth-child(0) :nth-child(3n+1)'), [0, 0, 3, 0]);
    });

    it('should returns 10 for each attribute.', function () {
      isEqual(calc('[id="anId"]'), [0, 0, 1, 0]);
      isEqual(calc('[required]'), [0, 0, 1, 0]);
      isEqual(calc('[required] [id="anId"]'), [0, 0, 2, 0]);
    });

    it('should returns 100 for each ID.', function () {
      isEqual(calc('#id'), [0, 1, 0, 0]);
      isEqual(calc('#id #another-id'), [0, 2, 0, 0]);
      isEqual(calc('#id #another-id #and_another-id'), [0, 3, 0, 0]);
    });

    it('should returns 10 for each class.', function () {
      isEqual(calc('.btn'), [0, 0, 1, 0]);
      isEqual(calc('.btn .control'), [0, 0, 2, 0]);
      isEqual(calc('.btn .control .ui-layout_cls'), [0, 0, 3, 0]);
    });

    it('should returns 1 for each element.', function () {
      isEqual(calc('a'), [0, 0, 0, 1]);
      isEqual(calc('*'), [0, 0, 0, 1]);
      isEqual(calc('*, a'), [0, 0, 0, 2]);
      isEqual(calc('*, a > li form'), [0, 0, 0, 4]);
    });

    it('should also handle mixed complicated selectors correctly.', function () {
      isEqual(calc(MIXED_CSS), [0, 2, 6, 8]);
      isEqual(calc('#nav .selected > a:hover'), [0, 1, 2, 1]);
    });

  });
});