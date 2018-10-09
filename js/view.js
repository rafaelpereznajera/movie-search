/*global qs, qsa, $on, $parent, $delegate */

(function(window) {
  'use strict';

  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$user = qs('.user');
    this.$main = qs('.main');
  }

  View.prototype.render = function(viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      clearNewSearch: function() {
        self.$newSearch.value = '';
      },
      movieList: function() {
        self.$main.innerHTML = self.template.list(parameter);
      },
      detailItem: function() {
        self.$main.innerHTML = self.template.detail(parameter);
      },
      error: function() {
        if (parameter) {
          qs('.error').innerHTML = '<p>Error: ' + parameter + '</p>';
        } else {
          qs('.error').innerHTML = '';
        }
      },
      user: function() {
        if (parameter) {
          self.$user.innerHTML = self.template.user(parameter);
        } else {
          self.$user.innerHTML = self.template.login();
        }
      }
    };

    viewCommands[viewCmd]();
  };

  View.prototype._itemId = function(element) {
    var li = $parent(element, 'li');
    return li.dataset.id;
  };

  View.prototype.bind = function(event, handler) {
    var self = this;
    if (event === 'newSearch') {
      $on(qs('.new-search'), 'change', function() {
        handler(qs('.new-search').value);
      });
    } else if (event === 'detailItem') {
      $delegate(qs('.movie-list'), 'li div', 'click', function() {
        handler({ imdbID: self._itemId(this) });
      });
      $delegate(qs('.movie-list'), 'li label', 'click', function() {
        handler({ imdbID: self._itemId(this) });
      });
      $delegate(qs('.movie-list'), 'li img', 'click', function() {
        handler({ imdbID: self._itemId(this) });
      });
    } else if (event === 'favouriteItem') {
      $delegate(qs('.movie-list'), 'li .list-title span', 'click', function() {
        handler({ imdbID: self._itemId(this) });
      });
    } else if (event === 'detailFavouriteItem') {
      $delegate(qs('.detail-data'), 'span', 'click', function() {
        handler();
      });
    } else if (event === 'loadMore') {
      $delegate(qs('.load-more'), 'label', 'click', function() {
        handler({});
      });
    } else if (event === 'login') {
      $on(qs('.login-user'), 'change', function() {
        handler(qs('.login-user').value);
      });
    } else if (event === 'logout') {
      $delegate(qs('.logout-user'), 'button', 'click', function() {
        handler();
      });
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.View = View;
})(window);
