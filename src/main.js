import cutsMustard from './cutsMustard.js';
import SPAify from './SPAify.js';

var spaify = undefined;
if(cutsMustard){
	spaify = new SPAify({targets: [
		{select:
			'head [data-aria="page"],'
			+ 'link:not([name="viewport"]),'
			+ 'meta:not([charset]),'
			+ 'script[data-aria="page"],'
			+ 'style',
			do: 'replace', method: 'append', target: 'head'
		},
		{select: 'html', do: 'attr'},
		'main',
		'title',
		'body > aside',
	]});
}

export default spaify;
