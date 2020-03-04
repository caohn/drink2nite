<?PHP
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}
$domain_cookie = explode (".", clean_url( $_SERVER['HTTP_HOST'] ));
$domain_cookie_count = count($domain_cookie);
$domain_allow_count = -4;

if ( $domain_cookie_count > 4 ) {

	if ( in_array($domain_cookie[$domain_cookie_count-4], array('com', 'net', 'org') )) $domain_allow_count = -3;
	if ( $domain_cookie[$domain_cookie_count-1] == 'ua' ) $domain_allow_count = -3;
	$domain_cookie = array_slice($domain_cookie, $domain_allow_count);
}

$domain_cookie = "." . implode (".", $domain_cookie);

define( 'DOMAIN', $domain_cookie );

function enviar_push($titulo, $mensaje, $a){
	$url = 'https://fcm.googleapis.com/fcm/send';
	$fcm_api_key = 'AIzaSyCf03RwRVix6GrfsiGSQVd0z7tnisX7RZw';
	$title = $titulo;
	$body = $mensaje;
	$topic = $a;
	$data_string = '{
		"notification": {
			"title": "'.$title.'",
			"body": "'.$body.'",
			"sound": "default",
			"click_action": "",
        	"icon": ""
		},
		"data": {
			"param1": "value1",
			"param2": "value2"
		},
	 
		"to": "/topics/'.$topic.'",
		"priority": "high",
		"restricted_package_name": ""
	}';
	$ch = curl_init(  );
	curl_setopt( $ch, CURLOPT_URL, $url);
	curl_setopt( $ch, CURLOPT_POST, true);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json',
		'Authorization: key='.$fcm_api_key
	));
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
	$response = curl_exec( $ch );
	}

	function enviar_push_t($titulo, $mensaje, $a, $tipo, $id_t, $titulo_t){
		$url = 'https://fcm.googleapis.com/fcm/send';
		$fcm_api_key = 'AIzaSyCf03RwRVix6GrfsiGSQVd0z7tnisX7RZw';
		$title = $titulo;
		$body = $mensaje;
		$topic = $a;
		if($tipo == 1) {
		$data_string = '{
			"notification": {
				"title": "'.$title.'",
				"body": "'.$body.'",
				"sound": "default",
				"click_action": "FCM_PLUGIN_ACTIVITY",
				"icon": ""
			},
			"data": {
				"tipo": "'.$tipo.'",
				"id_e": "'.$id_t.'",
				"titulo": "'.$titulo_t.'"
			},
		 
			"to": "/topics/'.$topic.'",
			"priority": "high",
			"restricted_package_name": ""
		}';
	} elseif($tipo == 2) {
		$data_string = '{
			"notification": {
				"title": "'.$title.'",
				"body": "'.$body.'",
				"sound": "default",
				"click_action": "FCM_PLUGIN_ACTIVITY",
				"icon": ""
			},
			"data": {
				"tipo": "'.$tipo.'",
				"id_v": "'.$id_t.'"
			},
		 
			"to": "/topics/'.$topic.'",
			"priority": "high",
			"restricted_package_name": ""
		}';
	} elseif($tipo == 3) {
		$data_string = '{
			"notification": {
				"title": "'.$title.'",
				"body": "'.$body.'",
				"sound": "default",
				"click_action": "FCM_PLUGIN_ACTIVITY",
				"icon": ""
			},
			"data": {
				"tipo": "'.$tipo.'",
				"id_l": "'.$id_t.'",
				"titulo": "'.$titulo_t.'"
			},
		 
			"to": "/topics/'.$topic.'",
			"priority": "high",
			"restricted_package_name": ""
		}';
	}
		$ch = curl_init(  );
		curl_setopt( $ch, CURLOPT_URL, $url);
		curl_setopt( $ch, CURLOPT_POST, true);
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $data_string);
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
			'Content-Type: application/json',
			'Authorization: key='.$fcm_api_key
		));
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
		$response = curl_exec( $ch );
		}

function foto($fotom) {
		global $config;
	$lug = 'perfil/'; $tam = '170';
	
	$dir =  '../subidas/avatar/'.$lug;
	$allow_exts = array ( 'png', 'jpg', 'jpeg', 'gif', 'mjpeg' );
	$file_ext 	 = @end ( explode ( '.', $fotom ));
	$file_name	 = md5 ( $fotom ) . "." . $file_ext;
	
	if ( !file_exists ( $dir . $file_name )) {
	@copy ( $fotom, $dir . $file_name );
	
	require_once ENGINE_DIR . '/modules/disminucion.php';
	$image = new class_image ( $dir . $file_name );
	$image->thumbnail ( $tam );
	$image->save();
	}
	$has_image = file_exists ( $dir . $file_name );
	$foto = 'http://drink2nite.com/subidas/avatar/'.$lug.$file_name;
	return $foto;
	}

function set_cookie($name, $value, $expires) {
	
	if( $expires ) {
		
		$expires = time() + ($expires * 86400);
	
	} else {
		
		$expires = FALSE;
	
	}
	
	setcookie($name, $value, time()+3600,"/"); 
}
function formatsize($file_size) {
	if( $file_size >= 1073741824 ) {
		$file_size = round( $file_size / 1073741824 * 100 ) / 100 . " Gb";
	} elseif( $file_size >= 1048576 ) {
		$file_size = round( $file_size / 1048576 * 100 ) / 100 . " Mb";
	} elseif( $file_size >= 1024 ) {
		$file_size = round( $file_size / 1024 * 100 ) / 100 . " Kb";
	} else {
		$file_size = $file_size . " b";
	}
	return $file_size;
}

class microTimer {
	function start() {
		global $starttime;
		$mtime = microtime();
		$mtime = explode( ' ', $mtime );
		$mtime = $mtime[1] + $mtime[0];
		$starttime = $mtime;
	}
	function stop() {
		global $starttime;
		$mtime = microtime();
		$mtime = explode( ' ', $mtime );
		$mtime = $mtime[1] + $mtime[0];
		$endtime = $mtime;
		$totaltime = round( ($endtime - $starttime), 5 );
		return $totaltime;
	}
}
function hace($fecha){
    $fecha = $fecha; 
    $ahora = time();
    $tiempo = $ahora-$fecha; 
     if(round($tiempo / 31536000) <= 0){ 
        if(round($tiempo / 2678400) <= 0){ 
             if(round($tiempo / 86400) <= 0){ 
                 if(round($tiempo / 3600) <= 0){ 
                    if(round($tiempo / 60) <= 0){ 
                if($tiempo <= 60){ $hace = "Hace poco"; } 
                } else  
                { 
                    $can = round($tiempo / 60); 
                    if($can <= 1) {    $word = "minuto"; } else { $word = "min"; } 
                    $hace = "Hace " .$can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 3600); 
                    if($can <= 1) {    $word = "hora"; } else {    $word = "horas"; } 
                    $hace = "Hace " .$can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 86400); 
                    if($can <= 1) {    $word = "d&iacute;a"; } else {    $word = "d&iacute;as"; } 
                    $hace = "Hace " .$can. " ".$word;
                } 
                } else  
                { 
                    $can = round($tiempo / 2678400);  
                    if($can <= 1) {    $word = "mes"; } else { $word = "meses"; } 
                    $hace = "Hace " .$can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 31536000); 
                    if($can <= 1) {    $word = "a&ntilde;o";} else { $word = "a&ntilde;os"; } 
                    $hace = "Hace " .$can. " ".$word; 
                }
                
    return $hace; 
}
function hace2($fecha){
    $fecha = $fecha; 
    $ahora = time();
    $tiempo = $ahora-$fecha; 
     if(round($tiempo / 31536000) <= 0){ 
        if(round($tiempo / 2678400) <= 0){ 
             if(round($tiempo / 86400) <= 0){ 
                 if(round($tiempo / 3600) <= 0){ 
                    if(round($tiempo / 60) <= 0){ 
                if($tiempo <= 60){ $hace = "Hace poco"; } 
                } else  
                { 
                    $can = round($tiempo / 60); 
                    if($can <= 1) {    $word = "minuto"; } else { $word = "min"; } 
                    $hace = $can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 3600); 
                    if($can <= 1) {    $word = "hora"; } else {    $word = "horas"; } 
                    $hace = $can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 86400); 
                    if($can <= 1) {    $word = "d&iacute;a"; } else {    $word = "d&iacute;as"; } 
                    $hace = $can. " ".$word;
                } 
                } else  
                { 
                    $can = round($tiempo / 2678400);  
                    if($can <= 1) {    $word = "mes"; } else { $word = "meses"; } 
                    $hace = $can. " ".$word; 
                } 
                } else  
                { 
                    $can = round($tiempo / 31536000); 
                    if($can <= 1) {    $word = "a&ntilde;o";} else { $word = "a&ntilde;os"; } 
                    $hace = $can. " ".$word; 
                }
                
    return $hace; 
}
function flooder($ip, $news_time = false) {
	global $config, $db;
	
	if ( $news_time ) {

		$this_time = time() + ($config['date_adjust'] * 60) - $news_time;
		$db->query( "DELETE FROM " . PREFIX . "_flood where id < '$this_time' AND flag='1' " );
		
		$row = $db->super_query("SELECT COUNT(*) as count FROM " . PREFIX . "_flood WHERE ip = '$ip' AND flag='1'");
		
		if( $row['count'] ) return TRUE;
		else return FALSE;

	} else {

		$this_time = time() + ($config['date_adjust'] * 60) - $config['flood_time'];
		$db->query( "DELETE FROM " . PREFIX . "_flood where id < '$this_time' AND flag='0' " );
		
		$row = $db->super_query("SELECT COUNT(*) as count FROM " . PREFIX . "_flood WHERE ip = '$ip' AND flag='0'");
		
		if( $row['count'] ) return TRUE;
		else return FALSE;

	}

}

function totranslit($var, $lower = true, $punkt = true) {
	global $langtranslit;
	
	if ( is_array($var) ) return "";

	if (!is_array ( $langtranslit ) OR !count( $langtranslit ) ) {

		$langtranslit = array(
		'�' => 'a', '�' => 'b', '�' => 'v',
		'�' => 'g', '�' => 'd', '�' => 'e',
		'�' => 'e', '�' => 'zh', '�' => 'z',
		'�' => 'i', '�' => 'y', '�' => 'k',
		'�' => 'l', '�' => 'm', '�' => 'n',
		'�' => 'o', '�' => 'p', '�' => 'r',
		'�' => 's', '�' => 't', '�' => 'u',
		'�' => 'f', '�' => 'h', '�' => 'c',
		'�' => 'ch', '�' => 'sh', '�' => 'sch',
		'�' => '', '�' => 'y', '�' => '',
		'�' => 'e', '�' => 'yu', '�' => 'ya',
		"�" => "yi", "�" => "ye",
		
		'�' => 'A', '�' => 'B', '�' => 'V',
		'�' => 'G', '�' => 'D', '�' => 'E',
		'�' => 'E', '�' => 'Zh', '�' => 'Z',
		'�' => 'I', '�' => 'Y', '�' => 'K',
		'�' => 'L', '�' => 'M', '�' => 'N',
		'�' => 'O', '�' => 'P', '�' => 'R',
		'�' => 'S', '�' => 'T', '�' => 'U',
		'�' => 'F', '�' => 'H', '�' => 'C',
		'�' => 'Ch', '�' => 'Sh', '�' => 'Sch',
		'�' => '', '�' => 'Y', '�' => '',
		'�' => 'E', '�' => 'Yu', '�' => 'Ya',
		"�" => "yi", "�" => "ye",
		);

	}
	
	$var = trim( strip_tags( $var ) );
	$var = preg_replace( "/\s+/ms", "-", $var );

	$var = strtr($var, $langtranslit);
	
	if ( $punkt ) $var = preg_replace( "/[^a-z0-9\_\-.]+/mi", "", $var );
	else $var = preg_replace( "/[^a-z0-9\_\-]+/mi", "", $var );

	$var = preg_replace( '#[\-]+#i', '-', $var );

	if ( $lower ) $var = strtolower( $var );

	$var = str_ireplace( ".php", "", $var );
	$var = str_ireplace( ".php", ".ppp", $var );

	if( strlen( $var ) > 200 ) {
		
		$var = substr( $var, 0, 200 );
		
		if( ($temp_max = strrpos( $var, '-' )) ) $var = substr( $var, 0, $temp_max );
	
	}
	
	return $var;
}
function mes($id) {
$mes = array ("1" => "Enero", "2" => "Febrero", "3" => "Marzo", "4" => "Abril", "5" => "Mayo", "6" => "Junio", "7" => "Julio", "8" => "Agosto", "9" => "Septiembre", "10" => "Octubre", "11" => "Noviembre", "12" => "Diciembre");
$valor = strtr( $id, $mes );
	return $valor;
}
function mesc($id) {
	$mes = array ("1" => "Ene", "2" => "Feb", "3" => "Mar", "4" => "Abr", "5" => "May", "6" => "Jun", "7" => "Jul", "8" => "Ago", "9" => "Sep", "10" => "Oct", "11" => "Nov", "12" => "Dic");
	$valor = strtr( $id, $mes );
		return $valor;
}

function diac($id) {
	$mes = array ("1" => "Lun", "2" => "Mar", "3" => "Mie", "4" => "Jue", "5" => "Vie", "6" => "Sab", "7" => "Dom");
	$valor = strtr( $id, $mes );
		return $valor;
}

function getGCalendarUrl($event){ 
	$titulo = urlencode($event['titulo']); 
	$descripcion = urlencode($event['descripcion']); 
	$localizacion = urlencode($event['localizacion']); 
	$start=new DateTime($event['fecha_inicio'].' '.$event['hora_inicio'].' '.date_default_timezone_get()); 
	$end=new DateTime($event['fecha_fin'].' '.$event['hora_fin'].' '.date_default_timezone_get()); 
	$dates = urlencode($start->format("Ymd\THis")) . "/" . urlencode($end->format("Ymd\THis")); 
	$name = urlencode($event['nombre']); 
	$url = urlencode($event['url']); 
	$gCalUrl = "http://www.google.com/calendar/event?action=TEMPLATE&text=$titulo&dates=$dates&details=$descripcion&location=$localizacion&trp=false&sprop=$url&sprop=name:$name"; 
	return ($gCalUrl); 
}

function set_vars($file, $data) {
	
	$fp = fopen( ENGINE_DIR . '/cache/system/' . $file . '.php', 'wb+' );
	fwrite( $fp, serialize( $data ) );
	fclose( $fp );
	
	@chmod( ENGINE_DIR . '/cache/system/' . $file . '.php', 0666 );
}

function get_vars($file) {
	
	return unserialize( @file_get_contents( ENGINE_DIR . '/cache/system/' . $file . '.php' ) );
}

function filesize_url($url) {
	return ($data = @file_get_contents( $url )) ? strlen( $data ) : false;
}

function dle_cache($prefix, $cache_id = false, $member_prefix = false) {
	global $config, $is_logged, $member_id;
	
	if( $config['allow_cache'] != "yes" ) return false;
	
	if( $is_logged ) $end_file = $member_id['user_group'];
	else $end_file = "0";
	
	if( ! $cache_id ) {
		
		$filename = ENGINE_DIR . '/cache/' . $prefix . '.tmp';
	
	} else {
		
		$cache_id = md5( $cache_id );
		
		if( $member_prefix ) $filename = ENGINE_DIR . "/cache/" . $prefix . "_" . $cache_id . "_" . $end_file . ".tmp";
		else $filename = ENGINE_DIR . "/cache/" . $prefix . "_" . $cache_id . ".tmp";
	
	}
	
	return @file_get_contents( $filename );
}

function create_cache($prefix, $cache_text, $cache_id = false, $member_prefix = false) {
	global $config, $is_logged, $member_id;
	
	if( $config['allow_cache'] != "yes" ) return false;
	
	if( $is_logged ) $end_file = $member_id['user_group'];
	else $end_file = "0";
	
	if( ! $cache_id ) {
		$filename = ENGINE_DIR . '/cache/' . $prefix . '.tmp';
	} else {
		$cache_id = md5( $cache_id );
		
		if( $member_prefix ) $filename = ENGINE_DIR . "/cache/" . $prefix . "_" . $cache_id . "_" . $end_file . ".tmp";
		else $filename = ENGINE_DIR . "/cache/" . $prefix . "_" . $cache_id . ".tmp";
	
	}
	
	$fp = fopen( $filename, 'wb+' );
	fwrite( $fp, $cache_text );
	fclose( $fp );
	
	@chmod( $filename, 0666 );

}

function clear_cache($cache_area = false) {
	
	$fdir = opendir( ENGINE_DIR . '/cache' );
	
	while ( $file = readdir( $fdir ) ) {
		if( $file != '.' and $file != '..' and $file != '.htaccess' and $file != 'system' ) {
			
			if( $cache_area ) {
				
				if( strpos( $file, $cache_area ) !== false ) @unlink( ENGINE_DIR . '/cache/' . $file );
			
			} else {
				
				@unlink( ENGINE_DIR . '/cache/' . $file );
			
			}
		}
	}
}

function check_ip($ips) {
	
	$_IP = $_SERVER['REMOTE_ADDR'];
	
	$blockip = FALSE;
	
	if( is_array( $ips ) ) {
		foreach ( $ips as $ip_line ) {
			
			$ip_arr = rtrim( $ip_line['ip'] );
			
			$ip_check_matches = 0;
			$db_ip_split = explode( ".", $ip_arr );
			$this_ip_split = explode( ".", $_IP );
			
			for($i_i = 0; $i_i < 4; $i_i ++) {
				if( $this_ip_split[$i_i] == $db_ip_split[$i_i] or $db_ip_split[$i_i] == '*' ) {
					$ip_check_matches += 1;
				}
			
			}
			
			if( $ip_check_matches == 4 ) {
				$blockip = $ip_line['ip'];
				break;
			}
		
		}
	}
	
	return $blockip;
}

function check_netz($ip1, $ip2) {
	
	$ip1 = explode( ".", $ip1 );
	$ip2 = explode( ".", $ip2 );
	
	if( $ip1[0] != $ip2[0] ) return false;
	if( $ip1[1] != $ip2[1] ) return false;
	
	return true;

}

function show_attach($story, $id, $static = false) {
	global $db, $config, $lang, $user_group, $member_id;

	$find_1 = array();
	$find_2 = array();
	$replace_1 = array();
	$replace_2 = array();
	
	if( $static ) {
		
		if( is_array( $id ) and count( $id ) ) $where = "static_id IN (" . implode( ",", $id ) . ")";
		else $where = "static_id = '".intval($id)."'";
		
		$db->query( "SELECT id, name, onserver, dcount FROM " . PREFIX . "_static_files WHERE $where" );
		
		$area = "&amp;area=static";
	
	} else {
		
		if( is_array( $id ) and count( $id ) ) $where = "news_id IN (" . implode( ",", $id ) . ")";
		else $where = "news_id = '".intval($id)."'";
		
		$db->query( "SELECT id, name, onserver, dcount FROM " . PREFIX . "_files WHERE $where" );
		
		$area = "";
	
	}
	
	while ( $row = $db->get_row() ) {
		
		$size = formatsize( @filesize( ROOT_DIR . '/subidas/files/' . $row['onserver'] ) );
		$row['name'] = explode( "/", $row['name'] );
		$row['name'] = end( $row['name'] );

		$find_1[] = '[attachment=' . $row['id'] . ']';
		$find_2[] = "#\[attachment={$row['id']}:(.+?)\]#i";

		if ( ! $user_group[$member_id['user_group']]['allow_files'] ) {

			$replace_1[] = "<span class=\"attachment\">{$lang['att_denied']}</span>";
			$replace_2[] = "<span class=\"attachment\">{$lang['att_denied']}</span>";

		} elseif( $config['files_count'] == 'yes' ) {

			$replace_1[] = "<span class=\"attachment\"><a href=\"{$config['http_home_url']}engine/download.php?id={$row['id']}{$area}\" >{$row['name']}</a> [{$size}] ({$lang['att_dcount']} {$row['dcount']})</span>";
			$replace_2[] = "<span class=\"attachment\"><a href=\"{$config['http_home_url']}engine/download.php?id={$row['id']}{$area}\" >\\1</a> [{$size}] ({$lang['att_dcount']} {$row['dcount']})</span>";

		} else {

			$replace_1[] = "<span class=\"attachment\"><a href=\"{$config['http_home_url']}engine/download.php?id={$row['id']}{$area}\" >{$row['name']}</a> [{$size}]</span>";
			$replace_2[] = "<span class=\"attachment\"><a href=\"{$config['http_home_url']}engine/download.php?id={$row['id']}{$area}\" >\\1</a> [{$size}]</span>";

		}

	}

	$db->free();

	$story = str_replace ( $find_1, $replace_1, $story );
	$story = preg_replace( $find_2, $replace_2, $story );
	
	return $story;

}

function xfieldsload($profile = false) {
	global $lang;
	
	if( $profile ) $path = ENGINE_DIR . '/data/xprofile.txt';
	else $path = ENGINE_DIR . '/data/xfields.txt';
	
	$filecontents = file( $path );
	
	if( ! is_array( $filecontents ) ) msgbox( "System error", "File <b>{$path}</b> not found" );
	else {
		foreach ( $filecontents as $name => $value ) {
			$filecontents[$name] = explode( "|", trim( $value ) );
			foreach ( $filecontents[$name] as $name2 => $value2 ) {
				$value2 = str_replace( "&#124;", "|", $value2 );
				$value2 = str_replace( "__NEWL__", "\r\n", $value2 );
				$filecontents[$name][$name2] = $value2;
			}
		}
	}
	return $filecontents;
}

function xfieldsdataload($id) {
	
	if( $id == "" ) return;
	
	$xfieldsdata = explode( "||", $id );
	foreach ( $xfieldsdata as $xfielddata ) {
		list ( $xfielddataname, $xfielddatavalue ) = explode( "|", $xfielddata );
		$xfielddataname = str_replace( "&#124;", "|", $xfielddataname );
		$xfielddataname = str_replace( "__NEWL__", "\r\n", $xfielddataname );
		$xfielddatavalue = str_replace( "&#124;", "|", $xfielddatavalue );
		$xfielddatavalue = str_replace( "__NEWL__", "\r\n", $xfielddatavalue );
		$data[$xfielddataname] = $xfielddatavalue;
	}
	return $data;
}

function create_keywords($story) {
	global $metatags, $config;
	
	$keyword_count = 20;
	$newarr = array ();
	
	$quotes = array ("\x22", "\x60", "\t", "\n", "\r", ",", ".", "/", "�", "#", ";", ":", "@", "~", "[", "]", "{", "}", "=", "-", "+", ")", "(", "*", "^", "%", "$", "<", ">", "?", "!", '"' );
	$fastquotes = array ("\x22", "\x60", "\t", "\n", "\r", '"', "\\", '\r', '\n', "/", "{", "}", "[", "]" );
	
	$story = preg_replace( "#\[hide\](.+?)\[/hide\]#is", "", $story );
	$story = preg_replace( "'\[attachment=(.*?)\]'si", "", $story );
	$story = preg_replace( "'\[page=(.*?)\](.*?)\[/page\]'si", "", $story );
	$story = str_replace( "{PAGEBREAK}", "", $story );
	$story = str_replace( "&nbsp;", " ", $story );
	
	$story = str_replace( $fastquotes, '', trim( strip_tags( str_replace( '<br />', ' ', stripslashes( $story ) ) ) ) );
	
	$metatags['description'] = dle_substr( $story, 0, 190, $config['charset'] );
	
	$story = str_replace( $quotes, '', $story );
	
	$arr = explode( " ", $story );
	
	foreach ( $arr as $word ) {
		if( strlen( $word ) > 4 ) $newarr[] = $word;
	}
	
	$arr = array_count_values( $newarr );
	arsort( $arr );
	
	$arr = array_keys( $arr );
	
	$total = count( $arr );
	
	$offset = 0;
	
	$arr = array_slice( $arr, $offset, $keyword_count );
	
	$metatags['keywords'] = implode( ", ", $arr );
}

function allowed_ip($ip_array) {
	
	$ip_array = trim( $ip_array );
	
	if( $ip_array == "" ) {
		return true;
	}
	
	$ip_array = explode( "|", $ip_array );
	
	$db_ip_split = explode( ".", $_SERVER['REMOTE_ADDR'] );
	
	foreach ( $ip_array as $ip ) {
		
		$ip_check_matches = 0;
		$this_ip_split = explode( ".", trim( $ip ) );
		
		for($i_i = 0; $i_i < 4; $i_i ++) {
			if( $this_ip_split[$i_i] == $db_ip_split[$i_i] or $this_ip_split[$i_i] == '*' ) {
				$ip_check_matches += 1;
			}
		
		}
		
		if( $ip_check_matches == 4 ) return true;
	
	}
	
	return FALSE;
}

function news_permission($id) {
	
	if( $id == "" ) return;
	
	$data = array ();
	$groups = explode( "||", $id );
	foreach ( $groups as $group ) {
		list ( $groupid, $groupvalue ) = explode( ":", $group );
		$data[$groupid] = $groupvalue;
	}
	return $data;
}

function bannermass($fest, $massiv) {
	return $fest . $massiv[@array_rand( $massiv )]['text'];
}

function get_sub_cats($id, $subcategory = '') {
	
	global $cat_info;
	$subfound = array ();
	
	if( $subcategory == '' ) $subcategory = $id;
	
	foreach ( $cat_info as $cats ) {
		if( $cats['parentid'] == $id ) {
			$subfound[] = $cats['id'];
		}
	}
	
	foreach ( $subfound as $parentid ) {
		$subcategory .= "|" . $parentid;
		$subcategory = get_sub_cats( $parentid, $subcategory );
	}
	
	return $subcategory;

}

function check_xss() {
	
	$url = html_entity_decode( urldecode( $_SERVER['QUERY_STRING'] ) );
	$url = str_replace( "\\", "/", $url );
	
	if( $url ) {
		
		if( (strpos( $url, '<' ) !== false) || (strpos( $url, '>' ) !== false) || (strpos( $url, '"' ) !== false) || (strpos( $url, './' ) !== false) || (strpos( $url, '../' ) !== false) || (strpos( $url, '\'' ) !== false) || (strpos( $url, '.php' ) !== false) ) {
			if( $_GET['do'] != "search" or $_GET['subaction'] != "search" ) die( "Hacking attempt!" );
		}
	
	}
	
	$url = html_entity_decode( urldecode( $_SERVER['REQUEST_URI'] ) );
	$url = str_replace( "\\", "/", $url );
	
	if( $url ) {
		
		if( (strpos( $url, '<' ) !== false) || (strpos( $url, '>' ) !== false) || (strpos( $url, '"' ) !== false) || (strpos( $url, '\'' ) !== false) ) {
			if( $_GET['do'] != "search" or $_GET['subaction'] != "search" ) die( "Hacking attempt!" );
		
		}
	
	}

}

function clean_url($url) {
	
	if( $url == '' ) return;
	
	$url = str_replace( "http://", "", strtolower( $url ) );
	$url = str_replace( "https://", "", $url );
	if( substr( $url, 0, 4 ) == 'www.' ) $url = substr( $url, 4 );
	$url = explode( '/', $url );
	$url = reset( $url );
	$url = explode( ':', $url );
	$url = reset( $url );
	
	return $url;
}

function get_url($id) {
	
	global $cat_info;
	
	if( ! $id ) return;
	
	$parent_id = $cat_info[$id]['parentid'];
	
	$url = $cat_info[$id]['alt_name'];
	
	while ( $parent_id ) {
		
		$url = $cat_info[$parent_id]['alt_name'] . "/" . $url;
		
		$parent_id = $cat_info[$parent_id]['parentid'];
		
		if( $cat_info[$parent_id]['parentid'] == $cat_info[$parent_id]['id'] ) break;
	
	}
	
	return $url;
}

function check_smartphone() {

	if ( $_SESSION['mobile_enable'] ) return true;

	$phone_array = array('iphone', 'android', 'pocket', 'palm', 'windows ce', 'windowsce', 'cellphone', 'opera mobi', 'operamobi', 'ipod', 'small', 'sharp', 'sonyericsson', 'symbian', 'symbos', 'opera mini', 'nokia', 'htc_', 'samsung', 'motorola', 'smartphone', 'blackberry', 'playstation portable', 'tablet browser', 'android', 'wap-', 'wapa', 'wapi', 'wapp', 'wapr', 'prox', 'w3c ', 'acs-', 'alav', 'alca', 'gp');
	$agent = strtolower( $_SERVER['HTTP_USER_AGENT'] );

	foreach ($phone_array as $value) {

		if ( strpos($agent, $value) !== false ) return true;

	}

	return false;

}

function build_js($js, $config) {

	$js_array = array();

	if ($config['js_min'] AND version_compare(PHP_VERSION, '5.1.0', '>') ) {

		$js_array[] = "<script type=\"text/javascript\" src=\"{$config['http_home_url']}archivos/classes/min/index.php?charset={$config['charset']}&amp;g=general&amp;4\"></script>";

		if ( count($js) ) $js_array[] = "<script type=\"text/javascript\" src=\"{$config['http_home_url']}archivos/classes/min/index.php?charset={$config['charset']}&amp;f=".implode(",", $js)."&amp;4\"></script>";

		return implode("\n", $js_array);

	} else {

		$default_array = array (
			'archivos/classes/js/jquery.js',
		);

		$js = array_merge($default_array, $js);

		foreach ($js as $value) {
		
			$js_array[] = "<script type=\"text/javascript\" src=\"{$config['http_home_url']}{$value}\"></script>";
		
		}

		return implode("\n", $js_array);
	}
}

function check_static($names, $block, $action = true) {
	global $dle_module;

	$names = explode( ',', $names );

	if ( isset($_GET['page']) ) $page = $_GET['page']; else $page = "";
	
	if( $action ) {
			
		if( in_array( $page, $names ) AND $dle_module == "static" ) {
				
			$block = str_replace( '\"', '"', $block );
			return $block;
		}
		
	} else {
			
		if( !in_array( $page, $names ) OR $dle_module != "static") {
				
			$block = str_replace( '\"', '"', $block  );
			return $block;
		}
		
	}
	
	return "";
}


function dle_strlen($value, $charset ) {

	if ( strtolower($charset) == "utf-8") return iconv_strlen($value, "utf-8");
	else return strlen($value);

}

function dle_substr($str, $start, $length, $charset ) {

	if ( strtolower($charset) == "utf-8") return iconv_substr($str, $start, $length, "utf-8");
	else return substr($str, $start, $length);

}

function dle_strrpos($str, $needle, $charset ) {

	if ( strtolower($charset) == "utf-8") return iconv_strrpos($str, $needle, "utf-8");
	else return strrpos($str, $needle);

}

function check_allow_login($ip, $max ) {
	global $db;

	$block_date = time()-1200;

	$row = $db->super_query( "SELECT * FROM " . PREFIX . "_login_log WHERE ip='{$ip}'" );

	if ( $row['count'] AND $row['date'] < $block_date ) $db->query( "DELETE FROM " . PREFIX . "_login_log WHERE ip = '{$ip}'" );

	if ($row['count'] > $max AND $row['date'] > $block_date ) return false;
	else return true;

}
?>