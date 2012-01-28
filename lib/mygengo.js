var request = require('request')
  , crypto = require('crypto')
  , _ = require('underscore')

function myGengo(opts) {
  _.defaults(this, opts, {
      publicKey: ''
    , privateKey: ''
    , sandbox: true
    , version: 'v1'
  });
  this.host = this.sandbox ? 'api.sandbox.mygengo.com' : 'api.mygengo.com';
};

myGengo.prototype.signRequest = function(params) {
  var data = _.map(Object.keys(params).sort(), function(key){
    return key + '=' + escape(params[key]);
  }).join('&');
  return crypto.createHmac('sha1', this.privateKey).update(data).digest('hex');
};

myGengo.prototype.makeRequest = function(method, path, params, callback) {
  params.api_key = this.publicKey;
  params.ts = new Date().getTime() / 1000;
  params.api_sig = this.signRequest(params);
  params = _.map(Object.keys(params), function(key){
    return key + '=' + escape(params[key]);
  }).join('&');
  var uri = 'http://' + this.host + '/' + this.version + path;
  if (method == 'GET') {
    uri += '?' + params;
  }
  var opts = {
      uri: uri
    , method: method
    , headers: {Accept: "application/json"}
  };
  if (method != 'GET') {
    opts.body = params;
  }
  request(opts, function(e, r, body) {
    var json = JSON.parse(body);
    callback(json);
  });
};

myGengo.prototype.getAccountStats = function(callback) {
  this.makeRequest('GET', '/account/stats', {}, callback);
};
myGengo.prototype.getAccountBalance = function(callback) {
  this.makeRequest('GET', '/account/balance', {}, callback);
};
myGengo.prototype.getTranslationJobPreviewImage = function(id, callback) {
  this.makeRequest('GET', '/translate/job/' + id + '/preview', {}, callback);
};
myGengo.prototype.getTranslationJobRevision = function(id, revId, callback) {
  this.makeRequest('GET', '/translate/job/' + id + '/revision/' + revId, {}, callback);
};
myGengo.prototype.getTranslationJobRevisions = function(id, callback) {
  this.makeRequest('GET', '/translate/job/' + id + '/revisions', {}, callback);
};
myGengo.prototype.getTranslationJobFeedback = function(id, callback) {
  this.makeRequest('GET', '/translate/job/' + id + '/feedback', {}, callback);
};
myGengo.prototype.postTranslationJobComment = function(id, comment, callback) {
  this.makeRequest('POST', '/translate/job/' + id + '/comment', {body: comment}, callback);
};
myGengo.prototype.getTranslationJobComments = function(id, callback) {
  this.makeRequest('POST', '/translate/job/' + id + '/comments', {}, callback);
};
myGengo.prototype.deleteTranslationJob = function(id, callback) {
  this.makeRequest('DELETE', '/translate/job/' + id , {}, callback);
};
myGengo.prototype.getTranslationJob = function(id, callback) {
  this.makeRequest('GET', '/translate/job/' + id , {}, callback);
};
myGengo.prototype.putTranslationJob = function(id, params, callback) {
  this.makeRequest('PUT', '/translate/job/' + id , params, callback);
};
myGengo.prototype.rejectTranslationJob = function(id, reason, captcha, followup) {
  var params = {
      action: 'reject'
    , reason: reason
    , captcha: captcha
    , followup: followup
  };
  this.putTranslationJob(id, params, callback);
};
myGengo.prototype.approveTranslationJob = function(id, rating, translatorComment, staffComment, public) {
  var params = {
      action: 'approve'
    , rating: rating
    , for_translator: translatorComment
    , for_mygengo: staffComment
  };
  this.putTranslationJob(id, params, callback);
};
myGengo.prototype.reviseTranslationJob = function(id, comment) {
  var params = {
      action: 'revise'
    , comment: comment
  };
  this.putTranslationJob(id, params, callback);
};
myGengo.prototype.postTranslationJob = function(id, job, callback) {
  /* see http://mygengo.com/api/developer-docs/methods/translate-jobs-post/ for all opts */
  this.makeRequest('POST', '/translate/job', job, callback);
};
myGengo.prototype.postTranslationJob = function(id, groupId, callback) {
  this.makeRequest('GET', '/translate/jobs/group/' + groupId , {}, callback);
};
myGengo.prototype.getTranslationJobs = function(id, opts, callback) {
  /* see http://mygengo.com/api/developer-docs/methods/translate-jobs-get/ for all opts */
  this.makeRequest('GET', '/translate/jobs', opts, callback);
};
myGengo.prototype.postTranslationJobs = function(id, jobs, asGroup, callback) {
  opts = _.defaults(opts, {
      jobs: jobs
    , as_group: asGroup
  });
  this.makeRequest('POST', '/translate/jobs' , opts, callback);
};
myGengo.prototype.getServiceLanguagePairs = function(srcLang, callback) {
  var opts = {};
  if (srcLang) opts.lc_src = srcLang;
  this.makeRequest('GET', '/translate/service/language_pairs', opts, callback);
};
myGengo.prototype.getServiceLanguages = function(callback) {
  this.makeRequest('GET', '/translate/service/languages', {}, callback);
};
myGengo.prototype.getServiceQuote = function(jobs, callback) {
  this.makeRequest('GET', '/translate/service/quote', {jobs: jobs}, callback);
};

exports.init = function(opts) {
  return new myGengo(opts);
};