<?php
namespace TJM\SPAify\Test;
class HTTP{
	static protected $mimeTypes = [
		'css'=> 'text/css',
		'html'=> 'text/html',
		'js'=> 'application/javascript',
		'mjs'=> 'application/javascript',
		'txt'=> 'text/plain',
	];
	protected $shell;
	public function __construct(TestShell $shell = null){
		if(!$shell){
			$shell = new TestShell();
		}
		$this->shell = $shell;
	}
	protected function getMimeType($string){
		if(strpos($string, '.') !== false){
			$extension = pathinfo($string, PATHINFO_EXTENSION);
		}elseif(strpos($string, '/') !== false){
			$extension = '';
		}else{
			$extension = $string;
		}
		return static::$mimeTypes[$extension] ?? null;
	}
	public function handleRequest(){
		$path = explode('?', $_SERVER['REQUEST_URI'])[0];
		$fullPath = realpath(__DIR__ . $path);
		$projectPath = realpath(__DIR__ . '/..');
		if($fullPath && file_exists($fullPath) && substr($fullPath, 0, strlen($projectPath)) === $projectPath){
			if(is_dir($fullPath)){
				if(substr($fullPath, -1) !== '/'){
					$fullPath .= '/';
				}
				$fullPath .= 'index.php';
				if(file_exists($fullPath)){
					$this->sendPage($fullPath);
				}
			}else{
				$this->sendFile($fullPath);
			}
		}
		$this->send404();
	}
	protected function send404(){
		http_response_code(404);
		$this->shell->set('title', '404 Not Found');
		$this->shell->set('main', '<h1>404 Not Found</h1><p>Apologies. Could not find what you asked for.</p>');
		$this->shell->end('main');
		echo $this->shell;
		die();
	}
	protected function sendFile($path){
		$mimeType = $this->getMimeType($path);
		if($mimeType){
			header("Content-Type: {$mimeType}");
			echo file_get_contents($path);
		}else{
			$this->send404();
		}
		die();
	}
	protected function sendPage($path){
		$ts = $this->shell;
		include($path);
		die();
	}
}
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
