<?php
@session_start ();

define ( 'CAO_SYSTEMS', true );
define ( 'FILE_DIR', '../subidas/' );
define ( 'ROOT_DIR', '..' );
define ( 'ENGINE_DIR', ROOT_DIR . '/archivos' );

@error_reporting ( E_ALL ^ E_NOTICE );
@ini_set ( 'display_errors', true );
@ini_set ( 'html_errors', false );
@ini_set ( 'error_reporting', E_ALL ^ E_NOTICE );

require ENGINE_DIR . '/data/config.php';

require_once ENGINE_DIR . '/classes/mysql.php';
require_once ENGINE_DIR . '/data/dbconfig.php';
require_once ENGINE_DIR . '/modules/functions.php';
require_once ENGINE_DIR . '/classes/download.class.php';

$id = intval ( $_REQUEST['id'] );

$row = $db->super_query ( "SELECT nombre, archivo, ext FROM archivos WHERE id ='$id'" );

$config['files_max_speed'] = intval ( $config['files_max_speed'] );
$nombre = $row['nombre'].'.'.$row['ext'];
$file = new download ( FILE_DIR . $row['archivo'], $nombre, $config['files_force'], $config['files_max_speed'] );
if ($config['files_count'] == "yes" and ! $file->range) $db->query ( "UPDATE archivos SET download=download+1 WHERE id ='$id'" );
$db->close ();

$file->download_file ();
?>