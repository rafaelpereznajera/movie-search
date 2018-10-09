(function(window) {
  'use strict';

  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var escapeHtmlChar = function(chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  var escape = function(string) {
    return string && reHasUnescapedHtml.test(string)
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  function Template() {
    this.defaultTemplate = `<li data-id="{{imdbID}}" class="list-li">
                              <div class="view">
                                <img src={{Poster}}/>
                                <div class="list-data">
                                  <div class="list-title">
                                    <label>{{title}}</label>
                                    <span class={{favourite}}>&#10084;</span>
                                  </div>
                                  <div class="list-detail">
                                    <label>{{Year}}</label>
                                    <label>{{Type}}</label>                                
                                  </div>
                                </div>
                              </div>
                            </li>`;
  }

  Template.prototype.show = function(data) {
    var i, l;
    var view = '';

    for (i = 0, l = data.length; i < l; i++) {
      var template = this.defaultTemplate;

      var checked = '';
      if (data[i].favourite) {
        checked = 'checked';
      }

      template = template.replace('{{imdbID}}', data[i].imdbID);
      template = template.replace('{{title}}', escape(data[i].Title));
      template = template.replace('{{Year}}', escape(data[i].Year));
      template = template.replace('{{Type}}', escape(data[i].Type));
      var img = escape(data[i].Poster);
      if (img === 'N/A') {
        img = '"./resources/notfound.png"';
      }
      template = template.replace('{{Poster}}', img);
      template = template.replace(
        '{{favourite}}',
        checked ? 'favourite' : 'no-favourite'
      );
      view = view + template;
    }

    return view;
  };

  Template.prototype.list = function(data) {
    var view =
      '<header class="header">' +
      '<h1>Search Movies:</h1>' +
      '<input class="new-search" placeholder="Movie title to search for" autofocus>' +
      '</header>' +
      '<section class="main">' +
      '<span class="error"></span>' +
      '<ul class="movie-list">' +
      this.show(data.movies) +
      '</ul>' +
      this.hasMore(data.hasMore) +
      '</section>';
    return view;
  };

  Template.prototype.hasMore = function(hasMore) {
    return hasMore
      ? '<div class="load-more"><label >load more movies</label></div>'
      : '<p></p>';
  };

  Template.prototype.detail = function(data) {
    var img = escape(data.Poster);
    if (img === 'N/A') {
      img = '"./resources/notfound.png"';
    }
    return `<section>
              <div class="detail-data">
                <p class="detail-title">
                  ${data.Title} 
                  <span class=${
                    data.favourite ? 'favourite' : 'no-favourite'
                  }>&#10084;</span>
                </p>
                <p>
                  <span class="detail-info">Type:</span> ${data.Type} 
                  <span class="detail-info">Year:</span> ${data.Year} 
                  <span class="detail-info">imdbRating: </span> 
                  ${data.imdbRating}
                </p>
                <p class="detail-plot">${data.Plot}</p>
                <p><span class="detail-info">Rated:</span> ${data.Rated}</p>
                <p>
                  <span class="detail-info">Released:</span> 
                  ${data.Released}
                </p>
                <p><span class="detail-info">Runtime:</span> ${data.Runtime}</p>
                <p><span class="detail-info">Genre:</span> ${data.Genre}</p>
                <p>
                  <span class="detail-info">Director: </span> 
                  ${data.Director}
                </p>
                <p><span class="detail-info">Writer:</span> ${data.Writer}</p>
                <p><span class="detail-info">Actors:</span> ${data.Actors}</p>
                <p>
                  <span class="detail-info">Language:</span> 
                  ${data.Language} 
                  <span class="detail-info">Country:</span> 
                  ${data.Country}
                </p>
              </div>
              <div class="detail-img">
                <img src=${img} />
              </div>
            </section> `;
  };

  Template.prototype.login = function() {
    var view = `<section class="logout-user">
        Login username:
        <input placeholder="name" class="login-user">
      </section>`;
    return view;
  };

  Template.prototype.user = function(user) {
    return `<section class="logout-user"> Welcome: ${user}
              <button type="button">
                logout
              </button>
            </section>`;
  };

  // Export to window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
