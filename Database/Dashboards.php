<?php
namespace Modules\ReportsModule\Database;

use Watson\Rememberable\Rememberable;
use Illuminate\Database\Eloquent\Model;

class Dashboards extends Model
{
    // use Rememberable;

    protected $table = 'dashboards';
    // $table->increments('id');
    // $table->jsonb('elements');
    // $table->boolean('enabled');
    // $table->boolean('deleted');
    // $table->dateTime('created_at');
    // $table->dateTime('updated_at');
    // $table->dateTime('deleted_at');
    // $table->unsignedInteger('created_by');
    // $table->unsignedInteger('updated_by');
    // $table->unsignedInteger('deleted_by');
    protected $fillable = [
        'name',
        'elements',
        'enabled',
        'deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $rememberCacheTag = 'dashboards_query';


    protected $rememberFor = 5;

}