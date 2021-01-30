<?php
require_once(__DIR__ . '/../_inc.php');
$ts->set('title', 'Internal 2');
$ts->set('main');
?>
<h1><?=$ts->get('title')?></h1>
<p>Hello there from internal 2</p>
<?php
$ts->end('main');
echo $ts;
