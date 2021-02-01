<?php
require_once(__DIR__ . '/../../_inc.php');
$ts->set('title', 'Form Submit');
$ts->set('main');
?>
<h1><?=$ts->get('title')?></h1>
<dl>
	<dt>Method</dt>
	<dd><?=$ts->e($_SERVER['REQUEST_METHOD'])?></dd>
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
