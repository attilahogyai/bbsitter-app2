import Ember from 'ember';
import App from "xprt/app";
export default Ember.Controller.extend({
	requestid:null,
	newPassword:null,
	email:null,
	locX_password_again:App.locX('/general/password_again')
});