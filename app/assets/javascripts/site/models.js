(function(root) {
    'use strict';

    var $           = root.jQuery,
        _           = root._,
        Backbone    = root.Backbone;

    var User = root.User = Backbone.Model.extend({
        urlRoot: '/users'
    });

    var UserCollection = root.UserCollection = Backbone.Collection.extend({
        url: '/users'
    });

})(this);