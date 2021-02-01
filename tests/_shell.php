<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title><?=($this->has('title') ? $this->get('title') . ' - ' : '')?>SPAify tests</title>
		<link rel="stylesheet" href="/_styles.css" />
	</head>
	<body>
		<main><?=$this->get('main')?></main>
		<footer>&lt;toby&gt; SPAify project</footer>
		<script src="/_scripts.js" type="module"></script>
	</body>
</html>