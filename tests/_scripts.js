import spaify from './_src/main.js';

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

spaify.sub('load', function(){
	console.log('spaify content loaded', arguments);
})
