<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Controller;
use Closure;

class UTFSerializerMIddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        return Controller::jsonUtf($response->original);
    }
}
