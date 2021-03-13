<?php
use TJM\SPAify\Test\HTTP;
require_once(__DIR__ . '/_inc.php');
(new HTTP($ts))->handleRequest();
