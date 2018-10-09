(function(window) {
  'use strict';

  function WebService(name, callback) {
    callback = callback || function() {};

    this._name = name;
    this.host = 'https://www.omdbapi.com?apikey=f12ba140&r=json';
  }

  WebService.prototype.find = function(query, callback) {
    if (!callback) {
      return;
    }
    var url = this.host + '&s=' + query;
    this.get(url, callback);
  };

  WebService.prototype.next = function(query, page, callback) {
    var url = this.host + '&s=' + query + '&page=' + page;
    this.get(url, callback);
  };

  WebService.prototype.detail = function(item, callback) {
    if (!callback) {
      return;
    }
    var url = this.host + '&i=' + item;
    this.get(url, callback);
  };

  WebService.prototype.get = function(url, callback) {
    if (!callback) {
      return;
    }
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        callback.call(this, JSON.parse(xhr.responseText));
      }
    };
    xhr.open('GET', url);
    xhr.send();
  };

  // Export to window
  window.app = window.app || {};
  window.app.WebService = WebService;
})(window);
