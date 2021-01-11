<?php

namespace OptimistDigital\NovaResizable;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

class ToolServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Nova::serving(function (ServingNova $event) {
            Nova::script('nova-resizable', __DIR__ . '/../dist/resizable.js');
            Nova::style('nova-resizable-css', __DIR__ . '/../dist/styles.css');
        });
    }
}
