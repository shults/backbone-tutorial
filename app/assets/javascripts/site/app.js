(function(root) {

	var Backbone = root.Backbone,
        _ = root._,
        $ = root.jQuery;

    $(function() {

    	var UserModel = Backbone.Model.extend({
            defaults: {
                deleting: false
            },
            isDeleting: function() {
                return this.get('deleting');
            },
            fullName: function() {
                return this.get('first_name') + ' ' + this.get('last_name');
            },
    		urlRoot: '/users'
    	});

    	var UserCollection = Backbone.Collection.extend({
            model: UserModel,
            url: '/users'
    	});

        var UsersView = Backbone.View.extend({
            template: _.template( $('#users-template').html() ),
            render: function() {
                this.$el.html( this.template() );

                this.collection.each(this.renderItem, this);

                return this;
            },
            renderItem: function(model) {
                this.$('.app-child-region').append(
                    new UserView({model: model}).render().$el
                );
            }
        });

        var UserView = Backbone.View.extend({
            events: {
                'click .app-btn-delete': 'onDelete'
            },
            tagName: 'tr',
            template: _.template( $('#user-template').html() ),
            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
            } ,
            render: function() {
                this.$el.toggleClass('hidden', this.model.isDeleting());
                this.$el.html( this.template() );
                return this;
            },
            onDelete: function(e) {
                this.model.set({
                    deleting: true
                });

                this.$el.after(
                    new UserRemoveView({model: this.model}).render().$el
                );

                e.preventDefault();
                e.stopPropagation();
            }
        });

        var UserRemoveView = Backbone.View.extend({
            events: {
                'click .app-btn-approve': 'onApprove',
                'click .app-btn-cancel': 'onCancel'
            },
            tagName: 'tr',
            template: _.template( $('#app-user-remove').html() ),
            render: function() {
                this.$el.html( this.template() );
                return this;
            },
            onCancel: function(e) {
                this.model.set({
                    deleting: false
                });

                this.remove();

                e.preventDefault();
            },
            onApprove: function(e) {
                this.model
                    .destroy()
                    .done(this.remove.bind(this));

                e.preventDefault();
            }
        });


        // start app
        var users = new UserCollection();

        users.fetch()
            .done(function() {
                $('.app-left-region').html(
                    new UsersView({collection: users}).render().$el
                );
            });
    });
})(this);