<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        if (! $request->user()->hasPermission($permission)) {
            if ($request->inertia()) {
                return Inertia::location(route('unauthorized'));
            }

            return redirect('/unauthorized');
        }

        return $next($request);
    }
}
