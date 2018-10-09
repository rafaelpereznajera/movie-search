/*global app, $on */
(function() {
  'use strict';

  /**
   * Sets up a brand new Movie search.
   */
  function Movie(name) {
    this.webservice = new app.WebService(name);
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage, this.webservice);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  var movie = new Movie('gfi-vanillajs');

  function setView() {
    movie.controller.setView(document.location.hash);
  }
  $on(window, 'load', setView);
  $on(window, 'hashchange', setView);
})();
