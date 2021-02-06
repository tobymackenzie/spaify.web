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
		//--array of selectors to replace from fetched content into DOM. defaults to `['main', 'title']`
		manageEls: undefined,

		//--element to operate on. defaults to `window.document`
		containerEl: undefined,

		//--id to separate this from other spa or non-spa
		id: undefined,

		//--messages
		formErrorMessage: 'There was an error submitting your form.  Please try again.',

		//--selectors for link and form elements we want to override to load as SPA
		formSelector: 'form',
		linkSelector: 'a[href^="/"],a[href^="./"],a[href^="../"],a[href^="' + window.location.origin + '"]',

		/*====
		==methods
		=====*/
		activate: function(){
			var _self = this;

			if(!this.id){
				this.id = (this.containerEl === window.document ? this.containerEl.querySelector('html') : this.containerEl).dataset.spaify;
			}

			window.addEventListener('popstate', function(event){
				_self.handleStatePop(event);
			});

			//--override internal links to use our loading logic
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

			//--override form submissions to use our loading logic
			if(window.FormData && window.URLSearchParams){
				this.containerEl.addEventListener('submit', function(event){
					if(event.target.matches(_self.formSelector)){
						event.preventDefault();
						_self.handleSubmission(event.target);
					}
				}, false);
			}

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
		doSPAifyResponse: function(response, data, el){
			return el.dataset.spaify === this.id;
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
		handleLoadError: function(href, fetchOpts, el){
			if(!fetchOpts){
				fetchOpts = {};
			}
			if(!fetchOpts.method || fetchOpts.method === 'GET'){
				//--let's just bypass fetch if we have an error and nothing to put into the DOM
				window.location = href;
			}else{
				//--since we can't send POST data with `window.location`, lets try to submit the form
				//-! could be problematic if form endpoint mutates something before failing, and second submission makes things worse
				if(el){
					if(typeof el.submit === 'function'){
						el.submit();
					}else{
						HTMLFormElement.prototype.submit.call(el);
					}
				}else{
					//--otherwise, show alert
					alert(this.formErrorMessage);
				}
			}
		},
		handleSubmission: function(form){
			var opts = {
				method: form.method ? form.method.toUpperCase() : 'POST',
			};
			var formData = new FormData(form);
			var action = form.action || window.location.href;
			if(opts.method === 'GET'){
				var qs = new window.URLSearchParams(formData).toString();
				if(action.indexOf('?') === -1){
					action += '?' + qs;
				}else{
					action += '&' + qs;
				}
			}else{
				opts.body = formData;
			}
			this.loadPage(action, opts, form);
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
		loadPage: function(href, fetchOpts, el){
			var _self = this;
			if(!fetchOpts){
				fetchOpts = {};
			}
			//-! show loading message
			return fetch(href, fetchOpts).then(function(response){
				return response.text().then(function(text){
					var tmpEl = (new DOMParser()).parseFromString(text, 'text/html');
					if(tmpEl instanceof HTMLDocument){
						tmpEl = tmpEl.querySelector('html');
					}
					var data = _self.getStateDataForEl(tmpEl);
					if(_self.doSPAifyResponse(response, data, tmpEl)){
						window.history.pushState(data, data.title || '', href);
						_self.handleStateChange(data, true);
					}else{
						throw 1;
					}
				});
			}).catch(function(){
				_self.handleLoadError(href, fetchOpts, el);
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
