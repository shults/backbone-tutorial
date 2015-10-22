/**
 * Wszystko co jest w tym skrypci zamykam
 * wewnątrz funkcji natychmiastowej.
 * Dlatego żeby wszystkie zmienne jakie będą używane w
 * tym skrypcie były lokalnymi.
 *
 * To powoduje unikanie podstawowych błedów i robi kod czystszym.
 * Exsportowanie do głobalnego namespasu wygłąda w następującyj sposób
 * ```
 *      root.ExternalConstructor = SomeInternalConstructor;
 * ```
 */
;(function(root) {
    'use strict';

    /**
     * Importujemy objekty z głobalnego namespasu.
     * To nam pozwoli kożystać z lokalnych linków na te objekty.
     * I pod czas obfuskacji (zacięmninia) kodu.
     * Rati jest liepszym zmniejszenia kodu będzie liepszym.
     * [ration] = [rozmiar pliku po obfuskacji] / [rozmiar pliku na początku]
     */
    var Backbone = root.Backbone,
        _ = root._,
        $ = root.jQuery;

    /**
     * Wszystkie kłasy jakie są zdefiniowane
     * w tej SPA (Single Page Application)
     * są zamykane f kollbacku $(document).ready()
     * Jest to zrobione z tego powodu że widoki jakie są
     * w tym SPA kożystają z DOM, bo w DOMu są zdefiniowane templatki.
     * Dlatego muśimy poczekać póki templatka załaduje (DOM zostanie przeanalizowany przeglądarke)
     */
    $(function() {
        /**
         * Model użytkownika
         * @constructor
         * @class
         */
        var UserModel = Backbone.Model.extend(
            /**
             * Ten objekt rozszerza prototyp
             * @lends UserModel.prototype
             */
            {
                /**
                 * To url root.
                 * Na jaki są wysyłane requsty POST,PUT,GET,DELETE.
                 * @see [sync] {@link http://backbonejs.org/#Sync} synchronizacja z serwerem. może być przypisana
                 * @see [Backbone.emulateHTTP] {@link http://backbonejs.org/#Sync-emulateHTTP}
                 * @see [Backbone.emulateJSON] {@link http://backbonejs.org/#Sync-emulateJSON}
                 */
                urlRoot: '/users',
                /**
                 * Domyślne właściwości.
                 * Jeżeli one nie będą zdefiniowane to
                 * user.get('undefined_property') zwróci undefined
                 */
                defaults: {
                    deleting: false,
                    first_name: null,
                    last_name: null,
                    bio: null,
                    username: null
                },
                /**
                 * Metoda jaka zwraca wartość właśćiwości 'deleting'
                 * @returns {bool}
                 */
                isDeleting: function() {
                    return this.get('deleting');
                },
                /**
                 * Jak w tytule metody
                 * @returns {string}
                 */
                fullName: function() {
                    return this.get('first_name') + ' ' + this.get('last_name');
                }
            }
        );

        /**
         * Konstruktor kollekcji
         */
        var UserCollection = Backbone.Collection.extend({
            /**
             * Podajemo konstrukto modeli dla tej kollekcji
             */
            model: UserModel,
            /**
             * Url do REST resource.
             * Modeli (Kollekcja) będzie pobierana metodą GET
             */
            url: '/users'
        });

        /**
         *
         */
        var UsersView = Backbone.View.extend({
            /**
             * Tworzymy templatke metodomo z biblioteki underscore
             * _.template("* treść templatki *")
             * @function template
             * @return {string}
             */
            template: _.template( $('#users-template').html() ),
            /**
             * To jest "konstruktor".
             * Te metoda będzie odpalana pod czas tworzenia nowej instancji objekta.
             */
            initialize: function() {
                /**
                 * Instancja objekta nasłuchuje instancje kollekcji.
                 * Jeżeli kollekcja ztrigeruje Event add, to będzie odpalona metoda this.renderItem
                 *
                 * W anałogiczny sposób moż by było wpisać.
                 * this.collection.on('add', this.renderItem, this);
                 * Ale tem backbona poleca wpisywać tak jak jest wpisano nie w komentarzach.
                 *
                 * Trzecim argumentem w this.collection.on idzie kontekst.
                 * Ten samy jaki jest używanye w jQuery.proxy, Function.prototype.call, Function.prototype.apply, Function.prototype.bind.
                 * Może nie dokłądnie ten ale widze jakieś podobięstwo
                 */
                this.listenTo(this.collection, 'add', this.renderItem);
            },
            /**
             * Sama metod renderująca.
             * Zawsze musi zwracać instancje samego objekta.
             *
             * @return {UsersView}
             */
            render: function() {
                // w tym miejscu renderujemy templatke
                this.$el.html( this.template() );

                // w tym miejscu iterujemy kołłekcje
                this.collection.each(this.renderItem, this);

                // zawsze zwracamy samego siebe
                return this;
            },
            renderItem: function(model) {
                this.$('.app-child-region').append(
                    new UserView({model: model}).render().$el
                );
            }
        });

        /**
         * To konstruktor widoku wierszu.
         */
        var UserView = Backbone.View.extend({
            /**
             * To definicja zdarzeń jawaskryptowych (jQuery)
             * Klucz - przez spacje "type eventy" + "jQuery selector"
             * Znaćzenie - to imie kollbacka jaki jest definiowany w tej metodzie
             */
            events: {
                'click .app-btn-delete': 'onDelete',
                'click .app-btn-edit': 'onEdit',
                'click .app-btn-view': 'onView'
            },
            /**
             * ```
             * // jeżeli poniższy kod wpisać w jakiejś metodzie to
             * this.$el[0].nodeName; // tr
             * ```
             */
            tagName: 'tr',
            template: _.template( $('#user-template').html() ),
            initialize: function() {
                // jeżeli model został zmieniony - renderujemy widok ponownie
                this.listenTo(this.model, 'change', this.render);
                // jeżeli model został usunięty - usuwamy widok
                this.listenTo(this.model, 'destroy', this.remove);
            } ,
            render: function() {
                // toggleClass przyimuje drugi argument
                // jest ot na tyle wspaniałe
                this.$el.toggleClass('hidden', this.model.isDeleting());
                this.$el.html( this.template() );
                return this;
            },
            onDelete: function(e) {
                // przełącamy selektor
                // w tym momencie ten widok w jakim jesteśmy
                // odrenderuje się ponownie
                // ale do elementu widoku będzie dodana klasa 'hodden'
                // i element będzie nie widoczny,
                this.model.set({
                    deleting: true
                });

                // za ty elementem renderujemy widok jaki odpowiada za usuwanie
                // do w widok podajemy model
                this.$el.after(
                    new UserRemoveView({model: this.model}).render().$el
                );

                e.preventDefault();
                e.stopPropagation();
            },
            onEdit: function(e) {
                /**
                 * W tym momencie jest rozwiązywany probłem z zagniżdżeniem.
                 * Probłem polega na tym że widok-wierz nie powinienen znać niczego o istnieniu
                 * widoku edyrtowania.
                 * Ale może wysłać jakieś żadanie do eventEmitera.
                 */
                eventDispatcher.trigger('user:edit', this.model);
                e.preventDefault();
            },
            onView: function(e) {
                /**
                 * Analogicznie jak w this.onEdit
                 */
                eventDispatcher.trigger('user:view', this.model);
                e.preventDefault();
            }
        });

        /**
         * Wirz jaki usuwa model.
         */
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
                /**
                 * Wyłączamy tryb edytowania.
                 * W tym przypadku wyrenderuje się odnowa widok wirzsu użytkownika.
                 * Proszę zauważyć że pracujemy tylko z modelem.
                 * Widok usuwanie niczego nie wie o istnieniu widoku innego.
                 * Niestety ni moge powiedzić odwrotnego.
                 */
                this.model.set({
                    deleting: false
                });

                /**
                 * Usuwamy samego siebie.
                 */
                this.remove();

                e.preventDefault();
            },

            onApprove: function(e) {
                this.model
                    // usuwamy model
                    .destroy()
                    // jeżeli został usunięty
                    // i wszystko spoko
                    // w tym przypadku to nie jest lipsżym rozwiązaniem
                    // liepiej nasłuchiwać model i po usuniećiu modelu usuwać widok
                    .done(this.remove.bind(this));

                e.preventDefault();
            }
        });

        /**
         * Widok dla tworzenia i edytowanie użytkowników
         */
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
            /**
             * Wyciągamy dane z DOMu.
             * I serializujemy tak jak potrebuje model.
             * @return {{first_name: *, last_name: *, bio: *, username: *}}
             */
            serialize: function() {
                return {
                    first_name: this.$('.app-first-name').val(),
                    last_name: this.$('.app-last-name').val(),
                    bio: this.$('.app-bio').val(),
                    username: this.$('.app-username').val()
                };
            },
            /**
             * W prypadku jeżeli save się uda,
             * to triggerujemy w naszym "głobalnym" event dispatczerze
             * akcje jaka sygnalizuje że był sworzony nowy model.
             *
             * Jezęli fail, to coś posało nie tak.
             * @param e
             */
            onSave: function(e) {
                this.model
                    .set(this.serialize())
                    .save()
                    .done( eventDispatcher.trigger.bind(eventDispatcher, 'user:save', this.model) )
                    .fail( alert.bind(null, 'Coś poszło nie tak.') );

                e.preventDefault();
            },
            /**
             * Tak mi się wydaję że tu nnic nie potrzebuje komentarze.
             * @param e
             */
            onDelete: function(e) {
                if (root.confirm('Naprawde chcesz usunuć model?')) {
                    this.model.destroy();
                }

                e.preventDefault();
            }
        });

        /**
         * Widok podglądu użytkownika.
         */
        var ViewUserView = Backbone.View.extend({
            template: _.template( $('#app-user-view').html() ),
            render: function() {
                this.$el.html( this.template() );
                return this;
            }
        });

        /**
         * To jes sama instancja naszej APPki
         * @type {{leftRegion: (*|HTMLElement), rightRegion: (*|HTMLElement), newUserBtn: (*|HTMLElement), run: Function, addToUsers: Function, renderUsers: Function, renderEditUser: Function, renderViewUser: Function, onNewUser: Function}}
         */
        var app = {
            // w tym mijscy są zdefiniowane regiony DOM  do
            // jakich będą wklejane elementy DOM
            leftRegion: $('.app-left-region'),
            rightRegion: $('.app-right-region'),
            newUserBtn: $('.app-btn-new-user'),

            run: function() {
                // tworztymy kollekcje
                this.users = new UserCollection();

                // pobieramy kollekcje z remote serwera
                this.users
                    // GET /users
                    .fetch()
                    // jeżeli kolekcja została pobrana
                    // to renderujemy ją
                    .done(this.renderUsers.bind(this));

                // tu definiujemy kollbacki naszego event dispatczera
                eventDispatcher
                    .on('user:edit', this.renderEditUser, this)
                    .on('user:view', this.renderViewUser, this)
                    .on('user:save', this.addToUsers, this)
                    // i natychmiast trigerujemy dodanie nowego usera
                    .trigger('user:edit', new UserModel());

                this.newUserBtn
                    .on('click', this.onNewUser.bind(this));
            },
            addToUsers: function(model) {
                // jeżeli był stworzony nowy model
                this.users.add(model);
            },
            renderUsers: function() {
                // render widoku z użytkownikamy
                this.leftRegion.html(
                    new UsersView({collection: this.users}).render().$el
                );
            },
            renderEditUser: function(model) {
                // render formularza dla dytowania
                this.rightRegion.html(
                    new UserEditView({model: model}).render().$el
                );
            },
            renderViewUser: function(model) {
                // rendere podglądu
                this.rightRegion.html(
                    new ViewUserView({model: model}).render().$el
                );
            },
            onNewUser: function(e) {
                // imitacja tworzenia nowego użytkownika
                eventDispatcher.trigger('user:edit', new UserModel());

                e.preventDefault();
            }
        };

        var eventDispatcher = _.extend({}, Backbone.Events);

        // uruchamaiamy appke
        app.run();

        /**
         * Dziękuje za przeczytanie!
         * Przepraszam za błedy gramatyczne, ortograficzne i programowe :)
         */
    });
})(this);
