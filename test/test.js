'use strict';
/* global describe, it */
var should = require('should');
var calc = require('../index.js').calc;

var MIXED_CSS = '.a_1CamelCase div#id span#push-btn li[id="123"]:after:nth-child(2n+1) .something[data-x="some"] a::before b.first-line::after';

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
      should.equal(calc('::first-letter'), 1);
      should.equal(calc(':first-line'), 1);
      should.equal(calc(':first-line ::before'), 2);
    });

    it('should returns 10 for each pseudo class.', function () {
      should.equal(calc(':first-child'), 10);
      should.equal(calc(':nth-child(0)'), 10);
      should.equal(calc(':first-child :nth-child(0)'), 20);
      should.equal(calc(':first-child :nth-child(0) :nth-child(3n+1)'), 30);
    });

    it('should returns 10 for each attribute.', function () {
      should.equal(calc('[id="anId"]'), 10);
      should.equal(calc('[required]'), 10);
      should.equal(calc('[required] [id="anId"]'), 20);
    });

    it('should returns 100 for each ID.', function () {
      should.equal(calc('#id'), 100);
      should.equal(calc('#id #another-id'), 200);
      should.equal(calc('#id #another-id #and_another-id'), 300);
    });

    it('should returns 10 for each class.', function () {
      should.equal(calc('.btn'), 10);
      should.equal(calc('.btn .control'), 20);
      should.equal(calc('.btn .control .ui-layout_cls'), 30);
    });

    it('should returns 1 for each element.', function () {
      should.equal(calc('a'), 1);
      should.equal(calc('*'), 1);
      should.equal(calc('*, a'), 2);
      should.equal(calc('*, a > li form'), 4);
    });

    it('should also handle mixed complicated selectors correctly.', function () {
      should.equal(calc(MIXED_CSS), 268);
      should.equal(calc('#nav .selected > a:hover'), 121);
    });

  });
});