<?php
namespace Src\process.env.COMPONENT_NAME;

use Jenssegers\Blade\Blade;

class process.env.COMPONENT_NAME
{
	public function index()
	{
		$blade = new Blade([__DIR__.'/../../src', __DIR__.'/../../sample'], __DIR__.'/../../cache');

		echo $blade->make('index', ['greetings' => 'Hello World!'])->render();
	}
}