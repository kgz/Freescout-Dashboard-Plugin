<?php

namespace Modules\ReportsModule\Providers;

use Config;
use Eventy;
use Helper;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View as ViewView;
use Module;
use Modules\ReportsModule\Console\SyncICS;
use Modules\ReportsModule\Entities\Calendar;
use Modules\ReportsModule\Entities\CalendarItem;
use Modules\ReportsModule\External\ICal\ICal;
use View;

class ReportsModuleServiceProvider extends ServiceProvider {
	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Boot the application events.
	 *
	 * @return void
	 */
	public function boot() {
		$this->registerConfig();
		$this->registerViews();
		// $this->registerCommands();
		$this->loadMigrationsFrom( __DIR__ . '/../Database/Migrations' );
		$this->hooks();
		$this->loadViewsFrom(__DIR__.'/../Resources/views', 'ReportsModule');

		// \Eventy::addAction('conversation.after_prev_convs', function($customer, $conversation, $mailbox) {


        //     echo \View::make('ReportsModule::partials/sidebar')->render();
        // }, -1, 3);

	}

	/**
	 * Register config.
	 *
	 * @return void
	 */
	protected function registerConfig() {
		$this->publishes( [
			__DIR__ . '/../Config/config.php' => config_path( 'ReportsModule.php' ),
		], 'config' );
		$this->mergeConfigFrom(
			__DIR__ . '/../Config/config.php', 'ReportsModule'
		);
	}

	/**
	 * Register views.
	 *
	 * @return void
	 */
	public function registerViews() {
		$viewPath = resource_path( 'views/modules/ReportsModule' );

		$sourcePath = __DIR__ . '/../Resources/views';

		$this->publishes( [
			$sourcePath => $viewPath,
		], 'views' );

		$this->loadViewsFrom( array_merge( array_map( function ( $path ) {
			return $path . '/modules/ReportsModule';
		}, Config::get( 'view.paths' ) ), [ $sourcePath ] ), 'Responses' );
	}


	/**
	 * Module hooks.
	 */
	public function hooks() {
		Eventy::addAction( 'menu.append', function ( $mailbox ) {
			echo View::make( 'ReportsModule::partials/menu', [] )->render();
			// add menu item
			
		} );

		Eventy::addFilter( 'menu.selected', function ( $menu ) {
			// if ( auth()->user() && auth()->user()->isAdmin() ) {
				$menu['calendar'] = [
					'Responses.index',
				];
			// }

			return $menu;
		} );

		$this->registerSettings();
	}

	private function registerSettings() {
		// Add item to settings sections.
		// Eventy::addFilter( 'settings.sections', function ( $sections ) {
		// 	$sections['calendar'] = [ 'title' => __( 'Call Logs' ), 'icon' => 'phone', 'order' => 200 ];

		// 	return $sections;
		// }, 15 );

	
	
	}

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register() {
		$this->registerTranslations();
	}

	/**
	 * Register translations.
	 *
	 * @return void
	 */
	public function registerTranslations() {
		$this->loadJsonTranslationsFrom( __DIR__ . '/../Resources/lang' );
	}

	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides() {
		return [];
	}


}