<?php

namespace Modules\ReportsModule\Http\Controllers;

use App\Conversation;
use App\Customer;
use App\SendLog;
use Carbon\Carbon;
use App\Thread;
use App\User;
use DateTime;
use DateTimeZone;
use Illuminate\Contracts\View\Factory;
use Illuminate\Foundation\Application;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Request;
use Illuminate\View\View;
use Modules\FlowJiraModule\Entities\Calls;
use Modules\FlowJiraModule\Entities\Settings;
use Modules\ReportsModule\Database\Dashboards;

class ReportsModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Factory|Application|View
     */

    public function index()
    {

        $conversations = Conversation::where('status', '!=', Conversation::STATUS_SPAM)->get();
        // only return time since last reply
        $conversations = array_map(function ($conv) {

            return [
                $conv['last_reply_at']
            ];
        }, $conversations->toArray());
        return view('ReportsModule::index', [
            'conversations' => json_encode($conversations),
        ]);
    }

    public function last_responded()
    {

        $conversations = Conversation::join('users', 'users.id', '=', 'conversations.user_id')
            ->where('conversations.status', '!=', Conversation::STATUS_SPAM)
            ->where('conversations.state', '!=', 3)
            ->get();
        // ->where('conversations.status', '!=', Conversation::STATUS_SPAM);


        // only return time since last reply
        $conversations = array_map(function ($conv) {

            return [
                $conv['last_reply_at'],
                $conv['first_name'] . ' ' . $conv['last_name'],
            ];
        }, $conversations->toArray());

        return Response::json($conversations);
    }

    public function response_times()
    {
        $filters = (object)json_decode($_GET['filters'] ?? '{}');

        $filters->start = (int)($_GET['start'] ?? 0);
        $filters->end = (int)($_GET['end'] ?? 0);

        if (!isset($filters->start)) {
            $filters->start = Carbon::now()->subYear(1)->timestamp * 1000;
        }
        if (!isset($filters->end)) {
            $filters->end = Carbon::now()->timestamp * 1000;
        }

        $start = Carbon::createFromTimestamp(round(((int)$filters->start), 0))->timestamp;
        $end = Carbon::createFromTimestamp(round(((int)$filters->end), 0))->timestamp;

        /** @var \Illuminate\Database\Eloquent\Model $thread */
        $thread = new Thread();

        if (isset($_GET['getPages'])) {
            $total =  $thread
                ->selectRaw('count(*) as c')
                ->join('conversations', 'conversations.id', '=', 'threads.conversation_id')
                ->join('users', 'users.id', '=', 'conversations.user_id')
                ->join('customers', 'customers.id', '=', 'conversations.customer_id')
                ->where('threads.created_at', '>=', Carbon::createFromTimestamp($start)->toDateTimeString())
                ->where('threads.created_at', '<=', Carbon::createFromTimestamp($end)->toDateTimeString())
                ->get();

            // build a list of all pages
            $total = (int) $total->first()->c;
            $total_pages = ceil($total / 2000);

            return Response::json([
                'total_pages' => $total_pages,
            ]);
        }

        $messages = $thread->join('conversations', 'conversations.id', '=', 'threads.conversation_id')
            ->join('users', 'users.id', '=', 'conversations.user_id')
            ->join('customers', 'customers.id', '=', 'conversations.customer_id')
            ->select(
                '*',
                'threads.type as ttype',
                'threads.created_at as tcreated_at',
                'threads.conversation_id as conversation_id',
                'customers.first_name as customer_first_name',
                'customers.last_name as customer_last_name',
                'customers.id as customer_id',
                'users.first_name as user_first_name',
                'users.last_name as user_last_name',
            )
            ->where('threads.created_at', '>=', Carbon::createFromTimestamp($start)->toDateTimeString())
            ->where('threads.created_at', '<=', Carbon::createFromTimestamp($end)->toDateTimeString())
            ->limit(2000);

        if (isset($_GET['page'])) {
            $page = (int)$_GET['page'] - 1;
            $messages = $messages->offset($page * 2000);
        }

        // where threadid = 20
        // ->where('threads.conversation_id', '=', 21)
        // ->get();

        // var_dump($_GET);
        if (isset($filters->customer_ids) && count($filters->customer_ids) > 0) {
            $customer_ids = $filters->customer_ids;

            $messages = $messages->whereIn('customers.id', $customer_ids);
        }
        $messages = $messages->groupBy('threads.id');
        $messages = $messages->get();


        // ->orderBy('conversations.created_at', 'asc')

        // group by conversation id "id" => [array of messages]
        // foreach conversation id
        $nmessages = [];
        foreach ($messages as $message) {
            $type = $message->ttype;
            $nmessages[$message->conversation_id][$type][] = $message;
        }

        // foreach conversation id -> type find the closest message created_at in type 2 or null if none
        foreach ($nmessages as $conversation_id => $conversation) {
            // make sure there are keys 1 and 2
            if (!array_key_exists(1, $conversation) || !array_key_exists(2, $conversation)) {
                continue;
            }
            $messages = $conversation[1];
            $staff_messages = $conversation[2];

            foreach ($messages as &$message) {
                $create_dt = Carbon::parse($message->tcreated_at);
                $closest = null;
                $closest_diff = null;
                foreach ($staff_messages as $staff_message) {
                    $screate_dt = Carbon::parse($staff_message->tcreated_at);
                    // if created at is greater than message created at then skip
                    if ($create_dt->gt($screate_dt)) {
                        continue;
                    }
                    $diff = $create_dt->diffInMinutes($screate_dt);
                    if ($closest_diff === null || $diff < $closest_diff) {
                        $closest_diff = $diff;
                        $closest = $staff_message;
                    }
                }
                if ($closest === null) {
                    // no closest
                    continue;
                }
                $message->response_at = $closest->tcreated_at;
                $message->responder = $closest->user_first_name . ' ' . $closest->user_last_name;
                $message->closest = $closest;
                $message->closest_diff = $closest_diff;
                // diff in hours
                $message->closest_diff_hours = $closest_diff / 60;
            }
        }

        $out = [];
        // return only thread id, thread_conversation id type = 1, responder and response_at
        foreach ($nmessages as $conversation_id => $conversation) {
            if (!array_key_exists(1, $conversation)) {
                continue;
            }
            $messages = $conversation[1];
            foreach ($messages as $message) {
                if (!isset($message->response_at)) {
                    continue;
                }
                $created_at = Carbon::parse($message->tcreated_at);
                $response_at = Carbon::parse($message->response_at);



                $out[] = (object)[
                    'type' => 'Business Hours',
                    'calculated_duration' => $this->calculate_duration($created_at, $response_at),
                    'conversation_created_at_timestamp' => ((int)$created_at->timestamp) * 1000,
                    'responder' => $message->responder,
                    'response_at' => ((int)$response_at->timestamp) * 1000,
                    'conversation_id' => $message->conversation_id,
                    // adddebug starta nd end
                    'start' => $created_at->toDateTimeString(),
                    'end' => $response_at->toDateTimeString(),
                    'customer_id' => $message->customer_id,
                    'customer_first_name' => $message->customer_first_name,
                    'customer_last_name' => $message->customer_last_name,

                ];

                $out[] = (object)[
                    'type' => 'Normal',
                    'calculated_duration' => $created_at->diffInMinutes($response_at) / 60,
                    'conversation_created_at_timestamp' => ((int)$created_at->timestamp) * 1000,
                    'responder' => $message->responder,
                    'response_at' => ((int)$response_at->timestamp) * 1000,
                    'conversation_id' => $message->conversation_id,
                    'start' => $created_at->toDateTimeString(),
                    'end' => $response_at->toDateTimeString(),
                    'customer_id' => $message->customer_id,
                    'customer_first_name' => $message->customer_first_name,
                    'customer_last_name' => $message->customer_last_name,
                ];
            }
            unset($conversation);
        }
        $ret = [
            'data' => $out,
            'page' => 1,
            'per_page' => 2000,
        ];
        // return Response::json($nmessages);
        return Response::json($ret);
    }

    public function outstanding_resposes()
    {

        $filters = (object)json_decode($_GET['filters'] ?? '{}');

        $filters->end = ($_GET['end'] ?: Carbon::now()->timestamp);

        $end = Carbon::createFromTimestamp(round(((int)$filters->end), 0));

        /** @var \Illuminate\Database\Eloquent\Model $thread */
        $thread = new Thread();

        if (isset($_GET['getPages'])) {

            $total = $thread->selectRaw('count(DISTINCT `threads`.conversation_id) as c')
                ->join('conversations', 'conversations.id', '=', 'threads.conversation_id')
                ->join('customers', 'customers.id', '=', 'conversations.customer_id')
                ->where('conversations.status', '!=', Conversation::STATUS_SPAM)
                ->where('conversations.state', '!=', 3)
                ->whereRaw('(`threads`.status < 3 AND `threads`.status = `conversations`.`status`)')
                ->where('threads.created_at', '<=', $end->toDateTimeString())
                ->get();

            // build a list of all pages
            $total = (int) $total->first()->c;
            $total_pages = ceil($total / 2000);

            return Response::json([
                'total_pages' => $total_pages,
            ]);
        }
     
        // get threads, group by conversation id, get last reply, if ttpe = 1 customer is waiting, if type = 2 agent is waiting
        $threads = Thread::join('conversations', 'conversations.id', '=', 'threads.conversation_id')
            ->join('customers', 'customers.id', '=', 'conversations.customer_id')
            ->join('users', 'users.id', '=', 'conversations.user_id')
            ->distinct('threads.conversation_id')
            ->select(
                'conversations.id as conversation_id',
                'conversations.created_at',
                'conversations.customer_id',
                'customers.company',
                'customers.first_name as customer_first_name',
                'customers.last_name as customer_last_name',
                'users.first_name',
                'users.last_name',
                'users.id as user_id',
                'conversations.last_reply_at',
                'conversations.status',
                'threads.created_at as tcreated_at',
                'threads.type',
            )
            ->where('conversations.status', '!=', Conversation::STATUS_SPAM)
            ->where('conversations.state', '!=', 3)
            ->whereRaw('(`threads`.status < 3 AND `threads`.status = `conversations`.`status`)')
            ->where('threads.created_at', '<=',  $end->toDateTimeString())
            ->groupBy('threads.conversation_id')
            // limit to one of lates
            ->orderBy('threads.created_at', 'desc')
            ->limit(2000);

            if (isset($_GET['page'])) {
                $page = (int)$_GET['page'] -1;
                $threads = $threads->offset($page * 2000);
            }
        $threads = $threads->get();
        // calculate wait time for each conversation based on last_reply
        foreach ($threads as $conversation) {
            $conversation->wait_time = $conversation->created_at->diffInHours(Carbon::now());
        }
        return Response::json($threads);
    }

    public function closed_responses()
    {
        // get threads, group by conversation id, get last reply, if ttpe = 1 customer is waiting, if type = 2 agent is waiting
        $threads = Thread::join('conversations', 'conversations.id', '=', 'threads.conversation_id')
            ->leftJoin('customers', 'customers.id', '=', 'conversations.customer_id')
            ->leftJoin('users', 'users.id', '=', 'conversations.user_id')
            ->rightJoin('users AS closed_user', 'closed_user.id', '=', 'conversations.closed_by_user_id')
            ->distinct('threads.conversation_id')
            ->select(
                'conversations.id as conversation_id',
                'conversations.created_at',
                'conversations.closed_at',
                'conversations.customer_id',
                'customers.company',
                'customers.first_name as customer_first_name',
                'customers.last_name as customer_last_name',
                'users.first_name',
                'users.last_name',
                'users.id as user_id',
                'conversations.last_reply_at',
                'conversations.status',
                'threads.created_at as tcreated_at',
                'threads.type',
                'closed_user.first_name as closed_user_first_name',
                'closed_user.last_name as closed_user_last_name',
            )
            // ->where('conversations.status', '!=', Conversation::STATUS_SPAM)
            // ->where('conversations.state', '!=', 3)
            // ->whereRaw('(`threads`.status < 3 AND `threads`.status = `conversations`.`status`)')
            // ->where('conversations.closed_at', '<=',  $end->toDateTimeString())
            ->groupBy('threads.conversation_id')
            // limit to one of lates
            ->orderBy('conversations.closed_at', 'desc')
            // only get first 10
            ->limit(10);

        $threads = $threads->get();
        foreach ($threads as $conversation) {
            $conversation->wait_time = $conversation->created_at->diffInHours($conversation->closed_at);
        }
        return Response::json($threads);
    }
    public function create_dashboard()
    {
        $data = \json_decode(file_get_contents('php://input'));
        if (!isset($data->name)) {
            return Response::json([
                'error' => 'name is required',
            ], 400);
        }

        $dashboard = new Dashboards();
        $dashboard->create([
            'name' => $data->name,
            'elements' => json_encode($data->elements ?? []),
            'enabled' => true,
            'deleted' => false,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'deleted_at' => null,
            'created_by' => Auth::user()->id,
            'updated_by' => Auth::user()->id,
            'deleted_by' => null,
        ]);
        return Response::json($data);
    }

    public function get_dashboards()
    {

        // get param id 
        $id = Request::route('id');
        if ($id) {
            $dashboards = Dashboards::where('id', '=', $id)->get();
            if (!$dashboards) {
                return Response::json([
                    'error' => 'dashboard not found',
                ], 404);
            }

            return Response::json($dashboards[0]);
        }
        $dashboards = Dashboards::all();
        return Response::json($dashboards);
    }

    public function updateDashboard()
    {
        $data = \json_decode(file_get_contents('php://input'));
        $id = Request::route('id');

        if (!$id) {
            return Response::json([
                'error' => 'id is required',
            ], 400);
        }

        if(isset($data->image)){
            // save to public folder
            $image = $data->image;
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'dashboard_' . $id . '.png';
            \File::put(public_path() . '/img/' . $imageName, base64_decode($image));
            return Response::json([
                'image' => $imageName,
            ]);
        }

        $toUpdate = [];
        if (isset($data->name)) {
            $toUpdate['name'] = $data->name;
        }

        if (isset($data->elements)) {
            $toUpdate['elements'] = json_encode($data->elements);
        }

        if (isset($data->enabled)) {
            $toUpdate['enabled'] = $data->enabled;
        }

        if (isset($data->deleted)) {
            $toUpdate['deleted'] = $data->deleted;
        }

        $dashboard = Dashboards::where('id', '=', $id)->first();
        if (!$dashboard) {
            return Response::json([
                'error' => 'dashboard not found',
            ], 404);
        }

        if(empty($toUpdate)){
            return Response::json([
                'error' => 'no fields to update',
            ], 400);
        }

        $dashboard->update($toUpdate);

        return Response::json($data);
    }

    public function getCustomers()
    {
        $customers = Customer::all();
        return Response::json($customers);
    }


    static function calculate_duration(Carbon $start, Carbon $end): float
    {
        if ($start->greaterThan($end)) {
            $temp = $start;
            $start = $end;
            $end = $temp;
        }

        $duration = 0;
        $day = $start->copy()->startOfDay();
        while ($day->lessThanOrEqualTo($end)) {
            if ($day->isWeekday()) {
                $day_start = $day->copy()->setTime(8, 0, 0);
                $day_end = $day->copy()->setTime(17, 0, 0);
                $day_start = max($start, $day_start);
                $day_end = min($end, $day_end);
                if ($day_start->lessThanOrEqualTo($day_end)) {
                    $duration += $day_start->diffInMinutes($day_end);
                }
            }
            $day = $day->addDay();
        }

        return $duration / 60.0;
    }

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerConfig();
        $this->registerViews();
        // $this->registerCommands();
        $this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
        $this->hooks();
        // $this->loadViewsFrom(__DIR__ . '/../Resources/views', 'FlowJiraModule');

        // \Eventy::addAction('conversation.after_prev_convs', function ($customer, $conversation, $mailbox) {


        // 	echo \View::make('FlowJiraModule::partials/sidebar')->render();
        // }, -1, 3);
    }



    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__ . '/../Config/config.php' => config_path('reportsmodule.php'),
        ], 'config');
        $this->mergeConfigFrom(
            __DIR__ . '/../Config/config.php',
            'reportsmodule'
        );
    }
}
