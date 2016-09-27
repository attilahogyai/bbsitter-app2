import App from 'xprt/app';
import Ember from 'ember';
function locX(value,option1,option2,option3,option4) {
    return App.locX(value,option1,option2,option3);
}
export default Ember.Handlebars.makeBoundHelper( locX );
