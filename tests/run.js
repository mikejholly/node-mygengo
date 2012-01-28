var assert = require('assert')
  , mygengo = require('../lib/mygengo');

var m = mygengo.init({
    publicKey: 'cYJ=W6JR7ST4bOYJt#^O22=Cl3Aj$5~AlGRiAD$RU}6a3f)h#wXO9s0)$NBa_rQ9'
  , privateKey: 'TE{)=ns=())PixfMRT7(Z6m=QyXeowVLN-QIse(RslFrDt8vUaN[w~v-KuS5H0[W'
  , sandbox: true
});

m.getAccountStats(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountStats() completed successfully');
});
m.getAccountBalance(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountBalance() completed successfully');
});
m.getAccountBalance(function(json) {
  assert.equal(json.opstat, 'ok', 'getAccountBalance() completed successfully');
});