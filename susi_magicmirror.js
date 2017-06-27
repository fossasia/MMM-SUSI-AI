/* global Module */

/* Magic Mirror
 * Module: Susi Magic Mirror
 *
 * By FOSSASIA
 * LGPL v2.1 Licensed.
 */

Module.register("susi_magicmirror",{

	// Default module config.
	defaults: {
		text: "Ask me anything!!"
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	}
	
});
