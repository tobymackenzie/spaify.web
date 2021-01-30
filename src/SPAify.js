import {BaseClass, create as createClass} from './classes.js';

var SPAify = createClass({
	init: function(){
		BaseClass.prototype.init.apply(this, arguments);
		if(!this.manageEls){
			this.manageEls = ['main', 'title'];
		}
		if(!this.containerEl){
			this.containerEl = window.document;
		}
		this.activate();
	},
	props: {
		/*=====
		==config
		======*/
		//--element to operate on. defaults to `window.document`
		containerEl: undefined,

		//--selector for link elements we want to override to load as SPA
		linkSelector: 'a[href^="/"],a[href^="./"],a[href^="../"],a[href^="' + window.location.origin + '"]',

		//--array of selectors to replace from fetched content into DOM. defaults to `['main', 'title']`
		manageEls: undefined,

		/*====
		==methods
		=====*/
		activate: function(){
			var _self = this;
			window.addEventListener('popstate', function(event){
				_self.handleStatePop(event);
			});
			this.containerEl.addEventListener('click', function(event){
				//--don't override if not left click or modifier key pressed
				if(event.which !== 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){
					return true;
				}

				var target = event.target;
				if(!target.matches(_self.linkSelector)){
					target = target.closest(_self.linkSelector);
				}
				if(target && target.matches(_self.linkSelector)){
					event.preventDefault();
					event.stopPropagation();
					_self.loadPage(target.href);
				}
			}, false);

			//--set data for initial page for when going back
			var initialData = this.getStateDataForEl(this.containerEl);
			window.history.replaceState(initialData, initialData.title || '');

			//--tell screen readers we'll be modifying these regions
			this.manageEls.forEach(function(selector){
				var el = _self.containerEl.querySelector(selector);
				if(el && !el.hasAttribute('aria-live')){
					el.setAttribute('aria-live', 'polite');
				}
			});
		},
		getStateDataForEl: function(el){
			var data = {};
			this.manageEls.forEach(function(selector){
				var loadEl = el.querySelector(selector);
				if(loadEl){
					data[selector] =  loadEl.innerHTML;
				}
			});
			return data;
		},
		handleStateChange: function(data, isNewLoad){
			//-! remove loading message
			var _self = this;
			this.manageEls.forEach(function(selector){
				_self.replaceElContent(selector, data[selector] || '');
			});

			//--scroll to top like full page refresh if necessary
			if(isNewLoad){
				window.scrollTo(0, 0);
			}
		},
		handleStatePop: function(event){
			this.handleStateChange(event.state);
		},
		loadPage: function(href){
			var _self = this;
			//-! show loading message
			fetch(href).then(function(response){
				response.text().then(function(text){
					var tmpEl = document.createElement('div');
					tmpEl.innerHTML = text;
					var data = _self.getStateDataForEl(tmpEl);
					window.history.pushState(data, data.title || '', href);
					_self.handleStateChange(data, true);
				});
			});
		},
		replaceElContent: function(el, content){
			if(typeof el === 'string'){
				el = this.containerEl.querySelector(el)
			}
			if(el){
				el.innerHTML = content;
				return true;
			}else{
				return false;
			}
		},

	},
});

export default SPAify;
