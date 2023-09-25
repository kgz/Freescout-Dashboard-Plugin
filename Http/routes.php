<?php

Route::group( [ 'middleware' => 'web', 'prefix' => \App\Misc\Helper::getSubdirectory(), 'namespace' => 'Modules\ReportsModule\Http\Controllers' ], function () {

	Route::get( '/responses', [ 'uses' => 'ReportsModuleController@index' ] )->name( 'responses.index' );
	Route::get( '/responses/api/last_responded', [ 'uses' => 'ReportsModuleController@last_responded' ] )->name( 'routes.external' );
	Route::get( '/responses/api/response_times', [ 'uses' => 'ReportsModuleController@response_times' ] )->name( 'routes.external' );
	Route::get( '/responses/api/response_times1', [ 'uses' => 'ReportsModuleController@response_times1' ] )->name( 'routes.external' );
	Route::get( '/responses/api/outstanding_resposes', [ 'uses' => 'ReportsModuleController@outstanding_resposes' ] )->name( 'routes.external' );
	Route::get( '/responses/api/customers', [ 'uses' => 'ReportsModuleController@getcustomers' ] )->name( 'routes.external' );
	Route::get( '/responses/api/closed_responses', [ 'uses' => 'ReportsModuleController@closed_responses' ] )->name( 'routes.external' );

	Route::post( '/responses/api/create_dashboard', [ 'uses' => 'ReportsModuleController@create_dashboard' ] )->name( 'routes.external' );
	// Route::GET( '/responses/api/dashboards', [ 'uses' => 'ReportsModuleController@get_dashboards' ] )->name( 'routes.external' );
	Route::GET( '/responses/api/dashboards/{id?}', [ 'uses' => 'ReportsModuleController@get_dashboards' ] )->name( 'routes.external' );
	Route::PUT( '/responses/api/dashboards/{id}/update', [ 'uses' => 'ReportsModuleController@updateDashboard' ] )->name( 'routes.external' );
	Route::fallback( [ 'uses' => 'ReportsModuleController@index' ] )->name( 'responses.index' );
} );
