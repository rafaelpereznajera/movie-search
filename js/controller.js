(function(window) {
  'use strict';

  /**
   * Takes a model and view and acts as the controller between them
   *
   * @constructor
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;
  }

  Controller.prototype.newSearch = function(search) {
    var self = this;

    if (search.trim() === '') {
      self.view.render('movieList', { movies: [] });
      self.view.bind('newSearch', function(search) {
        document.location.hash = '/' + encodeURIComponent(search);
      });
      return;
    }

    self.model.search(search, function(data) {
      self.view.render('movieList', data);
      self.view.bind('newSearch', function(search) {
        document.location.hash = '/' + encodeURIComponent(search);
      });
      self.view.bind('detailItem', function(item) {
        document.location.hash += '/' + item.imdbID;
      });
      self.view.bind('favouriteItem', function(item) {
        self.model.toggleFavourite(item.imdbID, () => {
          self.newSearch(search);
        });
      });
      if (data.hasMore) {
        self.view.bind('loadMore', function(item) {
          self.model.next(search, () => {
            self.newSearch(search);
          });
        });
      }
      self.view.render('error', data.error);
    });
  };

  Controller.prototype.detailItem = function(item) {
    var self = this;
    self.model.detail(item, function(data) {
      self.view.render('detailItem', data);
      self.view.bind('detailFavouriteItem', function() {
        self.model.toggleFavourite(data.imdbID, () => {
          self.detailItem(data.imdbID);
        });
      });
    });
  };

  Controller.prototype.user = function() {
    var self = this;
    self.model.user(function(data) {
      self.view.render('user', data);
      if (data) {
        self.view.bind('logout', function(name) {
          self.model.saveUser();
          self.user();
        });
      } else {
        self.view.bind('login', function(name) {
          self.model.saveUser(name);
          self.user();
        });
      }
    });
  };

  /**
   * Loads and initialises the view
   *
   */
  Controller.prototype.setView = function(locationHash) {
    var search = locationHash.split('/')[1];
    var detail = locationHash.split('/')[2];
    console.log({ search, detail });
    if (detail !== undefined) {
      this.detailItem(detail);
    } else if (search !== undefined) {
      this.newSearch(search);
    } else {
      this.newSearch('');
    }
    this.user();
  };

  // Export to window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
