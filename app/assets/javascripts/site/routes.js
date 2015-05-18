;(function(root) {

    var $           = root.jQuery,
        _           = root._,
        Backbone    = root.Backbone;

    var Router = Backbone.Router.extend({
        routes: {
            'users': 'onUsers',
            'users/:id': 'onUser',
            '*default': 'onUsers'
        },
        onUsers: function() {
            console.log('Show all users');
        },
        onUser: function(userID) {
            console.log('Showing user #%s', userID);
        },
        initialize: function() {
            Backbone.history.start();
        }
    });

    // new router
    new Router();

})(this);