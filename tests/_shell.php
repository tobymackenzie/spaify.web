<!doctype html>
<html data-spaify="1" id="p-<?=$this->get('id')?>" lang="en" data-rand="<?=$this->get('rand')?>">
	<head>
		<meta charset="utf-8" />
		<title><?=($this->has('title') ? $this->get('title') . ' - ' : '')?>SPAify tests</title>
		<meta name="x-rand" content="<?=$this->get('rand')?>" />
		<link rel="stylesheet" href="/_styles.css" />
	</head>
	<body>
		<main><?=$this->get('main')?></main>
		<footer>&lt;toby&gt; SPAify project</footer>
		<script src="/_scripts<?=file_exists(__DIR__ . '/_scripts.min.js') ? '.min' : ''?>.js" type="module"></script>
	</body>
</html>
