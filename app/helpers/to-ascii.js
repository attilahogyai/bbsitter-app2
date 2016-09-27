import Ember from 'ember';

export function toAscii(params) {
  return params[0].replace(/[őóöÖŐÓ]/g, "o").replace(/[üúűÜÚŰ]/g, "u").replace(/[áÁ]/g, "a").replace(/[éÉ]/g, "e").replace(/[Íí]/g, "i").replace(/ /g, "-");
}

export default Ember.HTMLBars.makeBoundHelper(toAscii);
