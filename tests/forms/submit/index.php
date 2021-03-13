<?php
require_once(__DIR__ . '/../../_inc.php');
$method = strtoupper($_SERVER['REQUEST_METHOD']);
if($method === 'GET'){
	$values = &$_GET;
}else{
	$values = &$_POST;
}
if(!empty($values['error'])){
	http_response_code(500);
	if($values['error'] === 'spa'){
		$ts->set('title', 'Form Submit');
		$ts->set('main', '<p>There was an unknown error processing the form.</p>');
		echo $ts;
	}else{
		echo '<!doctype html><meta charset="utf-8" /><title>Form Error</title><h1>Form Error</h1><p>Non-SPA form error</p>';
	}
	return;
}
$ts->set('title', 'Form Submit');
$ts->set('main');
?>
<h1><?=$ts->get('title')?></h1>
<dl>
	<dt>Method</dt>
	<dd><?=$ts->e($method)?></dd>
	<dt><?=$method?></dt>
	<dd><?=$ts->e($values)?></dd>
<?php if($_FILES){ ?>
	<dt>Files</dt>
	<dd><?=$ts->e($_FILES)?></dd>
<?php } ?>
<dl>
<?php
$ts->end('main');
echo $ts;
