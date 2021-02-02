<?php
require_once(__DIR__ . '/../../_inc.php');
$method = strtoupper($_SERVER['REQUEST_METHOD']);
if(!empty(${'_' . $method}['error'])){
	http_response_code(500);
	$ts->set('title', 'Form Submit');
	$ts->set('main', '<p>There was an unknown error processing the form.</p>');
	echo $ts;
	return;
}
$ts->set('title', 'Form Submit');
$ts->set('main');
?>
<h1><?=$ts->get('title')?></h1>
<dl>
	<dt>Method</dt>
	<dd><?=$ts->e($method)?></dd>
<?php
foreach(['GET', 'POST', 'FILES'] as $name){
	$values = ${'_' . $name};
	if($values){
?>
	<dt><?=$name?></dt>
	<dd><?=$ts->e($values)?></dd>
<?php
	}
}
?>
<dl>
<?php
$ts->end('main');
echo $ts;
