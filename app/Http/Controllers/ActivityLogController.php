<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Activity::class);

        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100]) ? (int) $perPage : 10;

        $activityLogs = QueryBuilder::for(Activity::class)
            ->allowedFilters([
                AllowedFilter::exact('event'),
                AllowedFilter::exact('subject_type'),
                AllowedFilter::exact('causer_id', 'causer.id'),
                AllowedFilter::callback('search', function ($query, $value) {
                    return $query->where('description', 'like', "%{$value}%")
                        ->orWhere('subject_type', 'like', "%{$value}%");
                }),
            ])
            ->allowedSorts(['created_at', 'event', 'subject_type'])
            ->allowedIncludes(['causer', 'subject'])
            ->defaultSort('-created_at')
            ->with(['causer', 'subject'])
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('activity-logs/index', [
            'activityLogs' => $activityLogs,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activityLog): Response
    {
        Gate::authorize('view', $activityLog);

        $activityLog->load(['causer', 'subject']);

        return Inertia::render('activity-logs/show', [
            'activityLog' => $activityLog,
        ]);
    }
}
