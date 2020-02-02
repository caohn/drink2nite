<?php
@session_start ();
@ob_start ();
@ob_implicit_flush ( 0 );

@error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_WARNING ^ E_NOTICE );

define ( 'CAO_SYSTEMS', true );

$member_id = FALSE;
$sesion = FALSE;

define ( 'ROOT_DIR', dirname ( __FILE__ ) );
define ( 'ENGINE_DIR', ROOT_DIR . '/archivos' );
require_once ROOT_DIR . '/archivos/direccion.php';

if (clean_url ( $_SERVER['HTTP_HOST'] ) != clean_url ( $config['http_home_url'] )) {
	$replace_url = array ();
	$replace_url[0] = clean_url ( $config['http_home_url'] );
	$replace_url[1] = clean_url ( $_SERVER['HTTP_HOST'] );
} else
	$replace_url = false;

$tpl->load_template ( 'principal.tpl' );

$tpl->set ( '{sitio}', $config['http_home_url'] );

$config['http_home_url'] = explode ( "index.php", strtolower ( $_SERVER['PHP_SELF'] ) );
$config['http_home_url'] = reset ( $config['http_home_url'] );

$ajax .= <<<HTML
<script language="javascript" type="text/javascript">
<!--
var sitio	= '{$config['http_home_url']}';\n
HTML;

$ajax .= <<<HTML
//-->
</script>
HTML;

$tpl->set ( '{AJAX}', $ajax );
$tpl->set ( '{headers}', $metatags."\n".build_js($js_array, $config) );
$tpl->set ( '{contenido}', $contenido );

$tpl->compile ( 'main' );
$default = 'Defecto';
$tpl->result['main'] = str_ireplace( '{THEME}', $config['http_home_url'] . 'tema/'.$default, $tpl->result['main'] );
if ($replace_url) $tpl->result['main'] = str_replace ( $replace_url[0]."/", $replace_url[1]."/", $tpl->result['main'] );
$tpl->result['main'] = str_replace ( '<img src="http://'.$_SERVER['HTTP_HOST'].'/', '<img src="/', $tpl->result['main'] );

eval (' ?' . '>' . $tpl->result['main'] . '<' . '?php ');
$tpl->global_clear ();
$db->close ();

GzipOut ();
?>