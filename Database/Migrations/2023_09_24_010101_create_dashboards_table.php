<?php

use App\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDashboardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // We preserve "channel" and "channel_id" fields in "customers" table.
        // They allow to figure out that there is a record in customer_channel table.
        Schema::create('dashboards', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->jsonb('elements');
            $table->boolean('enabled');
            $table->boolean('deleted');
            $table->dateTime('created_at');
            $table->dateTime('updated_at')->nullable();
            $table->dateTime('deleted_at')->nullable();
            $table->unsignedInteger('created_by');
            $table->unsignedInteger('updated_by')->nullable();
            $table->unsignedInteger('deleted_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dashboards');
    }
}
