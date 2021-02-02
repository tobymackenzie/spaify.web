<?php
http_response_code(500);
require_once(__DIR__ . '/../_inc.php');
$ts->set('title', '500 error');
$ts->set('main');
?>
<h1>500 Error</h1>
<p>This is a test 500 error.</p>
<?php
$ts->end('main');
echo $ts;
