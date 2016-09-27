export function initialize(/* container, application */) {
	window.fbAsyncInit = function() {
		FB.init({
		  appId      : '1425550287773146',
		  xfbml      : true,
		  version    : 'v2.3'
		});
	};

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/"+App.lastLangF+"/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

export default {
  name: 'fb-init',
  initialize: initialize
};
