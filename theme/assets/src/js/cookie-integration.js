var cookieConsent = $('.cookieConsent');

if (document.cookie.indexOf("cookie-consent-seen") == -1) {
	cookieConsent.show();
	expiry = new Date();
	expiry.setTime(expiry.getTime()+(365*24*60*60*1000));
	document.cookie = 'cookie-consent-seen=1; expires=' + expiry.toGMTString();
	cookieConsent.find('.close').click(function() {
		"use strict";
		cookieConsent.hide();
	});
}


