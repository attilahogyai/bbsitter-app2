import Ember from 'ember';
export function initialize(instance) {
	window.App.Loader=instance.container.lookup("service:loader");
}

export default {
  name: 'loader',
  initialize: initialize
};
