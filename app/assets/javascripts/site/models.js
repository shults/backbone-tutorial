(function(root) {
    'use strict';

    var $           = root.jQuery,
        _           = root._,
        Backbone    = root.Backbone;

    var User = root.User = Backbone.Model.extend({
        urlRoot: '/users'
        //url: function() {
            //var url;
            //if (this.isNew()){
            //    url = "/users.json";
            //} else {
            //    url = "/users/" + this.id + ".json";
            //}
            //return url;
        //}
    });

})(this);