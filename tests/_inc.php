<?php
namespace TJM\SPAify\Test;
class TestShell{
	protected $activeRegions = [];
	protected $id;
	protected $main = '';
	protected $rand;
	protected $title = '';

	public function __construct($data = []){
		foreach($data as $key=> $value){
			$this->$key = $value;
		}
		if(empty($this->id)){
			$this->id = $_SERVER['REQUEST_URI'];
		}
		if(empty($this->rand)){
			$this->rand = rand(0, 100);
		}
	}
	public function __toString(){
		while($this->activeRegions){
			$this->end();
		}
		ob_start();
		include(__DIR__ . '/_shell.php');
		$return = ob_get_contents();
		ob_end_clean();
		return $return;
	}

	/*==regions */
	public function end(){
		$name = array_pop($this->activeRegions);
		$this->$name = ob_get_contents();
		ob_end_clean();
	}
	public function get($name){
		return $this->$name ?? '';
	}
	public function has($name){
		return empty($this->$name) ? false : true;
	}
	public function set($name, $value = null){
		if($value){
			$this->$name = $value;
		}else{
			ob_start();
			$this->activeRegions[] = $name;
		}
	}

	/*==helpers */
	public function e($thing){
		if(is_array($thing)){
			if(count($thing) === 0){
				return '[]';
			}elseif(!count(array_filter(array_keys($thing), 'is_string'))){
				return '[' . $this->e(implode(', ', $thing)) . ']';
			}else{
				$return = '<dl>';
				foreach($thing as $key=> $value){
					$return .= '<dt>' . $this->e($key) . '</dt><dd>' . $this->e($value) . '</dd>';
				}
				$return .= '</dl>';
				return $return;
			}
		}elseif(is_object($thing)){
			return $this->e(json_encode($thing));
		}else{
			return htmlspecialchars($thing);
		}
	}
}
$ts = new TestShell();
