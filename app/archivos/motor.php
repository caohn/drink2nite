<?PHP
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}

if (!isset ( $do ) AND isset ($_REQUEST['do']) ) $do = totranslit ( $_REQUEST['do'] ); elseif(isset ( $do )) $do = totranslit ( $do ); else $do = "";
if (!isset ( $subaction ) AND isset ($_REQUEST['subaction']) ) $subaction = $_REQUEST['subaction'];
if ( isset ($_REQUEST['doaction']) ) $doaction = $_REQUEST['doaction']; else $doaction = "";

$dle_module = $do;
$dle_module = $dle_module ? $dle_module : "principal";

if ($cstart < 0) $cstart = 0;
$CN_HALT = FALSE;

$active = FALSE;
$newsmodule = FALSE;

switch ( $do ) {
		
	case "accion" :
		include ENGINE_DIR . '/modules/accion.php';
		break;
		
	case "drink" :
		include ENGINE_DIR . '/modules/drink.php';
		break;
	
	default :
		
	$is_main = 0;
	$active = false;
	$user_query = "";
	$_SESSION['referrer'] = $_SERVER['REQUEST_URI'];
	$cache_prefix .= "_tempate_" . $config['skin']; }

$titl_e = '';
$nam_e = '';
$rss_url = '';

if ($nam_e) { $metatags['title'] = $nam_e . $page_extra . ' - '.$config['home_title']; $rss_title = $metatags['title'];
} elseif ($nombrea) { $metatags['title'] = $nombrea . ' - '.$config['home_title']; } elseif ($aplicacion) { $metatags['title'] = $aplicacion; } elseif ($titl_e) {
$metatags['title'] = $titl_e . $page_extra . ' - '.$config['home_title'];

} else $metatags['title'] .= $page_extra;

if ( $metatags['header_title'] ) $metatags['title'] = stripslashes($metatags['header_title']);

$metatags = <<<HTML
<meta http-equiv="Content-Type" content="text/html; charset={$config['charset']}" />
<title>{$metatags['title']}</title>
<meta name="description" content="{$metatags['description']}" />
<meta name="keywords" content="{$keyw}" />
<meta name="robots" content="all" />
<meta name="revisit-after" content="1 days" />
HTML;
?>