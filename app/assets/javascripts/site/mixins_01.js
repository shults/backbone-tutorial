(function(root) {
  'use strict';

  var View = Backbone.View;

  var BaseView = View.extend({});

  var DragableMixin = {
    drag: function() {
      console.log('I am dragging ...', this);
    }
  };

  var TooltipbleMixin = {
    addTooltip: function() {
      this.$('[rel=white]').tooltip({
        position: 'bottom'
      });
    }
  };

  var SortableViewMixin = {
    sortBy: function(field) {
      // implementation
    }
  };

  var UsersView = BaseView.extend({
    events: {
      'click .app-sort-by-something': 'onDoSort'
    },
    render: function() {
      this.$el.html('<h1></h1>');
      this.addTooltip();
      return this;
    },
    onDoSort: function() {
      this.sortBy('something');
    }
  });

  _.extend(UsersView.prototype, DragableMixin, TooltipbleMixin, SortableViewMixin);

  var userView = new UsersView();
  userView.addTooltip();

})(this)
