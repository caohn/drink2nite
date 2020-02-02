<?php
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}
@include (ENGINE_DIR . '/data/config.php');
if ($config['http_home_url'] == "") {
	$config['http_home_url'] = explode ( "index.php", $_SERVER['PHP_SELF'] );
	$config['http_home_url'] = reset ( $config['http_home_url'] );
	$config['http_home_url'] = "http://" . $_SERVER['HTTP_HOST'] . $config['http_home_url'];
}
require_once ENGINE_DIR . '/classes/mysql.php';
require_once ENGINE_DIR . '/data/dbconfig.php';
require_once ENGINE_DIR . '/modules/functions.php';
require_once ENGINE_DIR . '/modules/gzip.php';

$Timer = new microTimer ( );
$Timer->start ();
check_xss ();

$PHP_SELF = $config['http_home_url'] . "index.php";
$allow_comments_ajax = false;
$_DOCUMENT_DATE = false;
$user_query = "";

$js_array = array ();
$metatags = array (
				'title' => $config['home_title'], 
				'description' => $config['description'], 
				'keywords' => $config['keywords'],
				'header_title' => "" );
				
if(!$_COOKIE['idioma']) { $_COOKIE['idioma'] = 'es'; }


	if( file_exists( ROOT_DIR . '/lenguaje/' . $_COOKIE['idioma'] . '/website.lng' ) ) {	
	include_once ROOT_DIR . '/lenguaje/' . $_COOKIE['idioma'] . '/website.lng'; } else { die("Archivo de lenguaje no encontrado"); } 

$config['charset'] = ($lang['charset'] != '') ? $lang['charset'] : $config['charset'];
require_once ROOT_DIR . '/archivos/motor.php';
require_once ENGINE_DIR . '/classes/templates.class.php';

if(!$do) {

}

$tpl = new dle_template ( );
$tpl->dir = ROOT_DIR . '/tema/Defecto';
define ( 'TEMPLATE_DIR', $tpl->dir );
?>