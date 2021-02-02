<?php
require_once(__DIR__ . '/../_inc.php');
$method = !empty($_GET['method']) ? $ts->e(strtoupper($_GET['method'])) : 'POST';
$ts->set('title', $method . ' Form');
$ts->set('main');
?>
<h1><?=$ts->get('title')?></h1>
<form action="/forms/submit" method="<?=$method?>">
	<p>Test form submission.</p>
	<div class="field">
		<label>
			<span>First Name</span>
			<input name="first-name" />
		</label>
	</div>
	<div class="field">
		<label>
			<span>Last Name</span>
			<input name="last-name" />
		</label>
	</div>
	<div class="field">
		<label>
			<input name="robot" type="checkbox" />
			<span>Are you a robot?</span>
		</label>
	</div>
	<fieldset class="field">
		<legend>I prefer</legend>
<?php foreach(['One', 'Two', 'Three'] as $value){ ?>
		<label>
			<input name="prefers" type="radio" value="<?=$value?>" />
			<span><?=$value?></span>
		</label>
<?php } ?>
	</fieldset>
	<fieldset class="field">
		<legend>I like</legend>
<?php foreach(['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Black', 'White'] as $value){ ?>
		<label>
			<input name="likes[]" type="checkbox" value="<?=$value?>" />
			<span><?=$value?></span>
		</label>
<?php } ?>
	</fieldset>
	<div class="field">
		<label>
			<input name="error" type="checkbox" />
			<span>Test error</span>
		</label>
	</div>
	<button type="submit">Submit</button>
</form>
<?php
$ts->end('main');
echo $ts;
