(function(root) {

    var Backbone = root.Backbone,
        _ = root._,
        $ = root.jQuery;

    $(function() {

        var UserModel = Backbone.Model.extend({
            defaults: {
                deleting: false,
                first_name: null,
                last_name: null, 
                bio: null,
                username: null
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
            initialize: function() {
                this.listenTo(this.collection, 'add', this.renderItem);
            },
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
                Backbone.trigger('user:edit', this.model);
                e.preventDefault();
            },
            onView: function(e) {
                Backbone.trigger('user:view', this.model);
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
            events: {
                'click .app-btn-save': 'onSave',
                'click .app-btn-delete': 'onDelete',
                'submit .app-form': 'onSave'
            },
            template: _.template( $('#app-user-edit').html() ),
            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.remove);
            },
            render: function() {
                this.$el.html( this.template() );
                return this;
            },
            onSave: function(e) {
                this.model
                    .set({
                        first_name: this.$('.app-first-name').val(),
                        last_name: this.$('.app-last-name').val(),
                        bio: this.$('.app-bio').val(),
                        username: this.$('.app-bio').val()
                    })
                    .save()
                    .done( Backbone.trigger.bind(Backbone, 'user:save', this.model) )
                    .fail( alert.bind('Coś poszło nie tak.') );

                e.preventDefault();
            },
            onDelete: function(e) {
                if (root.confirm('Naprawde chcesz usunuć model?')) {
                    this.model.destroy();
                }

                e.preventDefault();
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
            leftRegion: $('.app-left-region'),
            rightRegion: $('.app-right-region'),
            newUserBtn: $('.app-btn-new-user'),
            run: function() {
                this.users = new UserCollection();

                this.users
                    .fetch()
                    .done(this.renderUsers.bind(this));

                Backbone
                    .on('user:edit', this.renderEditUser, this)
                    .on('user:view', this.renderViewUser, this)
                    .on('user:save', this.addToUsers, this)

                    .trigger('user:edit', new UserModel());

                this.newUserBtn
                    .on('click', this.onNewUser.bind(this));
            },
            addToUsers: function(model) {
                this.users.add(model);
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
                Backbone.trigger('user:edit', new UserModel());

                e.preventDefault();
            }
        };

        app.run();
    });
})(this);