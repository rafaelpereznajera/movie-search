(function(window) {
  'use strict';

  /**
   * Creates a new Model instance and hooks up the storage.
   *
   * @constructor
   * @param {object} storage A reference to the client side storage class
   */
  function Model(storage, webservice) {
    this.storage = storage;
    this.webservice = webservice;
    this.state = { list: [] };
  }

  Model.prototype.search = function(title, callback) {
    title = title || '';
    callback = callback || function() {};
    this.storage.findAll(favourites => {
      if (this.state.list[title]) {
        var data = this.state.list[title];
        var list = data.Search || [];
        var movies = list.map(item => {
          return { ...item, favourite: favourites.includes(item.imdbID) };
        });
        callback.call(this, {
          movies,
          hasMore: movies.length < data.totalResults,
          error: null
        });
      } else {
        var self = this;
        this.webservice.find(title, function(data) {
          self.state.list[title] = data;
          var list = data.Search || [];
          var movies = list.map(item => {
            return { ...item, favourite: favourites.includes(item.imdbID) };
          });
          callback.call(self, {
            movies,
            hasMore: movies.length < data.totalResults,
            error: data.Error
          });
        });
      }
    });
  };

  Model.prototype.next = function(title, callback) {
    this.storage.findAll(favourites => {
      var data = this.state.list[title];
      var page = data.Search.length / 10 + 1;
      this.webservice.next(title, page, payload => {
        var newArray = data.Search.concat(payload.Search);
        this.state.list[title].Search = newArray;
        var movies = this.state.list[title].Search.map(item => {
          return { ...item, favourite: favourites.includes(item.imdbID) };
        });
        callback.call(this, {
          movies,
          hasMore: movies.length < payload.totalResults,
          error: payload.Error
        });
      });
    });
  };

  Model.prototype.detail = function(imdbID, callback) {
    imdbID = imdbID || '';
    callback = callback || function() {};
    this.storage.findAll(favourites => {
      this.webservice.detail(imdbID, data => {
        callback.call(this, {
          ...data,
          favourite: favourites.includes(data.imdbID)
        });
      });
    });
  };

  Model.prototype.toggleFavourite = function(imdbID, callback) {
    imdbID = imdbID || '';
    callback = callback || function() {};
    this.storage.toggle(imdbID, callback);
  };

  Model.prototype.user = function(callback) {
    callback = callback || function() {};
    this.storage.getUser(callback);
  };

  Model.prototype.saveUser = function(user, callback) {
    callback = callback || function() {};
    callback.call(this.storage.saveUser(user));
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
