import {BaseClass, create as createClass} from './classes.js';
var SPAify = createClass({
	init: function(){
		BaseClass.prototype.init.apply(this, arguments);
		if(!this.container){
			this.container = window.document;
		}
		this.activate();
	},
	props: {
		/*=====
		==config
		======*/
		//--array of selectors to replace from fetched content into DOM, configurable by user. required to function.  Example: `['main', 'title']`
		targets: undefined,

		//--element to operate on. defaults to `window.document`
		container: undefined,

		//--id to separate this from other spa or non-spa
		id: undefined,

		//--messages
		formErrorMessage: 'There was an error submitting your form.  Please try again.',

		//--selectors for link and form elements we want to override to load as SPA
		forms: 'form',
		links: 'a[href^="/"],a[href^="./"],a[href^="../"],a[href^="' + window.location.origin + '"]',

		/*====
		==methods
		=====*/
		activate: function(){
			var _self = this;

			if(!this.id){
				this.id = (this.container === window.document ? this.container.querySelector('html') : this.container).dataset.spaify;
			}
			if(!this.targets){
				return false;
			}

			window.addEventListener('popstate', function(event){
				_self.handleStatePop(event);
			});

			//--override internal links to use our loading logic
			this.container.addEventListener('click', function(event){
				//--don't override if not left click or modifier key pressed
				if(event.which !== 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey){
					return true;
				}

				var target = event.target;
				if(!target.matches(_self.links)){
					target = target.closest(_self.links);
				}
				if(target && _self.doSPAifyLink(target)){
					event.preventDefault();
					event.stopPropagation();
					_self.loadPage(target.href);
				}
			}, false);

			//--override form submissions to use our loading logic
			if(window.FormData && window.URLSearchParams){
				this.container.addEventListener('submit', function(event){
					if(_self.doSPAifyForm(event.target)){
						event.preventDefault();
						_self.handleSubmission(event.target);
					}
				}, false);
			}

			//--set up target els
			for(var i = 0; i < this.targets.length; ++i){
				//--normalize target el input
				var elData = this.targets[i];
				if(typeof elData !== 'object'){
					elData = this.targets[i] = {select: elData};
				}
				if(!elData.do){
					elData.do = 'content';
				}
				this.targets[i] = elData;

				//--tell screen readers we'll be modifying these regions
				if(elData.do === 'content' && elData.select){
					var el = _self.container.querySelector(elData.select);
					if(el && !el.hasAttribute('aria-live')){
						el.setAttribute('aria-live', 'polite');
					}
					elData.el = el
				}
			}

			//--set data for initial page for when going back
			var initialData = this.getStateDataForEl(this.container);
			window.history.replaceState(initialData, initialData.title || '');
		},
		doSPAifyForm: function(el){
			return el.matches(this.forms) && el.dataset.spaify !== 'false';
		},
		doSPAifyLink: function(el){
			return el.matches(this.links) && el.dataset.spaify !== 'false';
		},
		doSPAifyResponse: function(response, data, el){
			return el.dataset.spaify === this.id;
		},
		getStateDataForEl: function(el){
			var data = {foo: []};
			this.targets.forEach(function(elData, i){
				var select = elData.select || null;
				var doo = elData.do;
				var stateData = [];
				if(select){
					var loadEls = SPAify.getDocEls(select, el);
					for(var j = 0; j < loadEls.length; ++j){
						var loadEl = loadEls[j];
						var elStateData = {};
						switch(doo){
							case 'attr':
								var attrData = {};
								for(var k = 0;  k < loadEl.attributes.length; ++k){
									var attr = loadEl.attributes[k];
									attrData[attr.name] = attr.value;
								}
								elStateData.attr = attrData;
							break;
							case 'content':
								elStateData.content = loadEl.innerHTML;
							break;
							case 'replace':
								elStateData.content = loadEl.outerHTML;
							break;
						}
						stateData[j] = elStateData;
					}
				}
				data.foo[i] = stateData;
			});
			return data;
		},
		handleLoadError: function(href, fetchOpts, el){
			if(!fetchOpts){
				fetchOpts = {};
			}
			if(!fetchOpts.credentials){
				fetchOpts.credentials = 'same-origin';
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
			if(!data || !data.foo){
				return false;
			}
			_self.targets.forEach(function(elData, i){
				var foo = data.foo[i] || null;
				if(!foo){
					return;
				}
				if(!elData.el){
					if(elData.target){
						elData.el = SPAify.getDocEl(elData.target, _self.container);
					}else if(elData.select && elData.do && (elData.do === 'attr' || elData.do === 'content')){
						elData.el = SPAify.getDocEl(elData.select, _self.container);
					}
				}
				switch(elData.do){
					case 'attr':
						//--clear existing attr
						for(var j = elData.el.attributes.length; --j >= 0;){
							var attr = elData.el.attributes[j];
							elData.el.removeAttribute(attr.name);
						}

						//--set new attr
						foo.forEach(function(elIData){
							for(var attr in elIData.attr || []){
								elData.el.setAttribute(attr, elIData.attr[attr]);
							}
						});
					break;
					case 'content':
						var _content = '';
						foo.forEach(function(elIData){
							_content += elIData.content || '';
						});
						_self.replaceElContent(elData.el || elData.select, _content);
					break;
					case 'replace':
						if(elData.select && elData.el){
							var oldEls = _self.container.querySelectorAll(elData.select);

							//--add new to document first so there won't be layout thrashing from removing stylesheets, etc
							for(var j in foo){
								var newEl = SPAify.createElement(foo[j].content);
								elData.el[elData.method || 'append'](newEl);
							}

							//--remove existing elements
							if(oldEls){
								for(var j = 0; j < oldEls.length; ++j){
									oldEls[j].remove();
								}
							}
						}
					break;
				}
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
				var contentType = response.headers.get('content-type');
				if(!contentType || !contentType.match(/^(text\/html|application\/xhtml\+xml)/)){
					throw 1;
				}
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
				console.error('catch', arguments);
				_self.handleLoadError(href, fetchOpts, el);
			});
		},
		replaceElContent: function(el, content){
			if(typeof el === 'string'){
				el = this.container.querySelector(el)
			}
			if(el){
				el.innerHTML = content;
				return true;
			}else{
				return false;
			}
		},

	},
	statics: {
		createElement: function(string){
			var template = document.createElement('template');
			template.innerHTML = string.trim();
			return template.content.firstChild;
		},
		getDocEl: function(select, inEl){
			return SPAify.getDocEls(select, inEl)[0] || null;
		},
		getDocEls: function(select, inEl){
			if(select === 'html' && inEl.nodeName === 'HTML'){
				return [inEl];
			}else{
				return inEl.querySelectorAll(select);
			}
		}
	},
});

export default SPAify;
