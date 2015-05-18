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
                'click .app-btn-delete': 'onDelete',
                'click .app-btn-edit': 'onEdit',
                'click .app-btn-view': 'onView'
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
            },
            onEdit: function(e) {
                app.proxy.trigger('edit:user', this.model);
                e.preventDefault();
            },
            onView: function(e) {
                app.proxy.trigger('view:user', this.model);
                e.preventDefault();
            }
        });

        var UserRemoveView = Backbone.View.extend({
            events: {
                'click .app-btn-approve': 'onApprove',
                'click .app-btn-cancel': 'onCancel'
            },
            tagName: 'tr',
            className: 'danger',
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

        var UserEditView = Backbone.View.extend({
            template: _.template( $('#app-user-edit').html() ),
            render: function() {
                this.$el.html( this.template() );
                return this;
            }
        });

        var ViewUserView = Backbone.View.extend({
            template: _.template( $('#app-user-view').html() ),
            render: function() {
                this.$el.html( this.template() );
                return this;
            }
        });

        var app = {
            proxy: _.extend({}, Backbone.Events),

            leftRegion: $('.app-left-region'),
            rightRegion: $('.app-right-region'),

            newUserBtn: $('.app-btn-new-user'),

            run: function() {
                this.users = new UserCollection();

                this.users
                    .fetch()
                    .done(this.renderUsers.bind(this));

                this.proxy
                    .on('edit:user', this.renderEditUser, this)
                    .on('view:user', this.renderViewUser, this)

                    .trigger('edit:user', new UserModel({collection: this.users}));

                this.newUserBtn
                    .on('click', this.onNewUser.bind(this));
            },
            renderUsers: function() {
                this.leftRegion.html(
                    new UsersView({collection: this.users}).render().$el
                );
            },
            renderEditUser: function(model) {
                this.rightRegion.html(
                    new UserEditView({model: model}).render().$el
                );
            },
            renderViewUser: function(model) {
                this.rightRegion.html(
                    new ViewUserView({model: model}).render().$el
                );
            },
            onNewUser: function(e) {
                this.proxy
                    .trigger('edit:user', new UserModel({collection: this.users}));

                e.preventDefault();
            }
        };

        app.run();
    });
})(this);