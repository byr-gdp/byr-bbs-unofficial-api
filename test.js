var boardInfo = require('./lib/utily.js');

var chai = require('chai');
var should = chai.should();

describe('Function', function() {
  it('should return true when boardName is Feeling', function() {
    boardInfo.isBoardValid('Feeling').should.be.true;
  });

  it('should return false when boardName is unknown', function() {
    boardInfo.isBoardValid('unknown').should.not.be.true;
  });
});