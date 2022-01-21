<?php

namespace Components\process.env.GROUP_ID\process.env.COMPONENT_NAME;

use App\Utilities\ExtendedComponent;

class process.env.UUID extends ExtendedComponent
{
    protected string $uuid = "process.env.UUID";
    protected string $group_id = "process.env.GROUP_ID";
    protected string $name = "process.env.COMPONENT_NAME";
    protected string $description = "process.env.COMPONENT_DESCRIPTION";
    protected array $variables = [];
    protected array $input_types = [];
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view("$this->group_id.$this->name.$this->uuid");
    }
}