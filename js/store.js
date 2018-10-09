(function(window) {
  'use strict';

  function Store(name, callback) {
    callback = callback || function() {};

    this._dbName = name;

    if (!localStorage.getItem(name)) {
      var favourites = [];

      localStorage.setItem(name, JSON.stringify(favourites));
    }

    callback.call(this, JSON.parse(localStorage.getItem(name)));
  }

  Store.prototype.findAll = function(callback) {
    callback = callback || function() {};
    callback.call(this, JSON.parse(localStorage.getItem(this._dbName)));
  };

  Store.prototype.toggle = function(id, callback) {
    callback = callback || function() {};
    var favourites = JSON.parse(localStorage.getItem(this._dbName));
    var index = favourites.indexOf(id);
    if (index > -1) {
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this._dbName, JSON.stringify(favourites));
    callback.call(this, favourites);
  };

  Store.prototype.drop = function(callback) {
    var favourites = [];
    localStorage.setItem(this._dbName, JSON.stringify(favourites));
    callback.call(this, favourites);
  };

  Store.prototype.getUser = function(callback) {
    callback.call(this, JSON.parse(sessionStorage.getItem('user')));
  };

  Store.prototype.saveUser = function(user) {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
