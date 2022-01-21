<?php

namespace Components\process.env.GROUP_ID\process.env.COMPONENT_NAME;

use App\Utilities\ExtendedComponent;

class process.env.UUID extends ExtendedComponent
{
    protected string $uuid = "process.env.UUID";
    protected string $group_id = "process.env.GROUP_ID";
    protected string $name = "process.env.COMPONENT_NAME";
    protected string $description = "process.env.COMPONENT_DESCRIPTION";
    // variables used in pug template
    protected array $variables = [
        
    ];
    // define which type of input each variable uses
    // AVAILABLE TYPES
    // ckeditor: for writing articles, large content
    // checkbox: for toggling on/off
    // input: for writing name, title, small content
    // media-input: for inserting images/iframes
    // multi-media-input: for inserting multiple images/iframes
    // select: for selecting content from a dropdown list
    // sortable: for a draggable sorting input
    // tag-input: for selecting multiple tags
    // textarea: for writing notes
    protected array $input_types = [
        
    ];
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