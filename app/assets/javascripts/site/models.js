(function(root) {
    'use strict';

    var $           = root.jQuery,
        _           = root._,
        Backbone    = root.Backbone;

    var User = root.User = Backbone.Model.extend({
        defaults: {
            first_name: null,
            last_name: null,
            bio: null,
            username: null
        },
        urlRoot: '/users'
    });

    var UserCollection = root.UserCollection = Backbone.Collection.extend({
        url: '/users',
        model: User
    });

})(this);