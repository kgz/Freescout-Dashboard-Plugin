<?php 
/**
 * Endpoint handler defines funtions for each endpoint of the myob api.
 * 
 * Unauthorized copying or manipulation of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 
 * @copyright 2012-2016 Datanova (datanova.com.au) - All Rights Reserved
 * @category application
 * @package globe
 * @author Mat Frayne
 */

namespace App\Myob;

use App\Accounting\Export\RemoteIDCache;

use function System\abort;

// Block direct file access
defined('App\\ENV') or die('Direct Access to this location is not allowed.');

if (!isset($_POST['state'])) abort(400, 'Missing required parameter: state');

$state = $_POST['state'];
// set as session
$_SESSION['myob_state'] = $state;

