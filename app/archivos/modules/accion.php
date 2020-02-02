<?php
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}
require_once ENGINE_DIR . '/classes/parse.class.php';
$parse = new ParseFilter( );
$parse->safe_mode = true;
$THEME = $config['http_home_url'] . 'tema/' . $config['skin'];

switch ( $_REQUEST['act'] ) {
	
	case 'registro':
		$nombre = $_REQUEST['nombre'];
		$apellido = $_REQUEST['apellido'];
		$email = $_REQUEST['email'];
		$password = md5($_REQUEST['password']);
		$d = $_REQUEST['d'];
		$m = $_REQUEST['m'];
		$a = $_REQUEST['a'];
		$sexo = $_REQUEST['sexo'];
		$fecha = $a.'-'.$m.'-'.$d;
		$verificar = $db->super_query( "SELECT id FROM usuarios WHERE correo = '".$email."'");
		if(!$verificar['id']) {
			$db->query( "INSERT INTO usuarios (nombre, apellido, correo, password, nacimiento, sexo) values ('{$nombre}','{$apellido}','{$email}','{$password}','{$fecha}', '{$sexo}')" );
			$accion = 0;
			$verificar = $db->super_query( "SELECT id FROM usuarios WHERE correo = '".$email."'");
			$accion = array("mensaje" => $accion, "usuario" => $verificar);
		} else { $accion = 1; $accion = array("mensaje" => $accion); }
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'tabla_1':
		$tabla_db = $db->query( "SELECT equipo, id, pg, pp, pe, gf, gc, u_p, (gf-gc) SUMAT, ((pg*3)+pe) PUNTOS FROM tabla_posicion_1 WHERE year = '2015' ORDER by PUNTOS DESC, SUMAT DESC" );
		$i = 0;
while ( $row = $db->get_row($tabla_db) ) {
	$i++;
	$equipo = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['equipo']."'");
	$pt = 0;
	$pg = $row['pg']*3;
	$pt = $pg+$row['pe'];
	$accion[] = array("pos" => $i, "equipo" => utf8_decode($equipo['nombre']), "pg" => $row['pg'], "pe" => $row['pe'], "pp" => $row['pp'], "gf" => $row['gf'], "gc" => $row['gc'], "pt" => $pt, "logo" => $equipo['logo']);
}
$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'tabla_2':
		$tabla_db = $db->query( "SELECT equipo, id, pg, pp, pe, gf, gc, u_p, (gf-gc) SUMAT, ((pg*3)+pe) PUNTOS FROM tabla_posicion_2 WHERE year = '2015' ORDER by PUNTOS DESC, SUMAT DESC" );
		$i = 0;
while ( $row = $db->get_row($tabla_db) ) {
	$i++;
	$equipo = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['equipo']."'");
	$pt = 0;
	$pg = $row['pg']*3;
	$pt = $pg+$row['pe'];
	$accion[] = array("pos" => $i, "equipo" => utf8_decode($equipo['nombre']), "pg" => $row['pg'], "pe" => $row['pe'], "pp" => $row['pp'], "gf" => $row['gf'], "gc" => $row['gc'], "pt" => $pt, "logo" => $equipo['logo']);
}
$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'ultimos_3':
		$ultimos_db = $db->query( "SELECT e1, e2, g1, g2, fecha, hora, tipo, jornada FROM jornadas WHERE jugado = '1' ORDER by fecha DESC LIMIT 0,3" );
		$i = 0;
while ( $row = $db->get_row($ultimos_db) ) {
	$i++;
	$equipo1 = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['e1']."'");
	$equipo2 = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['e2']."'");
	$d = date('d',strtotime($row['fecha']));
	$m = date('n',strtotime($row['fecha']));
	if($m == 1) $mes = 'enero'; if($m == 2) $mes = 'febrero'; if($m == 3) $mes = 'marzo'; if($m == 4) $mes = 'abril'; if($m == 5) $mes = 'mayo'; if($m == 6) $mes = 'junio'; if($m == 7) $mes = 'julio'; if($m == 8) $mes = 'agosto'; if($m == 9) $mes = 'septiembre'; if($m == 10) $mes = 'octubre'; if($m == 11) $mes = 'noviembre'; if($m == 12) $mes = 'diciembre';
	$fecha = $d.' de '.$mes;
	$accion[] = array("e1" => $equipo1['nombre'], "e2" => $equipo2['nombre'], "l1" => $equipo1['logo'], "l2" => $equipo2['logo'], "g1" => $row['g1'], "g2" => $row['g2'], "fecha" => $fecha, "hora" => $row['hora'], "tipo" => $row['tipo'], "jornada" => $row['jornada']);
}
$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'proximo':
		$proximo_db = $db->query( "SELECT e1, e2, g1, g2, fecha, hora, tipo, jornada FROM jornadas WHERE jugado = '0' ORDER by fecha ASC LIMIT 0,1" );
		$i = 0;
while ( $row = $db->get_row($proximo_db) ) {
	$i++;
	$equipo1 = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['e1']."'");
	$equipo2 = $db->super_query( "SELECT nombre, logo FROM equipos WHERE id = '".$row['e2']."'");
	$d = date('d',strtotime($row['fecha']));
	$m = date('n',strtotime($row['fecha']));
	if($m == 1) $mes = 'enero'; if($m == 2) $mes = 'febrero'; if($m == 3) $mes = 'marzo'; if($m == 4) $mes = 'abril'; if($m == 5) $mes = 'mayo'; if($m == 6) $mes = 'junio'; if($m == 7) $mes = 'julio'; if($m == 8) $mes = 'agosto'; if($m == 9) $mes = 'septiembre'; if($m == 10) $mes = 'octubre'; if($m == 11) $mes = 'noviembre'; if($m == 12) $mes = 'diciembre';
	$fecha = $d.' de '.$mes;
	$accion[] = array("e1" => $equipo1['nombre'], "e2" => $equipo2['nombre'], "l1" => $equipo1['logo'], "l2" => $equipo2['logo'], "fecha" => $fecha, "hora" => $row['hora'], "tipo" => $row['tipo'], "jornada" => $row['jornada']);
}
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

}

$tpl->result['main'] = utf8_encode($accion);
echo $tpl->result['main'];
die ();
?>