/* global Todos */

const EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  checkedClass() {
    return this.checked && 'checked';
  },
  editingClass() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  }
});

Template.todosItem.events({
  'change [type=checkbox]'(event) {
    const checked = $(event.target).is(':checked');

    Todos.methods.setCheckedStatus({
      todoId: this._id,
      newCheckedStatus: checked
    });
  },

  'focus input[type=text]'() {
    Session.set(EDITING_KEY, this._id);
  },

  'blur input[type=text]'() {
    if (Session.equals(EDITING_KEY, this._id)) {
      Session.set(EDITING_KEY, null);
    }
  },

  'keydown input[type=text]'(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },

  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once
  // every 300ms)
  'keyup input[type=text]': _.throttle(function(event) {
    Todos.methods.updateText.call({
      todoId: this._id,
      newText: event.target.value
    });
  }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item'() {
    Todos.methods.remove.call({
      todoId: this._id
    });
  }
});
