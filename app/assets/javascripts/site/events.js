(function(root) {
    'use strict';

    var $           = root.jQuery,
        _           = root._,
        Backbone    = root.Backbone;

    // 01. Events
    // Pattern PubSub/Observer
    console.log(Backbone.Events);
    // once(name, callback, [context])
    // on(name, callback, [context])
    // off(name, callback, [context])

    // listenTo(obj, name, callback)
    // listenToOnce(obj, name, callback)
    // stopListening(obj, name, callback)

    // trigger(name, [*args])

    // bind => on
    // unbind => off

    // 02. Simple example
    // one published one subscriber
    //var publisher  = $.extend({}, Backbone.Events),
    ///    subscriber = $.extend({name: 'John Doe'}, Backbone.Events);
    //
    // subscriber.listenTo(publisher, 'newspaper', function() {
    //   console.log('Subscriber %s has got a newspaper', this.name);
    //});
    //
    //publisher.trigger('newspaper');

    // 03. Many publishers and many subscribers

    // Publisher Constructor
    function Publisher(name) {
         this.name = name;
    }
    $.extend(Publisher.prototype, {
        publishNewspaper: function(title) {
            this.trigger('newspaper', title, this);
        },
        publishMagazine: function(title) {
             this.trigger('magazine', title, this);
        }
    }, Backbone.Events);

    // // Subscriber Constructor
    function Subscriber(name) {
        this.name = name;
    }
    $.extend(Subscriber.prototype, {
        getNewspaper: function(title, publisher) {
            console.log("My name is %s and I'm reading newspaper %s from %s.", this.name, title, publisher.name);
        },
        getMagazine: function(title, publisher) {
            console.log("My name is %s and I'm reading magazine %s from %s.", this.name, title, publisher.name);
        }
    }, Backbone.Events);

    var newYorkTimes    = new Publisher('New York Times'),
         gazetaWyborcza  = new Publisher('Gazeta Wyborcza'),

    //     // subscribers
         johnDoe         = new Subscriber('John Doe'),
         janKowalski     = new Subscriber('Jan Kowalski');

    johnDoe.listenTo(newYorkTimes, 'newspaper', johnDoe.getNewspaper);

    janKowalski.listenTo(gazetaWyborcza, 'newspaper', janKowalski.getNewspaper);
    janKowalski.listenTo(gazetaWyborcza, 'magazine', janKowalski.getMagazine);

    newYorkTimes.publishMagazine('PHP kills Java');
    newYorkTimes.publishNewspaper('CSS10 IN Action');

    gazetaWyborcza.publishMagazine('Google bought Facebook');
    gazetaWyborcza.publishNewspaper('PHP vs JavaScript');

})(this);