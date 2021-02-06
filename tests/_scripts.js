import cutsMustard from '/_src/cutsMustard.js';
import SPAify from '/_src/SPAify.js';

//--load rest of shell
if(window.fetch){
	fetch('/_nav.html').then(function(response){
		response.text().then(function(text){
			var tmpEl = document.createElement('div');
			tmpEl.innerHTML = text;
			var navEl = tmpEl.querySelector('nav');
			if(navEl){
				var mainEl = document.querySelector('main');
				mainEl.parentNode.insertBefore(navEl, mainEl);
			}
		});
	});
}

//--enable SPA functionality
if(cutsMustard){
	new SPAify({manageEls: ['main', 'title']});
}
