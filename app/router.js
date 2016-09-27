import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
//	this.route('component-test');
//	this.route('helper-test');
    //this.route('application_loading');

    this.route('search',{path:'/search/:cId/:cN'});
    this.route('activate',{path:'/activate/:code'});
    this.route('terms',{path:'/terms'});
    this.route('privacy',{path:'/privacy'});
    //this.route('about',{path:'/about'});
    
	this.resource('admin', {path: 'admin'},function() {
		this.resource("admin.editor", {path: "editor"});
	});
    this.resource('profile',{ path: '/profile'}, function() {
        this.resource('profile.xprt',{ path: 'xprt'}, function() {
            this.route('index');
            this.route('timetable',{path:'timetable/:xprtid'});
            this.route('exceptions',{path:'exceptions/:xprtid'});
        });
    });
/*
    this.resource('user',{ path: '/user'}, function() {
        this.route('signup',{path:'signup'});
        this.route('signin',{path:'signin'});
        this.route('forgot',{path:'forgot'});
    });
*/
    this.resource('detail',{ path: '/detail/:xprtId/:name'}, function() {
        this.route('edit',{path:'edit/:id'});
        this.route('new',{path:'new/:xprt/:host/:startDate/:startTimeH/:startTimeM'});
    });

    this.resource('user',{ path: '/user/:userId'});
    this.resource('forgotpwchange',{ path: '/forgotpwchange/:requestid'});
    this.resource('oauth2callback',{ path: '/oauth2callback/:authToken/:state'});
    this.resource('foauth2callback',{ path: '/foauth2callback/:authToken'});
    this.route('professionselector',{ path: '/professionselector'});
    this.resource('pulzer',{ path: '/pulzer'}, function() {
        this.route('new',{path:'new/:xprt/:host/:startDate/:startTimeH/:startTimeM'});
        this.route('edit',{path:'edit/:id'});
        this.route('list',{path:'list'});
        this.route('rating',{path:'rating'});
        this.route('week',{path:'week/:actDate'});
        this.route('day',{path:'day/:actDate'});
        //this.route('confirm',{path:'confirm/:id'});
        this.route('messages',{path:'messages'});
    });
});

