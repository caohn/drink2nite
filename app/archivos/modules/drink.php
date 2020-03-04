<?php
if (! defined ( 'CAO_SYSTEMS' )) {
	die ( "Error| Asi no se entra a este archivo" );
}
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
		$telefono = $_REQUEST['telefono'];
		$verificar = $db->super_query( "SELECT id FROM usuarios_drink2nite WHERE correo = '".$email."'");
		if(!$verificar['id']) {
			$db->query( "INSERT INTO usuarios_drink2nite (nombre, apellido, correo, password, nacimiento, sexo, registro, telefono) values ('{$nombre}','{$apellido}','{$email}','{$password}','{$fecha}', '{$sexo}', '".time()."', '{$telefono}')" );
			$accion = 0;
			$verificar = $db->super_query( "SELECT id, nombre, apellido, foto, correo, seguidos_n, seguidores_n FROM usuarios_drink2nite WHERE correo = '".$email."'");
			$nombre = $verificar['nombre'].' '.$verificar['apellido'];
			if($datos['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$datos['foto']; } else { $foto = 'img/avatar.png'; }
			$accion = array("mensaje" => $accion, "usuario" => $verificar['id'], "nombre" => $nombre, "correo" => $verificar['correo'], "foto" => $foto, "seguidos" => $verificar['seguidos_n'], "seguidores" => $verificar['seguidores_n']);
			setcookie('usuario_drink2nite',$verificar['id'],time()+(3600*24*7));
		} else { $accion = 1; $accion = array("mensaje" => $accion); }
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'login_fb':
		$nombre = $_REQUEST['nombre'];
		$email = $_REQUEST['email'];
		$password = $_REQUEST['id'];
		$ext = $_REQUEST['ext'];
		$hash = $_REQUEST['hash'];
		$foto = $_REQUEST['foto'].'&height=50&width=50&ext='.$ext.'&hash='.$hash;
		$birthday = date('Y-m-d',strtotime($_REQUEST['fecha']));
		$verificar = $db->super_query( "SELECT id FROM usuarios_drink2nite WHERE correo = '".$email."'");
		if(!$verificar['id']) {
			$db->query( "INSERT INTO usuarios_drink2nite (nombre, correo, password, nacimiento, foto_fb, registro) values ('{$nombre}','{$email}','{$password}','{$birthday}','{$foto}', '".time()."')" );
		}
		$miembro_db = $db->super_query( "SELECT id, nombre, foto_fb, correo, seguidos_n, seguidores_n FROM usuarios_drink2nite WHERE correo = '".$email."'");
		$nombre = $miembro_db['nombre'];
		/* if($miembro_db['foto_fb']) { $foto = $miembro_db['foto_fb']; } else { $foto = 'img/avatar.png'; } */
		$foto = 'img/avatar.png';
		$accion = array("mensaje" => 1, "usuario" => $miembro_db['id'], "nombre" => $nombre, "correo" => $miembro_db['correo'], "foto" => $foto, "seguidos" => $miembro_db['seguidos_n'], "seguidores" => $miembro_db['seguidores_n']);
		setcookie('usuario_drink2nite',$miembro_db['id'],time()+(3600*24*7));
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'login_google':
		$nombre = $_REQUEST['nombre'];
		$email = $_REQUEST['email'];
		$password = $_REQUEST['id'];
		$foto = $_REQUEST['foto'];
		$verificar = $db->super_query( "SELECT id FROM usuarios_drink2nite WHERE correo = '".$email."'");
		if(!$verificar['id']) {
			$db->query( "INSERT INTO usuarios_drink2nite (nombre, correo, password, foto_fb, registro) values ('{$nombre}','{$email}','{$password}','{$foto}', '".time()."')" );
		}
		$miembro_db = $db->super_query( "SELECT id, nombre, foto_fb, correo, seguidos_n, seguidores_n FROM usuarios_drink2nite WHERE correo = '".$email."'");
		$nombre = $miembro_db['nombre'];
		/* if($miembro_db['foto_fb']) { $foto = $miembro_db['foto_fb']; } else { $foto = 'img/avatar.png'; } */
		$foto = 'img/avatar.png';
		$accion = array("mensaje" => 1, "usuario" => $miembro_db['id'], "nombre" => $nombre, "correo" => $miembro_db['correo'], "foto" => $foto, "seguidos" => $miembro_db['seguidos_n'], "seguidores" => $miembro_db['seguidores_n']);
		setcookie('usuario_drink2nite',$miembro_db['id'],time()+(3600*24*7));
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'iniciar_sesion':
		$email = $_REQUEST['email'];
		$password = md5($_REQUEST['password']);
		$verificar = $db->super_query( "SELECT id, nombre, apellido, foto, correo, seguidos_n, seguidores_n FROM usuarios_drink2nite WHERE correo = '".$email."' AND password = '".$password."'");
		if(!$verificar['id']) { $accion = 0; } 
		else { 
			$accion = $verificar['id']; setcookie('usuario_drink2nite',$verificar['id'],time()+(3600*24*7));
			$nombre = $verificar['nombre'].' '.$verificar['apellido'];
			if($datos['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$datos['foto']; } else { $foto = 'img/avatar.png'; } 
		}
		$accion = array("mensaje" => $accion, "nombre" => $nombre, "correo" => $verificar['correo'], "foto" => $foto, "seguidos" => $verificar['seguidos_n'], "seguidores" => $verificar['seguidores_n']);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'recuperar':
	function generarCodigo($longitud) { 
		$key = ''; 
		$pattern = '1234567890'; 
		$max = strlen($pattern)-1; 
		for($i=0;$i < $longitud;$i++) $key .= $pattern{mt_rand(0,$max)}; 
		return $key; 
	} 
		$email = $_REQUEST['email'];
		$verificar = $db->super_query( "SELECT id, nombre, telefono FROM usuarios_drink2nite WHERE correo = '".$email."'");
		if(!$verificar['id']) { $accion = 0; } else { 
			$accion = $verificar['id'];
			$codigo = generarCodigo(6);
			$codigo2 = $codigo;
			$db->query("UPDATE usuarios_drink2nite set pin='".$codigo2."' where id='".$verificar['id']."'");
		
			if($verificar['telefono']) {
				$tipo = 1;
			} else {
				$tipo = 2;
				$asunto = 'Recuperar cuenta de Drink2Nite';
				$headers .= "Mime-Version: 1.0 \r\n";
				$headers .= "From: Equipo drink2nite <noreplay@drink2nite.com>\r\n";
				$headers .= "Content-type: text/html; charset=utf-8";
				$mensaje = '<body style="background:#292f3f; font-family:Arial;">
<div align="center" style="margin-top:20px;"><img src="https://drink2nite.com/tema/Defecto/img/logo.png" width="100"></div>
<div class="cuadro" style="background:#FFF; border-radius:0 0 5px 5px; width:460px; margin:0 auto; font-weight:200; color:#777; font-size:13px; padding:20px;">
<h2 style="text-align:center; font-size:16px; color:#000; padding-top:0; margin-top:0;">Restablecer contraseña</h2>
Estimado <b style="color:#666;">'.$verificar['nombre'].'</b>, hemos recibido tu solicitud para poder restablecer la contraseña de tu cuenta para que puedas seguir gozando de nuestros servicios. <br><br>El código es: <b style="color:#666;">'.$codigo2.'</b><br><br>Gracias por preferirnos<br><br>Atentamente, el equipo de Drink2Nite<span style="display:block; margin:10px 0 0 0; border-top:1px solid #DDD; padding:10px 0 0 0; font-size:10px; color:#999; text-align:center;">Este correo es enviado para '.$email.'<br><b style="color:#666;">Importante:</b> Por favor, no responder o hacer reply a este correo electrónico.</span>
</div><div class="cop" style="text-align:cente; font-size:11px;">©'.date('Y',time()).' Drink2Nite.com | Todos los derechos reservados</div>
</body>';
				$mensaje = '<html><head><title>Recuperar</title></head>'.$mensaje.'</html>';
				mail($email,$asunto,$mensaje,$headers);
			}
		}
		
		$accion = array("mensaje" => $accion, "generado" => $codigo2, "tipo" => $tipo, "telefono" => $verificar['telefono']);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'nueva_password':
	$cuenta = $_REQUEST['usuario'];
	$password = $_REQUEST['password'];
	$db->query("UPDATE usuarios_drink2nite set password='".md5($password)."' where id='".$cuenta."'");
	$verificar = $db->super_query( "SELECT id, nombre, apellido, foto, correo, seguidos_n, seguidores_n FROM usuarios_drink2nite WHERE id = '".$cuenta."'");
	$accion = $verificar['id'];
	setcookie('usuario_drink2nite',$cuenta,time()+(3600*24*7));
	$nombre = $verificar['nombre'].' '.$verificar['apellido'];
	if($verificar['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$verificar['foto']; } else { $foto = 'img/avatar.png'; } 
	$accion = array("mensaje" => $accion, "nombre" => $nombre, "nombres" => $verificar['nombre'], "apellidos" => $verificar['apellido'], "correo" => $verificar['correo'], "foto" => $foto, "seguidos" => $verificar['seguidos_n'], "seguidores" => $verificar['seguidores_n']);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'locales':
	function foto2($fotom) {
		global $lang, $config;
	$lug = 'redondeo/'; $tam = '60';
	
	$dir = '../subidas/'.$lug;
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
	$foto = "https://www.drink2nite.com/subidas/{$lug}{$file_name}";
	return $foto;
	}
	$db->query("UPDATE usuarios_drink2nite set latitud='".$_REQUEST['latitud']."', longitud='".$_REQUEST['longitud']."' where id='".$_REQUEST['id']."'"); 
	/* $busqueda_db = $db->query( "SELECT id, nombre, latitud, longitud, tipo, logo, (6371 * ACOS( 
									SIN(RADIANS(latitud)) * SIN(RADIANS(".$_REQUEST['latitud'].")) 
									+ COS(RADIANS(longitud - ".$_REQUEST['longitud'].")) * COS(RADIANS(latitud)) 
									* COS(RADIANS(".$_REQUEST['latitud']."))
									)
					   ) AS distance FROM locales WHERE tipo = '".$_REQUEST['tipo']."' HAVING distance < 10 ORDER BY distance ASC" ); */
					   $busqueda_db = $db->query( "SELECT id, nombre, latitud, longitud, tipo, logo, (6371 * ACOS( 
						SIN(RADIANS(latitud)) * SIN(RADIANS(".$_REQUEST['latitud'].")) 
						+ COS(RADIANS(longitud - ".$_REQUEST['longitud'].")) * COS(RADIANS(latitud)) 
						* COS(RADIANS(".$_REQUEST['latitud']."))
						)
		   ) AS distance FROM locales HAVING distance < 10 ORDER BY distance ASC" );
	while ( $row = $db->get_row($busqueda_db) ) {
	$venue = $db->super_query( "SELECT id, usuario FROM venue WHERE id_l = '".$row['id']."' AND usuario = '".$_REQUEST['id']."' AND activo = '1'");

	if($row['logo']) { $logo_url = 'https://www.drink2nite.com/subidas/logos/'.$row['logo']; $logo = foto($logo_url); }else {
	$logo = 'https://www.drink2nite.com/subidas/logos/local.png'; } 
	if($row['tipo'] == 1) { if($venue['id'] == 0) { $icono = "img/bar_i.png"; } else { $icono = "img/vbar_i.png"; }  }
	if($row['tipo'] == 2) { if($venue['id'] == 0) { $icono = "img/club_i.png"; } else { $icono = "img/vclub_i.png"; } }
	if($venue['id'] != 0) { $sd1 = ' style="display:none;"'; $sd2 = ''; } else { $sd1 = ''; $sd2 = ' style="display:none;"'; }
	if($venue['usuario'] != $_REQUEST['id'] and $venue['id'] != 0) { $sd1 = ' style="display:none;"'; $sd2 = ' style="display:none;"'; }
	$accion[] = array("id" => $row['id'], "latitude" => $row['latitud'], "longitude" => $row['longitud'], "icon" => $icono, "logo" => $logo, "nombre" => $row['nombre'], "distancia" => number_format($row['distance'],2), "baloon_text" => '<div class="burbuja"><b style="display:block; text-align:center; margin-bottom:5px;">'.$row['nombre'].' <span>('.number_format($row['distance'],1).'km)</span></b><div style="width:210px;"><div class="button-bar" style="width:210px;"><div class="button-bar__item"><button class="button-bar__button" onclick="venue(\''.$row['id'].'\')" '.$sd1.'id="venue'.$row['id'].'">Venue</button><button class="button-bar__button nvenue" onclick="venue2(\''.$row['id'].'\')" '.$sd2.'id="nvenue'.$row['id'].'">No Venue</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="local(\''.$row['id'].'\', \''.$row['nombre'].'\')">Detalles</button></div></div></div></div>');
	$temp = $row['distance'];
	}
	$datos = $db->super_query( "SELECT nombre, apellido, sexo FROM usuarios_drink2nite WHERE id = '".$_COOKIE['usuario_drink2nite']."'");
	if($datos['sexo'] == 1 || $datos['sexo'] == 0) { $icon_u = 'img/user.png'; } else { $icon_u = 'img/user1.png'; }

	if($_REQUEST['id'] != 'undefined') { $baloon = '<div class="burbuja"><button class="button button--material" onclick="nuevo()"><i class="fa fa-plus"></i> Agregar nuevo local</button></div>'; } else { $baloon = '<div class="burbuja"><button class="button button--material" onclick="login_inicio()" style="background:#009900;"><i class="fa fa-user"></i> Iniciar sesión</button></div>'; }
	$accion[] = array("latitude" => $_REQUEST['latitud'], "longitude" => $_REQUEST['longitud'], "icon" => $icon_u, "logo" => "", "nombre" => "", "distancia" => "", "baloon_text" => $baloon);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'datos':
		$id = $_REQUEST['id'];
		$datos = $db->super_query( "SELECT nombre, apellido, correo, registro, foto, notificacion FROM usuarios_drink2nite WHERE id = '".$id."'");
		$nombre = $datos['nombre'].' '.$datos['apellido'];
		if($datos['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$datos['foto']; } else { $foto = 'img/avatar.png'; }
		$busqueda = $db->super_query( "SELECT (6371 * ACOS( 
									SIN(RADIANS(latitud)) * SIN(RADIANS(".$_REQUEST['latitud'].")) 
									+ COS(RADIANS(longitud - ".$_REQUEST['longitud'].")) * COS(RADIANS(latitud)) 
									* COS(RADIANS(".$_REQUEST['latitud']."))
									)
					   ) AS distance FROM locales WHERE tipo = '".$_REQUEST['tipo']."' HAVING distance < 10 ORDER BY distance ASC" );
					   if($busqueda['distance'] < 1) { $zoom = 15; } else
					    if($busqueda['distance'] < 2) { $zoom = 14; } else
						 if($busqueda['distance'] < 3) { $zoom = 13; } else
						 if($busqueda['distance'] > 3) { $zoom = 12; } else { $zoom = 15; }
		$accion = array("nombre" => $nombre, "foto" => $foto, "correo" => $datos['correo'], "nombres" => $datos['nombre'], "apellidos" => $datos['apellido'], "fecha" => date('d.m.Y h:ia',$datos['registro']), "zoom" => $zoom, "notificacion" => $datos['notificacion']);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'venue':
	$id = $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$fecha = time();
	$db->query( "INSERT INTO venue (id_l, usuario, activo, fecha) values ('{$id}','{$uid}','1','".$fecha."')" );

	$row = $db->super_query( "SELECT seguidores, nombre FROM usuarios_drink2nite WHERE id = '".$uid."'");
	$row2 = $db->super_query( "SELECT venue.id, locales.nombre FROM venue INNER JOIN locales ON venue.id_l = locales.id WHERE venue.id_l = '".$id."' AND venue.usuario = '".$uid."' AND venue.fecha = '".$fecha."'");
	$idv = $row2['id'];
	if($row['seguidores']) {
		$list = explode( ",", $row['seguidores'] );
			foreach ( $list as $daten ) {
				$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$daten."', '1', '".$fecha."', '".$uid."', '".$id."', '".$idv."', '')" );
	$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'");
	enviar_push_t($row2['nombre'],$row['nombre'].' acaba de realizar un check in en este local',''.$daten.'','3',''.$id.'',''.$row2['nombre'].'');
			}
}
		$accion = $idv;
		$accion = array("mensaje" => $accion);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'nvenue':
	$id = $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$fecha = time();
	$row2 = $db->super_query( "SELECT id FROM venue WHERE id_l = '".$id."' AND usuario = '".$uid."' AND activo = '1'");
	$idv = $row2['id'];

	$db->query("UPDATE venue set activo='0' where id='".$idv['id']."'");

	$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$uid."'");
	
	if($row['seguidores']) {
		$list = explode( ",", $row['seguidores'] );
			foreach ( $list as $daten ) {
				$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$daten."', '3', '".$fecha."', '".$uid."', '".$id."', '".$idv."', '')" );
	$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'"); 
			}
}

		$accion = 1;
		$accion = array("mensaje" => $accion);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'nvenue2':
	$id = $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$fecha = time();
	$db->query("UPDATE venue set activo='0' where id='".$id."' AND usuario = '".$uid."'"); 

	$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$uid."'");
	$row2 = $db->super_query( "SELECT id_l FROM venue WHERE id = '".$id."'");
	
	if($row['seguidores']) {
		$list = explode( ",", $row['seguidores'] );
			foreach ( $list as $daten ) {
				$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$daten."', '3', '".$fecha."', '".$uid."', '".$row2['id_l']."', '".$id."', '')" );
	$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'"); 
			}
}

		$accion = 1;
		$accion = array("mensaje" => $accion);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'busqueda_rapida':
	$metaip = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR'])); 
	$_POST['id'] = $_POST['id'] = 1;
	$c_ciudad = $metaip['geoplugin_city'].', '.$metaip['geoplugin_region'].', '.$metaip['geoplugin_countryName'];
	$c_pais = $metaip['geoplugin_countryName'];
	$fuera = htmlspecialchars_decode(utf8_decode(htmlentities($c_ciudad, ENT_COMPAT, 'utf-8', false)));
	$fuera2 = html_entity_decode($c_ciudad);
	$lugar = '(id_lugar = \''.$_POST['id'].'\' OR lugar = \''.$fuera.'\')';
	$buscar_db = $db->query( "SELECT * FROM locales WHERE ".$lugar." ORDER BY visto ASC LIMIT 0,2" );
	while ( $row = $db->get_row($buscar_db) ) {
		if($row['logo']) { $logo = 'https://drink2nite.com/subidas/logos/'.$row['logo']; }
		if($row['tipo'] == 1) { $tipo = 'Bar'; } if($row['tipo'] == 2) { $tipo = 'Club'; }
		if($row['h_e'] <= date('H:i',time()) and $row['h_c'] >= date('H:i',time())) { $estado = '<b class="c1">Abierto</b>'; } else { $estado = '<b class="c2">	Cerrado</b>'; }
		if($row['h_e']) { $resultados .= '<div class="sugerencias_item" onclick="local(\''.$row['id'].'\', \''.$row['local'].'\')"><div class="logo"><img src="'.$logo.'"></div><div class="texto"><a>'.$row['nombre'].'</a><div class="categorias">'.$tipo.'<span>•</span>De '.$row['h_e'].' a las '.$row['h_c'].'<span>•</span>'.$estado.'</div><div class="direccion">'.$row['direccion'].'</div></div></div>'; } else {
			$resultados .= '<div class="sugerencias_item" onclick="local(\''.$row['id'].'\', \''.$row['local'].'\')"><div class="logo"><img src="'.$logo.'"></div><div class="texto"><a>'.$row['nombre'].'</a><div class="categorias">'.$tipo.'</div><div class="direccion">'.$row['direccion'].'</div></div></div>';
		}
	}
		if($c_ciudad == ', , ') { $c_ciudad = 'Desconocido'; }
		$db->query("UPDATE usuarios_drink2nite set u_ciudad='".$c_ciudad."' where id='".$_REQUEST['uid']."'"); 
		$accion = array("resultados" => $resultados, "ciudad" => $c_ciudad, "ciudad2" => $fuera2, "pais" => $c_pais );
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'busqueda_total':
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$_POST['id'] = $_POST['id'] = 1;
	/*
	if($_REQUEST['ciudad'] == '') {
	$metaip = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR'])); 
	$c_ciudad = $metaip['geoplugin_city'].', '.$metaip['geoplugin_region'].', '.$metaip['geoplugin_countryName'];
	$fuera = htmlspecialchars_decode(utf8_decode(htmlentities($c_ciudad, ENT_COMPAT, 'utf-8', false)));
	} else { $fuera =  htmlspecialchars_decode(utf8_decode(htmlentities($_REQUEST['ciudad'], ENT_COMPAT, 'utf-8', false)));}

	$lugar = '(id_lugar = \''.$_POST['id'].'\' OR lugar LIKE \'%'.$fuera.'%\')';
	*/
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, logo, h_e, h_c, tipo, direccion, nombre, id FROM locales WHERE nombre LIKE '%".$_REQUEST['busqueda']."%' ORDER BY visto ASC LIMIT 0,5" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if($row['tipo'] == 1) { $tipo = 'Bar'; } if($row['tipo'] == 2) { $tipo = 'Club'; }
					if($row['h_e'] <= date('H:i',time()) and $row['h_c'] >= date('H:i',time())) { $estado = '<b class="success">Abierto</b>'; } else { $estado = '<b class="danger">	Cerrado</b>'; }
					array_push($someArray, [
					  'logo'   => $row['logo'],
					  'tipo'   => $tipo,
					  'estado'   => $estado,
					  'h_e'   => $row['h_e'],
					  'h_c'   => $row['h_c'],
					  'direccion'   => $row['direccion'],
					  'distancia'   => number_format($row['distance'],2),
					  'nombre'   => $row['nombre'],
					  'id' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
				/*
	if($_REQUEST['busqueda']) {
	$buscar2_db = $db->query( "SELECT nombre, apellido, id, foto FROM usuarios_drink2nite WHERE (nombre LIKE '%".$_REQUEST['busqueda']."%' OR apellido LIKE '%".$_REQUEST['busqueda']."%') ORDER BY id ASC LIMIT 0,10" );
	while ( $row2 = $db->get_row($buscar2_db) ) {
		if($row2['foto']) { $foto = 'foto/carlos.jpg'; } else { $foto = 'images/avatar.png'; }
		$resultados2 .= '<div style="height:20px; border-bottom:1px solid rgba(255,255,255,0.2); padding:8px 10px 8px 40px; position:relative; font-size:13px; font-weight:bold;" onclick="perfil_ver(\''.$row2['id'].'\',\'1\')"><img src="'.$foto.'" style="position:absolute; top:5px; left:5px; width:25px;">'.$row2['nombre'].' '.$row2['apellido'].'</div>';
	} }
	$accion = array("resultados" => $resultados, "resultados2" => $resultados2);
	$accion = $_GET['callback'].'('.json_encode($accion).')'; */
	break;

	case 'busqueda_total_usuarios':
	$id = $_REQUEST['id'];
	$member_id = $db->super_query("SELECT bloqueados, bloqueos FROM usuarios_drink2nite WHERE id = '".$id."'");
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	if($member_id['bloqueados'] and !$member_id['bloqueos']) { $where = 'id NOT IN ('.$member_id['bloqueados'].') AND'; } 
	elseif(!$member_id['bloqueados'] and $member_id['bloqueos']) { $where = 'id NOT IN ('.$member_id['bloqueos'].') AND'; } 
	elseif($member_id['bloqueados'] and $member_id['bloqueos']) { $where = 'id NOT IN ('.$member_id['bloqueados'].','.$member_id['bloqueos'].') AND'; } 
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, nombre, apellido, correo, seguidos_n, seguidores_n, id, CONCAT(nombre, ' ' ,apellido) AS completo, foto FROM usuarios_drink2nite WHERE ".$where." CONCAT(nombre, ' ' ,apellido) LIKE '%".$_REQUEST['busqueda']."%'  OR correo LIKE '%".$_REQUEST['busqueda']."%' ORDER BY distance ASC LIMIT 0,5" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'correo'   => $row['correo'],
					  'seguidos_n'   => $row['segudidos_n'],
					  'seguidores_n'   => $row['seguidores_n'],
					  'foto' => $foto,
					  'distancia'   => number_format($row['distance'],2),
					  'id' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
	break;
	
	case 'local':
	$id = $_REQUEST['id'];
	$tipo = $_REQUEST['tipo'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	if($tipo == 5) $tipo = 2;
	$row = $db->super_query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, logo, tipo, h_e, h_c, nombre, lugar, direccion, descripcion, id, pagina, numero, latitud, longitud FROM locales WHERE id = '".$id."'" );
	if($row['logo']) { $logo = 'https://drink2nite.com/subidas/logos/'.$row['logo']; } else { $logo = 'https://drink2nite.com/subidas/logos/local.png'; }
	if($row['tipo'] == 1) { $tipo = 'Bar'; } if($row['tipo'] == 2) { $tipo = 'Club'; }
	if($row['h_e'] <= date('H:i',time()) and $row['h_c'] >= date('H:i',time())) { $estado = '<b class="c1">Abierto</b>'; } else { $estado = '<b class="c2">	Cerrado</b>'; }
	$descripcion = $tipo.'<span>•</span>De '.$row['h_e'].' a las '.$row['h_c'].'<span>•</span>'.$estado;
	if($row['h_e']) {
		$descripcion2 = number_format($row['distance'],2).'km<span>•</span>De '.$row['h_e'].' a las '.$row['h_c'].'<span>•</span>'.$estado;
	} else {
		$descripcion2 = number_format($row['distance'],2).'km';
	}
	
	$venue = $db->super_query( "SELECT id, usuario FROM venue WHERE id_l = '".$_REQUEST['id']."' AND usuario = '".$_REQUEST['uid']."' AND activo = '1'");
	if($venue['id'] != 0) { $sd1 = ' style="display:none;"'; $sd2 = ''; } else { $sd1 = ''; $sd2 = ' style="display:none;"'; }
	$member_id = $db->super_query( "SELECT favoritos, seguidosl FROM usuarios_drink2nite WHERE id = '".$_REQUEST['uid']."'");
	$fav_arr = explode( ',', $member_id['favoritos'] );
	if( in_array( $id, $fav_arr ) ) { $fd1 = ' style="display:none;"'; $fd2 = '';} else { $fd1 = ''; $fd2 = ' style="display:none;"'; }
	$seg_arr = explode( ',', $member_id['seguidosl'] );
	if( in_array( $id, $seg_arr ) ) { $ss1 = ' style="display:none;"'; $ss2 = '';} else { $ss1 = ''; $ss2 = ' style="display:none;"'; }
	$cal = $db->super_query( "SELECT id FROM valoracion WHERE usuario = '".$_REQUEST['uid']."' AND local = '".$_REQUEST['id']."'");
	if($cal['id']) { $cali = 1; } else { $cali = 0; }
	$val_db = $db->query( "SELECT valoracion FROM valoracion WHERE local = '".$_REQUEST['id']."'");
	$cuenta = 0;
	while ( $row2 = $db->get_row($val_db) ) {
		$cuenta++;
		$suma_val = $suma_val+$row2['valoracion'];
	}
	$total = $suma_val/$cuenta;
	if($cuenta > 0) { $valoracion2 = round($total,0); for($i=1;$i<=5;$i++) { if($i <= $valoracion2){$valoracion .= '<i class="fa fa-star"></i>';}else{$valoracion .= '<i class="fa fa-star-o"></i>';}} if($cuenta == 1) { $valoracion .= ' ('.$cuenta.' persona)'; } else { $valoracion .= ' ('.$cuenta.' personas)'; } } else {
	$valoracion = 'Sin valoración'; }

	$botones = '<div class="button-bar" style="width:100%;"><div class="button-bar__item"><button class="button-bar__button" onclick="venue(\''.$row['id'].'\')" '.$sd1.'id="venue'.$row['id'].'">Check In</button><button class="button-bar__button nvenue" onclick="venue2(\''.$row['id'].'\')" '.$sd2.'id="nvenue'.$row['id'].'">Check Out</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="favoritos(\''.$row['id'].'\',\'1\')" id="favorito'.$row['id'].'"'.$fd1.'>Favorito</button><button class="button-bar__button nfavoritos" onclick="favoritos(\''.$row['id'].'\',2)" '.$fd2.'id="nfavorito'.$row['id'].'">Favorito</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="seguir(\''.$row['id'].'\',\'1\')" id="seguir'.$row['id'].'"'.$ss1.'>Seguir</button><button class="button-bar__button nseguir" onclick="seguir(\''.$row['id'].'\',2)" '.$ss2.'id="nseguir'.$row['id'].'">Seguir</button></div></div>';

	/* $botones = '<div class="button-bar" style="width:100%;"><div class="button-bar__item"><button class="button-bar__button" onclick="venue(\''.$row['id'].'\')" '.$sd1.'id="venue'.$row['id'].'">Venue</button><button class="button-bar__button nvenue" onclick="venue2(\''.$row['id'].'\')" '.$sd2.'id="nvenue'.$row['id'].'">No Venue</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="favoritos(\''.$row['id'].'\',\'1\')" id="favorito'.$row['id'].'"'.$fd1.'>Favorito</button><button class="button-bar__button nfavoritos" onclick="favoritos(\''.$row['id'].'\',2)" '.$fd2.'id="nfavorito'.$row['id'].'">Favorito</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="seguir(\''.$row['id'].'\',\'1\')" id="seguir'.$row['id'].'"'.$ss1.'>Seguir</button><button class="button-bar__button nseguir" onclick="seguir(\''.$row['id'].'\',2)" '.$ss2.'id="nseguir'.$row['id'].'">Seguir</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="publicar()">Check In</button></div></div>'; */
	
	$publicaciones_db = $db->query( "SELECT * FROM publicaciones WHERE a = '".$_REQUEST['id']."' AND tipo = '0' ORDER by id DESC LIMIT 0,10");
	while ( $row2 = $db->get_row($publicaciones_db) ) {
		$rating = '';
		$usuario = $db->super_query( "SELECT nombre, apellido, foto FROM usuarios_drink2nite WHERE id = '".$row2['usuario']."'");
		if($row2['imagen']) $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$row2['imagen'].'" class="imagen">'; else $imagen = '';
		if($row2['rating'] > 0) { for($i=1; $i<=5; $i++) { if($row2['rating'] >= $i) { $rating .= '<i class="fa fa-star"></i>'; } else { $rating .= '<i class="fa fa-star-o"></i>'; } }
		
		$ratingm = '<div class="rating_right">'.$rating.'</div>'; } else {
			$rating = ''; $ratingm = '';
		}
		if($usuario['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$usuario['foto']; } else { $foto = 'img/avatar.png'; }
$publicaciones .= '<div class="post" onclick="perfil_ver(\''.$row2['usuario'].'\',\''.$tipo.'\')"><div class="titulo"><img src="'.$foto.'">'.$usuario['nombre'].' '.$usuario['apellido'].'<span>'.$row2['lugar'].'</span></div>'.$imagen.'<div class="texto">'.$row2['texto'].'</div><div class="abajo">'.hace($row2['fechat']).$ratingm.'</div></div>';
	}
if(!$publicaciones) { $publicaciones = '<div style="padding:20px; text-align:center;">No se encontraron publicaciones</div>'; }

$promociones_db = $db->query( "SELECT imagen FROM promos WHERE id_l = '".$_REQUEST['id']."' AND estado = '1' ORDER by id DESC LIMIT 0,3");
	while ( $row3 = $db->get_row($promociones_db) ) {
		$promo .= '<ons-carousel-item><img src="https://drink2nite.com/subidas/promos/'.$row3['imagen'].'" style="width: 100%; border-radius:3px;"> </ons-carousel-item>';
	}
	
	$accion = array("titulo" => $row['nombre'], "logo" => $logo, "latitud" => $row['latitud'], "longitud" => $row['longitud'], "tipo" => $row['tipo'], "direccion" => $row['direccion'], "descripcion" => $descripcion, "descripcion2" => $descripcion2, "botones" => $botones, "calificacion" => $cali, "valoracion"=>$valoracion, "publicaciones" => $publicaciones, "promo" => $promo);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'favoritos':
	$tipo = $_REQUEST['tipo'];
	$id =  $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$member_id = $db->super_query( "SELECT favoritos FROM usuarios_drink2nite WHERE id = '".$uid."'");
	$accion = 'Correcto';
	
	$list = explode( ",", $member_id['favoritos'] );

	if($tipo == 1) {
		$list[] = $id;
		$favorites = implode( ",", $list );
		if( $member_id['favoritos'] == "" ) $favorites = $id;
	} 
	
	if($tipo == 2) {
		$i = 0;
		foreach ( $list as $daten ) { 
			if( $daten == $id ) unset( $list[$i] ); 
			$i++; 
		}
		if( count( $list ) ) 
			$favorites = implode( ",", $list ); 
		else 
			$favorites = "";
	}
	
	$db->query( "UPDATE usuarios_drink2nite set favoritos='$favorites' where id = '$uid'" ); 
	
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'seguir':
	$tipo = $_REQUEST['tipo'];
	$id =  $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$member_id = $db->super_query( "SELECT seguidosl FROM usuarios_drink2nite WHERE id = '".$uid."'");
	$accion = 'Correcto';
	
	$list = explode( ",", $member_id['seguidosl'] );

	if($tipo == 1) {
		$list[] = $id;
		$seguidos = implode( ",", $list );
		if( $member_id['seguidosl'] == "" ) $seguidos = $id;
	} 
	
	if($tipo == 2) {
		$i = 0;
		foreach ( $list as $daten ) { 
			if( $daten == $id ) unset( $list[$i] ); 
			$i++; 
		}
		if( count( $list ) ) 
			$seguidos = implode( ",", $list ); 
		else 
			$seguidos = "";
	}
	
	$db->query( "UPDATE usuarios_drink2nite set seguidosl='$seguidos' where id = '$uid'" ); 
	
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'seguir_u':
	$tipo = $_REQUEST['tipo'];
	$id =  $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$member_id = $db->super_query( "SELECT seguidos, nombre FROM usuarios_drink2nite WHERE id = '".$uid."'");
	$member2_id = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$id."'");
	$accion = 'Correcto';
	
	$list = explode( ",", $member_id['seguidos'] );
	$list2 = explode( ",", $member2_id['seguidores'] );

	if($tipo == 1) {
		$list[] = $id;
		$seguidos = implode( ",", $list );
		if( $member_id['seguidos'] == "" ) $seguidos = $id;
		
		$list2[] = $uid;
		$seguidos2 = implode( ",", $list2 );
		if( $member_id['seguidores'] == "" ) $seguidos2 = $uid;
	} 
	
	if($tipo == 2) {
		$i = 0;
		foreach ( $list as $daten ) { 
			if( $daten == $id ) unset( $list[$i] ); 
			$i++; 
		}
		if( count( $list ) ) 
			$seguidos = implode( ",", $list ); 
		else 
			$seguidos = "";
			
		$ii = 0;
		foreach ( $list2 as $daten2 ) { 
			if( $daten2 == $uid ) unset( $list2[$ii] ); 
			$ii++; 
		}
		if( count( $list2 ) ) 
			$seguidos2 = implode( ",", $list2 ); 
		else 
			$seguidos2 = "";
	}
	if($tipo == 1) { 
		$db->query( "UPDATE usuarios_drink2nite set seguidos='$seguidos', seguidos_n=seguidos_n+1 where id = '$uid'" ); 
		$db->query( "UPDATE usuarios_drink2nite set seguidores='$seguidos2', seguidores_n=seguidores_n+1 where id = '$id'" );

		enviar_push('Nuevo seguidor',$member_id['nombre'].' ha comenzado a seguirte',''.$id.'');
	} else {
		$db->query( "UPDATE usuarios_drink2nite set seguidos='$seguidos', seguidos_n=seguidos_n-1 where id = '$uid'" ); 
		$db->query( "UPDATE usuarios_drink2nite set seguidores='$seguidos2', seguidores_n=seguidores_n-1 where id = '$id'" ); 
	}
	
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'publicar_texto':
	function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; } 
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
	}
	$file = $_FILES['foto']['name'];
	if($file) {
		$ext = getExtension($file);
		$archivo_final = md5($file.time());
		$archivo = $archivo_final.'.'.$ext;
		move_uploaded_file($_FILES['foto']['tmp_name'],"../subidas/locales/".$archivo);
	}
	$metaip = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR'])); 
	$c_ciudad = $metaip['geoplugin_city'].', '.$metaip['geoplugin_region'].', '.$metaip['geoplugin_countryName'];
	if($c_ciudad == ', , ') { $c_ciudad = 'Desconocido'; }
	$id = $_POST['local_id'];
	$rating = $_POST['rating_calificar'];
	if(!$rating) { $rating = 0; } else { $db->query( "INSERT INTO valoracion (usuario, valoracion, local) values ('".$_POST['usuario_id']."','{$rating}','{$id}')" ); }
	$texto = $_POST['texto'];
	if($rating > 0) {
	for($i=1;$i<=5;$i++) { if($i <= $rating){$estrella .= '<i class="fa fa-star"></i>';}else{$estrella .= '<i class="fa fa-star-o"></i>';}}}
	if($file) { $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$archivo.'" class="imagen">'; }
	$accion = '<div class="post"><div class="titulo"><img src="'.$_POST['usuario_foto'].'">'.$_POST['usuario_nombre'].'<span>'.$c_ciudad.'</span></div>'.$imagen.'<div class="texto">'.utf8_decode($texto).'</div><div class="abajo">Hace unos instantes<div class="rating_right">'.$estrella.'</div></div></div>';
	$db->query( "INSERT INTO publicaciones (usuario, a, tipo, texto, imagen, rating, fecha, fechat, lugar) values ('".$_POST['usuario_id']."', '".$id."', '0', '".$texto."', '".$archivo."', '".$rating."', '".date('Y-m-d',time())."', '".time()."', '".$c_ciudad."')" );
	
	
	$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$_POST['usuario_id']."'");
	if($row['seguidores']) {
		$fecha = time();
		$list = explode( ",", $row['seguidores'] );
			foreach ( $list as $daten ) {
				$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$daten."', '4', '".$fecha."', '".$_POST['usuario_id']."', '".$id."', '', '')" );
				$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'");
				$row2 = $db->super_query( "SELECT nombre FROM locales WHERE id = '".$id."'");
				enviar_push_t('Check-in',$_POST['usuario_nombre'].' acaba de realizar check-in en '.$row2['nombre'],''.$daten.'','3',''.$id.'',''.$row2['nombre'].'');
			}
}
	break;

	case 'publicar_comentario':
		function getExtension($str) {
			 $i = strrpos($str,".");
			 if (!$i) { return ""; } 
			 $l = strlen($str) - $i;
			 $ext = substr($str,$i+1,$l);
			 return $ext;
		}
		$file = $_FILES['foto']['name'];
		if($file) {
			$ext = getExtension($file);
			$archivo_final = md5($file.time());
			$archivo = $archivo_final.'.'.$ext;
			move_uploaded_file($_FILES['foto']['tmp_name'],"../subidas/locales/".$archivo);
		}
		$metaip = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR'])); 
		$c_ciudad = $metaip['geoplugin_city'].', '.$metaip['geoplugin_region'].', '.$metaip['geoplugin_countryName'];
		if($c_ciudad == ', , ') { $c_ciudad = 'Desconocido'; }
		$id = $_POST['evento_id'];
		$texto = $_POST['texto'];
		
		if($file) { $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$archivo.'" class="imagen">'; }
		$accion = '<div class="post"><div class="titulo"><img src="'.$_POST['usuario_foto'].'">'.$_POST['usuario_nombre'].'<span>'.$c_ciudad.'</span></div>'.$imagen.'<div class="texto">'.utf8_decode($texto).'</div><div class="abajo">Hace unos instantes</div></div>';
		$db->query( "INSERT INTO comentarios (id_u, id_e, tipo, texto, imagen, fecha, fechat, lugar) values ('".$_POST['usuario_id']."', '".$id."', '0', '".$texto."', '".$archivo."', '".date('Y-m-d',time())."', '".time()."', '".$c_ciudad."')" );
		
		
		$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$_POST['usuario_id']."'");
		if($row['seguidores']) {
			$row2 = $db->super_query( "SELECT titulo, id_u FROM evento WHERE id = '".$id."'");
			$prop = $row2['id_u'];
			$titulo = $row2['titulo'];
			$fecha = time();
			$list = explode( ",", $row['seguidores'] );
				foreach ( $list as $daten ) {
					$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, evento, venue, respuesta, local) values ('".$daten."', '9', '".$fecha."', '".$_POST['usuario_id']."', '".$id."', '', '', '')" );
					$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'");
					enviar_push_t('Eventos',$_POST['usuario_nombre'].' acaba de comentar en '.$titulo,''.$daten.'','1',''.$id.'',''.$titulo.'');
				}
		}
		if($prop != $_POST['usuario_id']) {
			enviar_push_t('Eventos',$_POST['usuario_nombre'].' acaba de comentar tu evento '.$titulo,''.$prop.'','1',''.$id.'',''.$titulo.'');
		}
		break;
	
	case 'publicar_evento':
	function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; } 
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
	}
	$file = $_FILES['foto2']['name'];
	if($file) {
		$ext = getExtension($file);
		$archivo_final = md5($file.time());
		$archivo = $archivo_final.'.'.$ext;
		move_uploaded_file($_FILES['foto2']['tmp_name'],"../subidas/eventos/".$archivo);
	}
	$metaip = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$_SERVER['REMOTE_ADDR'])); 
	$c_ciudad = $metaip['geoplugin_city'].', '.$metaip['geoplugin_region'].', '.$metaip['geoplugin_countryName'];
	if($c_ciudad == ', , ') { $c_ciudad = 'Desconocido'; }
	$id = $_POST['local_id2'];
	$texto = $_POST['texto2'];
	if($file) { $imagen = '<img src="https://drink2nite.com/subidas/eventos/'.$archivo.'" class="imagen">'; }
	
	$accion = '<div class="post"><div class="titulo"><img src="'.$_POST['usuario_foto2'].'">'.$_POST['usuario_nombre2'].'<span>'.$c_ciudad.'</span></div>'.$imagen.'<div class="texto">'.utf8_decode($texto).'</div><div class="abajo">Hace unos instantes</div></div>';
	
	$l_row = $db->super_query( "SELECT propietario FROM locales WHERE id = '".$id."'" );
	if($l_row['propietario'] == $_POST['usuario_id2']) { $prop = 1; } else { $prop = 0; }
	
	$db->query( "INSERT INTO eventos (id_u, id_l, tipo, texto, imagen, fecha, fecha_1, propietario) values ('".$_POST['usuario_id2']."', '".$id."', '".$_POST['tipo_e']."', '".$texto."', '".$archivo."', '".date('Y-m-d',time())."', '".$_POST['fecha_evento']."', '".$prop."')" );
	break;
	
	case 'sugerencias_nombre':
	$ciudades_db = $db->query( "SELECT lugar FROM locales WHERE lugar LIKE '%".$_REQUEST['lugar']."%' GROUP BY lugar LIMIT 0,3");
	while ( $row = $db->get_row($ciudades_db) ) {
		$accion .= '<div class="item" onclick="poner_lugar(\''.$row['lugar'].'\')">'.$row['lugar'].'</div>';
	}
	if(!$accion) { $accion = 'No'; }
	$accion = array("resultados" => $accion);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'reportar':
		$id = $_REQUEST['id'];
		$idu = $_REQUEST['uid'];
		$tipo = $_REQUEST['tipo'];
		$fecha = date('Y-m-d',time());
		$db->query( "INSERT INTO reportes (id_u, id_r, razon, fecha) values ('".$id."', '".$idu."', '".$tipo."', '".$fecha."')" );

		$member_id = $db->super_query( "SELECT bloqueados FROM usuarios_drink2nite WHERE id = '".$idu."'");
		$list = explode( ",", $member_id['bloqueados'] );
		$list[] = $id;
		$bloqueados = implode( ",", $list );
		if( $member_id['bloqueados'] == "" ) $bloqueados = $id;

		$member_id2 = $db->super_query( "SELECT bloqueos FROM usuarios_drink2nite WHERE id = '".$id."'");
		$list2 = explode( ",", $member_id2['bloqueos'] );
		$list2[] = $idu;
		$bloqueos = implode( ",", $list2 );
		if( $member_id['bloqueos'] == "" ) $bloqueos = $idu;
	
		$db->query( "UPDATE usuarios_drink2nite set bloqueados='$bloqueados' where id = '$idu'" );
		$db->query( "UPDATE usuarios_drink2nite set bloqueos='$bloqueos' where id = '$id'" ); 

	$accion = 'No';
	$accion = array("mensaje" => $accion);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'perfil':
	$tipo = $_REQUEST['tipo'];
	if($tipo == 1) { $val = 1; } elseif($tipo == 2) { $val = 5; }
	$publicaciones_total_db = $db->query( "SELECT id FROM publicaciones WHERE usuario = '".$_REQUEST['id']."'");
	$cuenta = $db->num_rows($publicaciones_total_db);
	
	$usuario_db = $db->query( "SELECT * FROM usuarios_drink2nite WHERE id = '".$_REQUEST['id']."'");
	while ( $row = $db->get_row($usuario_db) ) {
		if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
		
	$member_id = $db->super_query( "SELECT seguidos FROM usuarios_drink2nite WHERE id = '".$_REQUEST['uid']."'");
	$fav_arr = explode( ',', $member_id['seguidos'] );
	if( in_array( $_REQUEST['id'], $fav_arr ) ) { $sd1 = ' style="display:none;"'; $sd2 = '';} else { $sd1 = ''; $sd2 = ' style="display:none;"'; }
		
		$botones = '<div class="button-bar" style="width:100%;"><div class="button-bar__item"><button class="button-bar__button" onclick="seguir_usuario(\''.$_REQUEST['id'].'\',\'1\')" '.$sd1.'id="seguiru'.$row['id'].'">Comenzar a seguir</button><button class="button-bar__button nvenue" onclick="seguir_usuario(\''.$_REQUEST['id'].'\',\'2\')" '.$sd2.'id="nseguiru'.$row['id'].'">Dejar de seguir</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="document.getElementById(\'action-sheet-dialog\').show()">Bloquear usuario</button></div></div>';
	
	$checkin_db = $db->query( "SELECT id FROM venue WHERE usuario = '".$_REQUEST['id']."'");
	$cuentac = $db->num_rows($checkin_db);

	if(!$_REQUEST['pag']) $comienzo = 0;
	$pagina = 10;
	$publicaciones_total_db = $db->query( "SELECT id FROM publicaciones WHERE usuario = '".$_REQUEST['id']."'");
	$cuenta = $db->num_rows($publicaciones_total_db);
	$total = $comienzo*$pagina;
	$ttotal = ($comienzo+1)*$pagina;
	if($ttotal < $cuenta) { $final_boton = '<button>Cargar más</button>'; }
	$publicaciones_db = $db->query( "SELECT * FROM publicaciones WHERE usuario = '".$_REQUEST['id']."' ORDER by id DESC LIMIT ".$total.",".$pagina."");
	while ( $row2 = $db->get_row($publicaciones_db) ) {
		$rating = '';
		$local = $db->super_query( "SELECT nombre FROM locales WHERE id = '".$row2['a']."'");
		if($row2['imagen']) $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$row2['imagen'].'" class="imagen">'; else $imagen = '';
		if($row2['rating'] > 0) { for($i=1; $i<=5; $i++) { if($row2['rating'] >= $i) { $rating .= '<i class="fa fa-star"></i>'; } else { $rating .= '<i class="fa fa-star-o"></i>'; } } $ratingm = '<div class="rating_right">'.$rating.'</div>'; }
$publicaciones .= '<div class="post"><div class="titulo"><img src="'.$foto.'">'.$row['nombre'].' '.$row['apellido'].' <i class="fa fa-angle-right" aria-hidden="true" style="margin-left:5px; margin-right:5px; color:rgba(255,255,255,0.5)"></i> '.$local['nombre'].'<span>'.$row2['lugar'].'</span></div>'.$imagen.'<div class="texto">'.$row2['texto'].'</div><div class="abajo">'.hace($row2['fechat']).$ratingm.'</div></div>';
	}
if(!$publicaciones) { $publicaciones = '<div style="padding:20px; text-align:center;">No se encontraron publicaciones</div>'; } else { $publicaciones = $publicaciones;}
		
		$accion = array("nombre" => $row['nombre'], "apellido" => $row['apellido'], "correo" => $row['correo'], "foto" => $foto, "botones" => $botones, "seguidos" => $row['seguidos_n'], "seguidores" => $row['seguidores_n'], "check" => $cuentac, "publicaciones" => $publicaciones);
	} 
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'historia':
	$seguidores = $db->super_query( "SELECT seguidos FROM usuarios_drink2nite WHERE id = '".$_REQUEST['uid']."'");
	if($seguidores['seguidos']) { $in = $_REQUEST['uid'].','.$seguidores['seguidos']; } else { $in = $_REQUEST['uid']; }
	if(!$_REQUEST['pag']) $comienzo = 0;
	$pagina = 10;
	$publicaciones_total_db = $db->query( "SELECT id FROM publicaciones WHERE usuario IN (".$in.")");
	$cuenta = $db->num_rows($publicaciones_total_db);
	$total = $comienzo*$pagina;
	$ttotal = ($comienzo+1)*$pagina;
	if($ttotal < $cuenta) { $final_boton = '<button>Cargar más</button>'; }
$publicaciones_db = $db->query( "SELECT * FROM publicaciones WHERE usuario IN (".$in.") ORDER by id DESC LIMIT ".$total.",".$pagina."");
	while ( $row2 = $db->get_row($publicaciones_db) ) {
		$rating = '';
		$usuario = $db->super_query( "SELECT nombre, apellido, foto FROM usuarios_drink2nite WHERE id = '".$row2['usuario']."'");
		$local = $db->super_query( "SELECT nombre FROM locales WHERE id = '".$row2['a']."'");
		if($row2['imagen']) $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$row2['imagen'].'" class="imagen">'; else $imagen = '';
		if($row2['rating'] > 0) { for($i=1; $i<=5; $i++) { if($row2['rating'] >= $i) { $rating .= '<i class="fa fa-star"></i>'; } else { $rating .= '<i class="fa fa-star-o"></i>'; } } $ratingm = '<div class="rating_right">'.$rating.'</div>'; }
		if($usuario['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$usuario['foto']; } else { $foto = 'img/avatar.png'; }
		if($local['nombre']) {
$publicaciones .= '<div class="post" onclick="perfil_ver(\''.$row2['usuario'].'\',\'2\')"><div class="titulo"><img src="'.$foto.'">'.$usuario['nombre'].' '.$usuario['apellido'].' <i class="fa fa-angle-right" aria-hidden="true" style="margin-left:5px; margin-right:5px; color:rgba(255,255,255,0.5)"></i> '.$local['nombre'].'<span>'.$row2['lugar'].'</span></div>'.$imagen.'<div class="texto">'.$row2['texto'].'</div><div class="abajo">'.hace($row2['fechat']).$ratingm.'</div></div>'; }
	}
if(!$publicaciones) { $publicaciones = 0; } else { $publicaciones = $publicaciones;}
	
	$accion = array("publicaciones" => $publicaciones, "boton" => $final_boton);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;
	
	case 'eventos':
	$seguidores = $db->super_query( "SELECT seguidosl FROM usuarios_drink2nite WHERE id = '".$_REQUEST['uid']."'");
	if($seguidores['seguidosl'] != '') { $in = $_REQUEST['uid'].','.$seguidores['seguidosl']; } else { $in = $_REQUEST['uid']; }
	if(!$_REQUEST['pag']) $comienzo = 0;
	$pagina = 10;
	$publicaciones_total_db = $db->query( "SELECT id FROM eventos WHERE id_u IN (".$in.") AND tipo = '2'");
	$cuenta = $db->num_rows($publicaciones_total_db);
	$total = $comienzo*$pagina;
	$ttotal = ($comienzo+1)*$pagina;
	if($ttotal < $cuenta) { $final_boton = '<button>Cargar más</button>'; }
$eventos_db = $db->query( "SELECT * FROM eventos WHERE id_u IN (".$in.") AND tipo = '2' ORDER by id DESC LIMIT ".$total.",".$pagina."");
	while ( $row2 = $db->get_row($eventos_db) ) {
		
		$usuario = $db->super_query( "SELECT nombre, apellido FROM usuarios_drink2nite WHERE id = '".$row2['id_u']."'");
		$local = $db->super_query( "SELECT nombre, logo FROM locales WHERE id = '".$row2['id_l']."'");
		
		if($row2['imagen']) $imagen = '<img src="https://drink2nite.com/subidas/eventos/'.$row2['imagen'].'" class="imagen">'; else $imagen = '';
		if($local['logo']) { $logo = 'https://drink2nite.com/subidas/logos/'.$local['logo']; } else { $logo = 'images/avatar.png'; }
		
		if($row2['propietario'] == 1) { $user_p = 'Propietario'; } else { $user_p = $usuario['nombre'].' '.$usuario['apellido']; }
		
$eventos .= '<div class="post" onclick="local(\''.$row2['id_l'].'\', \''.$local['nombre'].'\')"><div class="titulo"><img src="'.$logo.'" style="border-radius:0;"><span style="font-size:14px; display:block; font-weight:bold; margin-bottom:3px; position:relative; top:-5px;">'.$user_p.'</span>'.$local['nombre'].'<span>'.$row2['lugar'].'</span></div>'.$imagen.'<div class="texto">'.$row2['texto'].'</div>

<div style="overflow:hidden; padding:5px 10px;">
<div class="button-bar" style="width:100%;">
<div class="button-bar__item"><button class="button-bar__button">Asistir</button></div>
<div class="button-bar__item"><button class="button-bar__button">Tal vez</button></div>
<div class="button-bar__item"><button class="button-bar__button">No asistire</button></div>
</div></div>

<div class="abajo" style="padding-left:15px;">'.hace(strtotime($row2['fecha'])).' <span style="margin:0 5px; color:rgba(255,255,255,0.3;">·</span> ¿Cómo llegar? <span style="margin:0 5px; color:rgba(255,255,255,0.3;">·</span> 0 asistirán</div></div>';
	}
if(!$eventos) { $eventos = 0; } else { $eventos = $eventos;}
	
	$accion = array("eventos" => $eventos, "boton" => $final_boton);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'listado_locales':
		$id = $_REQUEST['id'];
		$someArray = [];
		$locales_db = $db->query( "SELECT id, nombre FROM locales WHERE propietario = '".$id."'");
		while ( $row = $db->get_row($locales_db) ) {
			
	array_push($someArray, [
	  'nombre'   => $row['nombre'],
	  'id' => $row['id']
	]);
  }

$accion = json_encode($someArray);
		break;
	
	case 'agregar_local':
function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; } 
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
 }
 	$path = "../subidas/logos/";
	$nombre = $_POST['nombre'];
	$direccion = $_POST['direccion'];
	$ciudad2 = $_POST['ciudad'];
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];
	$hora1 = $_POST['hora1'];
	$hora2 = $_POST['hora2'];
	$telefono = $_POST['telefono'];
	$web = $_POST['web'];
	$categoria = $_POST['categoria'];
	$descripcion = $_POST['descripcion'];
	$id_lugar = $_POST['id'];
	$alt_name = strtolower(str_replace(" ","_",$alt_name));
	$name = $_FILES['logo']['name'];
	$nueva = $db->super_query( "SHOW TABLE STATUS LIKE 'locales'" );
	$id = $nueva['Auto_increment'];
	$ext = getExtension($name);
	if($name) { $logo = time().substr(str_replace(" ", "_", $txt), 5).".".$ext; }
	$tmp = $_FILES['logo']['tmp_name'];
	move_uploaded_file($tmp, $path.$logo);
	$db->query( "INSERT INTO locales (nombre,latitud,longitud,tipo,logo,h_e,h_c,lugar,id_lugar,direccion,descripcion,alt_name,propietario,numero,pagina,activo) values ('{$nombre}', '{$lat}', '{$lng}', '{$categoria}', '{$logo}', '{$hora1}', '{$hora2}', '{$ciudad2}', '{$id_lugar}', '{$direccion}', '{$descripcion}', '{$alt_name}','".$_COOKIE['usuario_drink2nite']."','".$telefono."','".$web."','0')" );
	
	$accion = array("mensaje" => "Hola");
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'ayuda':
	$contenido = '<div style="font-size:12px; padding:0 15px; text-align:justify;">Ayuda desde JSON de Drink2Nite</div>';
	$accion = array("contenido" => $contenido);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'terminos':
	$contenido = '<div style="font-size:12px; padding:0 15px; text-align:justify;">Ayuda desde JSON de Drink2Nite</div>';
	$accion = array("contenido" => $contenido);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'privacidad':
	$contenido = '<div style="font-size:12px; padding:0 15px; text-align:justify;">Drink2Nite desarrolla tecnolog&iacute;as y servicios que permiten que las personas se conecten, creen comunidades y hagan crecer su negocio. Estas Condiciones rigen el uso de Facebook, Messenger y los
    dem&aacute;s productos, funciones, apps, servicios, tecnolog&iacute;as y software que ofrecemos,
    excepto cuando indiquemos expresamente que se aplican otras condiciones (y no estas). Facebook,&nbsp;Inc. te proporciona estos Productos.&nbsp;<br><br>No cobramos por el uso que haces de Facebook ni de los otros productos y servicios que abarcan estas
    Condiciones. Por el contrario, los negocios y las organizaciones nos pagan para que te mostremos anuncios de sus productos y servicios. Al usar nuestros Productos, aceptas que podemos mostrarte anuncios que consideremos que te resultar&aacute;n relevantes
    para ti y tus intereses. Usamos tus datos personales como ayuda para determinar qu&eacute; anuncios mostrarte.&nbsp;<br><br>No vendemos tus datos personales a los anunciantes ni compartimos informaci&oacute;n que te identifique directamente (como
    tu nombre, direcci&oacute;n de correo electr&oacute;nico u otra informaci&oacute;n de contacto) con los anunciantes, a menos que nos des tu permiso expreso. Por el contrario, los anunciantes pueden proporcionarnos datos como el tipo de p&uacute;blico
    que quieren que vea sus anuncios, y nosotros mostramos esos anuncios a las personas que pueden estar interesadas en ellos. Proporcionamos a los anunciantes informes sobre el rendimiento de sus anuncios para ayudarlos a entender c&oacute;mo interact&uacute;an
    las personas con su contenido. Consulta la secci&oacute;n 2 a continuaci&oacute;n para obtener m&aacute;s informaci&oacute;n.&nbsp;<br><br>Nuestra&nbsp;Pol&iacute;tica de datosexplica c&oacute;mo
    recopilamos y usamos tus datos personales para determinar algunos de los anuncios que ves y proporcionar todos los dem&aacute;s servicios que se describen a continuaci&oacute;n. Tambi&eacute;n puedes ir a la&nbsp;configuraci&oacute;n    cuando quieras para revisar las opciones de privacidad que tienes respecto de c&oacute;mo usamos tus datos.</div>';
	$accion = array("contenido" => $contenido);
	$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'locales_cerca':
		$lat = $_REQUEST['lat'];
		$lon = $_REQUEST['lon'];
		$someArray = [];
		$busqueda_db = $db->query( "SELECT (6371 * ACOS( 
									SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
									+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
									* COS(RADIANS(".$lat."))
									)
					   ) AS distance, nombre, logo, lugar, id, h_e, h_c FROM locales ORDER BY distance ASC LIMIT 0,10" );
		
					   while ( $row = $db->get_row($busqueda_db) ) {
						if($row['h_e'] <= date('H:i',time()) and $row['h_c'] >= date('H:i',time())) { $estado = '<b class="c1">Abierto</b>'; } else { $estado = '<b class="c2">	Cerrado</b>'; }
	$valoracion = '';
	$val_db = $db->query( "SELECT valoracion FROM valoracion WHERE local = '".$row['id']."'");
	$cuenta = 0;
	$suma_val = 0;
	while ( $row2 = $db->get_row($val_db) ) {
		$cuenta++;
		$suma_val = $suma_val+$row2['valoracion'];
	}
	$total = $suma_val/$cuenta;
	if($cuenta > 0) { 
		$valoracion2 = round($total,0); 
		for($i=1;$i<=5;$i++) { 
			if($i <= $valoracion2){$valoracion .= '<i class="fa fa-star"></i>';}
			else{$valoracion .= '<i class="fa fa-star-o"></i>';}
		} 
	 } else { $valoracion = 'Sin valoración'; }
	 if(!$row['logo']) { $row['logo'] = 'local.png'; }
						array_push($someArray, [
						  'nombre'   => $row['nombre'],
						  'distancia' => number_format($row['distance'],2),
						  'logo' => $row['logo'],
						  'estado' => $estado,
						  'valoracion' => $valoracion,
						  'lugar' => utf8_decode($row['lugar']),
						  'id' => $row['id']
						]);
					  }

		$accion = json_encode($someArray);
	break;

	case 'promos_cerca':
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
								SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
								+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
								* COS(RADIANS(".$lat."))
								)
				   ) AS distance, locales.id, locales.nombre, promos.imagen FROM locales INNER JOIN promos ON promos.id_l = locales.id ORDER BY distance ASC LIMIT 0,3" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					array_push($someArray, [
					  'imagen'   => $row['imagen'],
					  'nombre'   => $row['nombre'],
					  'id' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
break;

case 'eventos_cerca':
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
								SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
								+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
								* COS(RADIANS(".$lat."))
								)
				   ) AS distance, eventos.id, locales.nombre, locales.logo, eventos.titulo, eventos.fecha_1, eventos.imagen, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, usuarios_drink2nite.foto FROM eventos INNER JOIN locales ON eventos.id_l = locales.id INNER JOIN usuarios_drink2nite ON eventos.id_u = usuarios_drink2nite.id WHERE eventos.tipo = '1' and eventos.imagen != '' and eventos.fecha_2 > '".date('Y-m-d H:m:s',time())."' ORDER BY eventos.fecha_1 ASC, distance ASC LIMIT 0,3" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {

					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }

					$fecha = diac(date('N',strtotime($row['fecha_1']))).' '.date('d',strtotime($row['fecha_1'])).', '.mes(date('n',strtotime($row['fecha_1']))).' '.date('Y g:sa',strtotime($row['fecha_1']));

					array_push($someArray, [
					  'imagen'   => $row['imagen'],
					  'titulo'   => $row['titulo'],
					  'nombre'   => $row['nombre'],
					  'completo'   => $row['completo'],
					  'foto'   => $foto,
					  'logo' => $row['logo'],
					  'fecha_i'   => $fecha,
					  'id' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
break;

case 'seguidores_usuario':
	$id = $_REQUEST['id'];
	$someArray = [];
	$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$id."'" );
	if($row['seguidores']) {
	$busqueda = $db->query( "SELECT * FROM usuarios_drink2nite WHERE id IN (".$row['seguidores'].") ORDER BY id ASC LIMIT 0,3" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'tipo'   => $row['id'],
					  'nombre'   => $row['nombre'],
					  'foto' => $foto,
					  'seguidores'   => $row['seguidores_n'],
					  'id' => $row['id']
					]);
				  }
	}
	$accion = json_encode($someArray);
break;

case 'seguidos_usuario':
	$id = $_REQUEST['id'];
	$someArray = [];
	$row = $db->super_query( "SELECT seguidos FROM usuarios_drink2nite WHERE id = '".$id."'" );
	if($row['seguidos']) {
	$busqueda = $db->query( "SELECT * FROM usuarios_drink2nite WHERE id IN (".$row['seguidos'].") ORDER BY id ASC LIMIT 0,3" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'tipo'   => $row['id'],
					  'nombre'   => $row['nombre'],
					  'foto' => $foto,
					  'seguidores'   => $row['seguidores_n'],
					  'id' => $row['id']
					]);
				  } }

	$accion = json_encode($someArray);
break;

case 'tonightv2':
	$id = $_REQUEST['id'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$member_id = $db->super_query("SELECT bloqueados, bloqueos FROM usuarios_drink2nite WHERE id = '".$id."'");
	if($member_id['bloqueados'] and (!$member_id['bloqueos'])) { $where = 'id NOT IN ('.$id.','.$member_id['bloqueados'].')'; } 
	elseif((!$member_id['bloqueados']) and $member_id['bloqueos']) { $where = 'id NOT IN ('.$id.','.$member_id['bloqueos'].')'; } 
	elseif($member_id['bloqueados'] and $member_id['bloqueos']) { $where = 'id NOT IN ('.$id.','.$member_id['bloqueados'].','.$member_id['bloqueos'].')'; } else { $where = 'id != \''.$id.'\''; }
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, nombre, apellido, correo, seguidos_n, seguidores_n, id, CONCAT(nombre, ' ' ,apellido) AS completo, foto FROM usuarios_drink2nite WHERE ".$where." ORDER BY distance ASC LIMIT 0,5" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'correo'   => $row['correo'],
					  'foto'   => $foto,
					  'distancia'   => number_format($row['distance'],2),
					  'id' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
	break;

	case 'tonightv3':
	$id = $_REQUEST['id'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];

	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, usuarios_drink2nite.id, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, usuarios_drink2nite.foto, venue.id, locales.logo, locales.nombre, venue.fecha, venue.activo, venue.id_l FROM venue INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = venue.usuario INNER JOIN locales ON locales.id = venue.id_l WHERE venue.activo = '1' ORDER BY distance ASC LIMIT 0,5" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {

					/* if(strlen($row['completo']) >= 13) { $row['completo'] = substr($row['completo'], 0, 8).'...'; } else { $row['completo'] = $row['completo']; } */
					if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'local'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'foto' => $foto,
					  'hace' => hace2($row['fecha']),
					  'distancia'   => number_format($row['distance'],2),
					  'id' => $row['id_l'],
					  'id_v' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
	break;

	case 'notificaciones_todas':
	$id = $_REQUEST['id'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$db->query("UPDATE usuarios_drink2nite set notificacion='0' where id='".$id."'"); 
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, usuarios_drink2nite.id, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, notificaciones.venue, notificaciones.propietario, notificaciones.respuesta, notificaciones.fecha, notificaciones.tipo, locales.logo, locales.nombre, locales.id, notificaciones.evento FROM notificaciones INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = notificaciones.propietario INNER JOIN locales ON locales.id = notificaciones.local WHERE notificaciones.user = '".$id."' ORDER BY fecha DESC LIMIT 0,10" );
	
				   while ( $row = $db->get_row($busqueda) ) {
					$titulo = $row['nombre'];
					if(!$row['logo']) { $row['logo'] = 'local.png'; }
					
					if($row['evento']) { 
						$row2 = $db->super_query( "SELECT titulo FROM eventos WHERE id = '".$row['evento']."'" ); 
						if($row['tipo'] != 10) { $titulo = $row2['titulo']; } else { $titulo2 = $row2['titulo']; }
						
					}

					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'local'   => $titulo,
					  'logo' => $row['logo'],
					  'tipo' => $row['tipo'],
					  'titulo' => $titulo2,
					  'respuesta' => $row['respuesta'],
					  'hace' => hace($row['fecha']),
					  'distancia'   => number_format($row['distance'],2),
					  'id_l' => $row['id'],
					  'id_e' => $row['evento'],
					  'id' => $row['venue']
					]);
				  }

	$accion = json_encode($someArray);
	break;

	case 'venue_info':
	$id = $_REQUEST['id'];
	$id_u = $_REQUEST['id_u'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];
	$i = 0;
	$someArray = [];
	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, usuarios_drink2nite.id, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, locales.logo, locales.latitud, locales.longitud, locales.nombre, venue.fecha, venue.activo, venue.id_l, locales.descripcion, locales.lugar, locales.direccion FROM venue INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = venue.usuario INNER JOIN locales ON locales.id = venue.id_l WHERE venue.id = '".$id."'" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if(!$row['logo']) { $row['logo'] = 'local.png'; }
					if(!$row['descripcion']) {
						$row['descripcion'] = $row['direccion'];
					} else {
						$row['descripcion'] = $row['descripcion'].'<br>'.$row['direccion'];
					}

					$venue_db = $db->query( "SELECT id FROM asistencia WHERE id_v = '".$id."'" );
		
					   while ( $row2 = $db->get_row($venue_db) ) {
							$i++;
					}  

					$row2 = $db->super_query( "SELECT asistencia FROM asistencia WHERE id_v = '".$id."' AND id_u = '".$id_u."' ORDER BY id DESC" );
					if(!$row2['asistencia']) $row2['asistencia'] = 0;
					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'local'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'hace' => hace($row['fecha']),
					  'activo' => $row['activo'],
					  'latitud' => $row['latitud'],
					  'longitud' => $row['longitud'],
					  'descripcion' => $row['descripcion'],
					  'distancia'   => number_format($row['distance'],2),
					  'asistencia' => $row2['asistencia'],
					  'cantidad' => $i,
					  'id' => $row['id_l'],
					  'id_u' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
	break;

	case 'asistir_venue':
	$id = $_REQUEST['id'];
	$uid = $_REQUEST['uid'];
	$tipo = $_REQUEST['tipo'];
	$db->query( "INSERT INTO asistencia (id_v, id_u, asistencia) values ('{$id}','{$uid}','{$tipo}')" );
	$row = $db->super_query( "SELECT locales.nombre, venue.usuario, venue.id_l FROM venue INNER JOIN locales ON locales.id = venue.id_l WHERE venue.id = '".$id."'" );
	$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$row['usuario']."', '2', '".time()."', '".$uid."', '".$row['id_l']."', '".$id."', '".$tipo."')" );
	$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$row['usuario']."'"); 

	if($uid != $row['usuario'] and $tipo != 4) {
		$row2 = $db->super_query( "SELECT nombre FROM usuarios_drink2nite WHERE id = '".$uid."'");
		enviar_push_t($row['nombre'],$row2['nombre'].' acaba de confirmar en tu check in de este local',''.$row['usuario'].'','2',''.$id.'',''.$row['nombre'].'');
	}

		$accion = 1;
		$accion = array("mensaje" => $accion);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'asistir_evento':
		$id = $_REQUEST['id'];
		$uid = $_REQUEST['uid'];
		$tipo = $_REQUEST['tipo'];
		$invitado = $_REQUEST['invitado'];
		$db->query( "INSERT INTO invitaciones (id_e, id_u, asistencia) values ('{$id}','{$uid}','{$tipo}')" );
		$row = $db->super_query( "SELECT locales.nombre, eventos.titulo, eventos.id_u, eventos.id_l FROM eventos INNER JOIN locales ON locales.id = eventos.id_l WHERE eventos.id = '".$id."'" );
		$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, evento, respuesta) values ('".$row['id_u']."', '8', '".time()."', '".$uid."', '".$row['id_l']."', '".$id."', '".$tipo."')" );
		$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$row['id_u']."'"); 
		$db->query("UPDATE eventos set aceptado=aceptado+1 where id='".$id."'"); 
		$db->query("DELETE FROM notificaciones WHERE tipo = '10' AND user='".$uid. "' AND evento='".$id. "'");
		if($uid != $row['id_u'] and $tipo != 4) {
			$row2 = $db->super_query( "SELECT nombre FROM usuarios_drink2nite WHERE id = '".$uid."'");
			enviar_push_t($row['titulo'],$row2['nombre'].' acaba de confirmar en tu evento del local '.$row['nombre'],''.$row['id_u'].'','2',''.$id.'',''.$row['nombre'].'');
		}
	
			$accion = 1;
			$accion = array("mensaje" => $accion);
			$accion = $_GET['callback'].'('.json_encode($accion).')';
		break;

	case 'asistencia_todas':
		$id = $_REQUEST['id'];
		$someArray = [];
		$busqueda = $db->query( "SELECT CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, asistencia.asistencia, asistencia.id_u, usuarios_drink2nite.foto FROM asistencia INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = asistencia.id_u WHERE asistencia.id_v = '".$id."' ORDER BY asistencia.id DESC" );
		
					   while ( $row = $db->get_row($busqueda_db) ) {
						if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
						array_push($someArray, [
						  'completo'   => $row['completo'],
						  'asistencia'   => $row['asistencia'],
						  'foto' => $foto,
						  'id'   => $row['id_u']
						]);
					  }
	
		$accion = json_encode($someArray);
		break;

		case 'miseventos':
			$id = $_REQUEST['id'];
			$lat = $_REQUEST['lat'];
			$lon = $_REQUEST['lon'];
		
			$someArray = [];
			$busqueda_db = $db->query( "SELECT (6371 * ACOS( 
				SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
				+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
				* COS(RADIANS(".$lat."))
				)
		) AS distance, eventos.id, locales.logo, locales.direccion, locales.nombre, eventos.titulo, eventos.fecha_1, eventos.fecha_2, eventos.imagen, eventos.id_l FROM eventos INNER JOIN locales ON locales.id = eventos.id_l WHERE eventos.id_u = '".$id."' ORDER BY eventos.fecha_1 DESC" );
			
						   while ( $row = $db->get_row($busqueda_db) ) {
							if(!$row['logo']) { $row['logo'] = 'local.png'; }
							
							$row2 = $db->super_query( "SELECT COUNT(*) total FROM invitaciones WHERE id_e = '".$row['id']."' AND asistencia != '0'" );
							$row3 = $db->super_query( "SELECT COUNT(*) total FROM comentarios WHERE id_e = '".$row['id']."'" );
							if(date('Y/m/d H:i:s',strtotime($row['fecha_2'])) < date('Y/m/d H:i:s',time())) { $terminado = 1; } else { $terminado = 0; }
							array_push($someArray, [
							  'local'   => $row['nombre'],
							  'logo' => $row['logo'],
							  'imagen' => $row['imagen'],
							  'direccion' => $row['direccion'],
							  'titulo' => $row['titulo'],
							  'asistencia' => $row2['total'],
							  'chat' => $row3['total'],
							  'fecha' => date('d/m/Y H:i',strtotime($row['fecha_1'])),
							  'fechac' => date('Y/m/d H:i:s',strtotime($row['fecha_2'])),
							  'distancia'   => number_format($row['distance'],2),
							  'terminado' => $terminado,
							  'id' => $row['id_l'],
							  'id_e' => $row['id']
							]);
						  }
		
			$accion = json_encode($someArray);
			break;

		case 'misvenues':
	$id = $_REQUEST['id'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];

	$someArray = [];
	$busqueda_db = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, usuarios_drink2nite.id, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, venue.id, locales.logo, locales.direccion, locales.nombre, venue.fecha, venue.activo, venue.id_l FROM venue INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = venue.usuario INNER JOIN locales ON locales.id = venue.id_l WHERE venue.usuario = '".$id."' ORDER BY venue.id DESC" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					if(!$row['logo']) { $row['logo'] = 'local.png'; }
					
					$row2 = $db->super_query( "SELECT COUNT(*) total FROM asistencia WHERE id_v = '".$row['id']."'" );
					$row3 = $db->super_query( "SELECT COUNT(*) total FROM chat WHERE id_v = '".$row['id']."'" );

					array_push($someArray, [
					  'completo'   => $row['completo'],
					  'local'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'activo' => $row['activo'],
					  'direccion' => $row['direccion'],
					  'asistencia' => $row2['total'],
					  'chat' => $row3['total'],
					  'hace' => hace($row['fecha']),
					  'distancia'   => number_format($row['distance'],2),
					  'id' => $row['id_l'],
					  'id_v' => $row['id']
					]);
				  }

	$accion = json_encode($someArray);
	break;

	case 'misfavoritos':
	$id = $_REQUEST['id'];
	$lat = $_REQUEST['lat'];
	$lon = $_REQUEST['lon'];

	$someArray = [];

	$row = $db->super_query( "SELECT favoritos FROM usuarios_drink2nite WHERE id = '".$id."'" );

	if($row['favoritos']) {

	$busqueda = $db->query( "SELECT (6371 * ACOS( 
		SIN(RADIANS(latitud)) * SIN(RADIANS(".$lat.")) 
		+ COS(RADIANS(longitud - ".$lon.")) * COS(RADIANS(latitud)) 
		* COS(RADIANS(".$lat."))
		)
) AS distance, logo, nombre, id, direccion FROM locales WHERE id IN (".$row['favoritos'].") ORDER BY distance ASC" );
	
				   while ( $row = $db->get_row($busqueda_db) ) {
					
					array_push($someArray, [
					  'nombre'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'direccion' => $row['direccion'],
					  'distancia'   => number_format($row['distance'],2),
					  'id' => $row['id']
					]);
				  }
				}
	$accion = json_encode($someArray);
	break;

	case 'mislocales':
	$id = $_REQUEST['id'];

	$someArray = [];

	$locales_db = $db->query( "SELECT nombre, id, logo, direccion, descripcion, lugar, latitud, longitud FROM locales WHERE propietario = '".$id."'" );

	while ( $row = $db->get_row($locales_db) ) {
		if(!$row['descripcion']) {
			$row['descripcion'] = $row['direccion'];
		}			if(!$row['logo']) { $row['logo'] = 'local.png'; }
					array_push($someArray, [
					  'nombre'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'descripcion' => $row['descripcion'],
					  'lugar' => $row['lugar'],
					  'latitud' => $row['latitud'],
					  'longitud' => $row['longitud'],
					  'id' => $row['id']
					]);
				  
				}
	$accion = json_encode($someArray);
	break;

	case 'mispromos':
		$id = $_REQUEST['id'];
	
		$someArray = [];
	
		$locales_db = $db->query( "SELECT promos.id, promos.imagen, locales.nombre, locales.logo, locales.id as id_l FROM promos INNER JOIN locales ON locales.id = promos.id_l WHERE locales.propietario = '".$id."'" );
	
		while ( $row = $db->get_row($locales_db) ) {
			if(!$row['logo']) { $row['logo'] = 'local.png'; }
						array_push($someArray, [
						  'nombre'   => $row['nombre'],
						  'logo' => $row['logo'],
						  'imagen' => $row['imagen'],
						  'id_l' => $row['id_l'],
						  'id' => $row['id']
						]);
					  
					}
		$accion = json_encode($someArray);
		break;

	case 'chat_venue':
	$id = $_REQUEST['id'];

	$someArray = [];

	$chat_db = $db->query( "SELECT CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, chat.mensaje, chat.fechac, usuarios_drink2nite.foto, chat.id FROM chat INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = chat.id_u WHERE chat.id_v = '".$id."'" );

	while ( $row = $db->get_row($chat_db) ) {
		if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }
					array_push($someArray, [
					  'nombre'   => $row['completo'],
					  'texto' => $row['mensaje'],
					  'foto' => $foto,
					  'fechac' => hace($row['fechac']),
					  'id' => $row['id']
					]);
				  
				}
	$accion = json_encode($someArray);
	break;

	case 'escribir_chat':
	$texto = utf8_encode($_REQUEST['texto']);
	$id_u = $_REQUEST['id_u'];
	$id = $_REQUEST['id'];
	$fechac = time();
	$fecha = date('Y-m-d',$fechac);
	$db->query( "INSERT INTO chat (id_v, id_u, mensaje, fecha, fechac) values ('{$id}','{$id_u}','{$texto}','{$fecha}','{$fechac}')" );
	$someArray = [];

	$chat_db = $db->query( "SELECT CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo, chat.mensaje, chat.fechac, chat.id, usuarios_drink2nite.foto FROM chat INNER JOIN usuarios_drink2nite ON usuarios_drink2nite.id = chat.id_u WHERE chat.id_v = '".$id."'" );

	while ( $row = $db->get_row($chat_db) ) {	
		if($row['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $foto = 'img/avatar.png'; }		
					array_push($someArray, [
					  'nombre'   => $row['completo'],
					  'texto' => $row['mensaje'],
					  'fechac' => hace($row['fechac']),
					  'foto' => $foto,
					  'id' => $row['id']
					]);
				  
				}

	$row2 = $db->super_query( "SELECT seguidores, nombre FROM usuarios_drink2nite WHERE id = '".$id_u."'");
	$row3 = $db->super_query( "SELECT venue.id_l, locales.nombre, venue.usuario FROM venue INNER JOIN locales ON locales.id = venue.id_l WHERE venue.id = '".$id."'");
	$u = 0;
	if($row2['seguidores']) {
		$list = explode( ",", $row2['seguidores'] );
			foreach ( $list as $daten ) {
				if($daten == $row3['usuario']) { $u++; }
				$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, venue, respuesta) values ('".$daten."', '5', '".$fechac."', '".$id_u."', '".$row3['id_l']."', '".$id."', '')" );
				$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'");
				enviar_push_t($row3['nombre'],$row2['nombre'].' acaba de escribir en el chat del check in de este local',''.$daten.'','2',''.$id.'',''.$row3['nombre'].'');
			}
	}
	if($u == 0 and $id_u != $row3['usuario']) {
		enviar_push_t($row3['nombre'],$row2['nombre'].' acaba de escribir en tu check in de este local',''.$row3['usuario'].'','2',''.$id.'',''.$row3['nombre'].'');
	}
	$accion = json_encode($someArray);
	break;

	case 'editar_cuenta':
	function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; } 
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
	}
	$file = $_FILES['imagen']['name'];
	$nombre = $_POST['nombre'];
	$apellido = $_POST['apellido'];
	$email = $_POST['email'];
	$id = $_REQUEST['id'];
	if($file) {
		$ext = getExtension($file);
		$archivo_final = substr(md5($file.time()),0,8);
		$archivo = $archivo_final.'.'.$ext;
		move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/avatar/".$archivo);
		$db->query("UPDATE usuarios_drink2nite set nombre='".$nombre."', apellido='".$apellido."', foto='".$archivo."', correo='".$email."' where id='".$id."'");
	} else {
		$db->query("UPDATE usuarios_drink2nite set nombre='".$nombre."', apellido='".$apellido."', correo='".$email."' where id='".$id."'");
	}
	if (preg_match('/^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/', $email)) {
		$accion = '1';
	  } else {
		$accion = '0';
	  }
	  $accion = $_GET['callback'].'('.json_encode($accion).')';
	
	break;

	case 'datos_local':
	$id = $_REQUEST['id'];

	$someArray = [];

	$local_db = $db->query( "SELECT * FROM locales WHERE id = '".$id."'" );

	while ( $row = $db->get_row($local_db) ) {
		if(!$row['logo']) { $row['logo'] = 'local.png'; }
					array_push($someArray, [
					  'nombre'   => $row['nombre'],
					  'logo' => $row['logo'],
					  'h_e' => $row['h_e'],
					  'h_c' => $row['h_c'],
					  'direccion' => $row['direccion'],
					  'descripcion' => $row['descripcion'],
					  'numero' => $row['numero'],
					  'pagina' => $row['pagina'],
					  'id' => $row['id']
					]);
				  
				}
	$accion = json_encode($someArray);
	break;

	case 'editar_local':
	function getExtension($str) {
         $i = strrpos($str,".");
         if (!$i) { return ""; } 
         $l = strlen($str) - $i;
         $ext = substr($str,$i+1,$l);
         return $ext;
	}
	$file = $_FILES['imagen']['name'];
	
	$nombre = $_POST['nombre'];
	$direccion = $_POST['direccion'];
	$descripcion = $_POST['descripcion'];
	$h_e = $_POST['h_e'];
	$h_c = $_POST['h_c'];
	$telefono = $_POST['telefono'];
	$pagina = $_POST['pagina'];
	$id = $_POST['id_local'];
	if($file) {
		$ext = getExtension($file);
		$archivo_final = md5($file.time());
		$archivo = $archivo_final.'.'.$ext;
		move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/locales/".$archivo);
		$db->query("UPDATE locales set nombre='".$nombre."', direccion='".$direccion."', descripcion='".$descripcion."', h_e='".$h_e."', h_c='".$h_c."', numero='".$telefono."', pagina='".$pagina."', logo='".$archivo."' where id='".$id."'");
	} else {
		$db->query("UPDATE locales set nombre='".$nombre."', direccion='".$direccion."', descripcion='".$descripcion."', h_e='".$h_e."', h_c='".$h_c."', numero='".$telefono."', pagina='".$pagina."' where id='".$id."'");
	}
		$accion = '1';
	  
	  $accion = $_GET['callback'].'('.json_encode($accion).')';
	
	break;

	case 'eliminar_local':
	$id = $_REQUEST['id'];
	$db->query("DELETE FROM locales WHERE id='".$id. "'");
	$db->query("DELETE FROM venue WHERE id_l='".$id. "'");
	$db->query("DELETE FROM publicaciones WHERE a ='".$id. "'");
		$accion = 1;
		$accion = array("mensaje" => $accion);
		$accion = $_GET['callback'].'('.json_encode($accion).')';
	break;

	case 'guardar_promo':
		function getExtension($str) {
			 $i = strrpos($str,".");
			 if (!$i) { return ""; } 
			 $l = strlen($str) - $i;
			 $ext = substr($str,$i+1,$l);
			 return $ext;
		}
		$file = $_FILES['imagen']['name'];
		
		$local = $_POST['locales-select'];
		if($file) {
			$ext = getExtension($file);
			$archivo_final = md5($file.time());
			$archivo = $archivo_final.'.'.$ext;
			move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/promos/".$archivo);
			$db->query( "INSERT INTO promos (id_l, imagen, estado) values ('{$local}','{$archivo}','1')" );
			$accion = '1';
		} else {
			$accion = 0;
		}
		
		$accion = $_GET['callback'].'('.json_encode($accion).')';
		
		break;

		case 'eliminar_promo':
			$id = $_REQUEST['id'];
			$row = $db->super_query( "SELECT imagen FROM promos WHERE id = '".$id."'");
			unlink('../subidas/promos/'.$row['imagen'].'');
			$db->query("DELETE FROM promos WHERE id='".$id. "'");
				$accion = 1;
				$accion = array("mensaje" => $accion);
				$accion = $_GET['callback'].'('.json_encode($accion).')';
			break;

			case 'actualizar_promo':
				function getExtension($str) {
					 $i = strrpos($str,".");
					 if (!$i) { return ""; } 
					 $l = strlen($str) - $i;
					 $ext = substr($str,$i+1,$l);
					 return $ext;
				}
				$file = $_FILES['imagen']['name'];
				
				$id = $_POST['id_promo'];
				$row = $db->super_query( "SELECT imagen FROM promos WHERE id = '".$id."'");
				unlink('../subidas/promos/'.$row['imagen'].'');
				if($file) {
					$ext = getExtension($file);
					$archivo_final = md5($file.time());
					$archivo = $archivo_final.'.'.$ext;
					move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/promos/".$archivo);
					$db->query("UPDATE promos set imagen='".$archivo."' where id='".$id."'");
					$accion = '1';
				} else {
					$accion = 0;
				}
				
				$accion = $_GET['callback'].'('.json_encode($accion).')';
				
				break;

				case 'ip':
					$accion = array("ip" => $_SERVER['REMOTE_ADDR']);
					
					$accion = $_GET['callback'].'('.json_encode($accion).')';
					
					break;

			case 'localesn':
				
				$db->query("UPDATE usuarios_drink2nite set latitud='".$_REQUEST['latitud']."', longitud='".$_REQUEST['longitud']."' where id='".$_REQUEST['id']."'"); 
					
				$busqueda_db = $db->query( "SELECT id, nombre, latitud, longitud, tipo, logo, (6371 * ACOS( SIN(RADIANS(latitud)) * SIN(RADIANS(".$_REQUEST['latitud'].")) + COS(RADIANS(longitud - ".$_REQUEST['longitud'].")) * COS(RADIANS(latitud)) * COS(RADIANS(".$_REQUEST['latitud']."))) ) AS distance FROM locales HAVING distance < 10 ORDER BY distance ASC" );
				
				while ( $row = $db->get_row($busqueda_db) ) {
					$venue = $db->super_query( "SELECT id, usuario FROM venue WHERE id_l = '".$row['id']."' AND usuario = '".$_REQUEST['id']."' AND activo = '1'");
					if($row['logo']) { $logo_url = 'https://www.drink2nite.com/subidas/logos/'.$row['logo']; $logo = foto($logo_url); }else {$logo = 'https://www.drink2nite.com/subidas/logos/local.png'; $row['logo'] = 'local.png'; } 
					if($row['tipo'] == 1) { if($venue['id'] == 0) { $icono = "img/bar_i.png"; } else { $icono = "img/vbar_i.png"; }  }
					if($row['tipo'] == 2) { if($venue['id'] == 0) { $icono = "img/club_i.png"; } else { $icono = "img/vclub_i.png"; } }
					if($venue['id'] != 0) { $sd1 = ' style="display:none;"'; $sd2 = ''; } else { $sd1 = ''; $sd2 = ' style="display:none;"'; }
					if($venue['usuario'] != $_REQUEST['id'] and $venue['id'] != 0) { $sd1 = ' style="display:none;"'; $sd2 = ' style="display:none;"'; }
					
					/* $accion[] = array("id" => $row['id'], "latitude" => $row['latitud'], "longitude" => $row['longitud'], "icon" => $icono, "logo" => $logo, "nombre" => $row['nombre'], "distancia" => number_format($row['distance'],2), "baloon_text" => '<div class="burbuja"><b style="display:block; text-align:center; margin-bottom:5px;">'.$row['nombre'].' <span>('.number_format($row['distance'],1).'km)</span></b><div style="width:210px;"><div class="button-bar" style="width:210px;"><div class="button-bar__item"><button class="button-bar__button" onclick="venue(\''.$row['id'].'\')" '.$sd1.'id="venue'.$row['id'].'">Venue</button><button class="button-bar__button nvenue" onclick="venue2(\''.$row['id'].'\')" '.$sd2.'id="nvenue'.$row['id'].'">No Venue</button></div><div class="button-bar__item"><button class="button-bar__button" onclick="local(\''.$row['id'].'\', \''.$row['nombre'].'\')">Detalles</button></div></div></div></div>'); */
					$rowe = $db->super_query( "SELECT id, titulo FROM eventos WHERE id_l = '".$row['id']."' AND id_u = '".$_REQUEST['id']."' AND fecha_2 >= '".date('Y-m-d H:i:s',time())."'");
						if($rowe['id']) {
							$icentro = '<button class="fab fab--mini" onclick="ver_evento(\''.$rowe['id'].'\', \''.$rowe['titulo'].'\')"><i class="zmdi zmdi-drink"></i></button> <button class="fab fab--material fab-centro" onclick="invitar_evento(\''.$rowe['id'].'\')"><i class="zmdi zmdi-accounts-add"></i></button>';
						} else {
							$icentro = '<button class="fab fab--mini" onclick="venue(\''.$row['id'].'\')" '.$sd1.'id="venue'.$row['id'].'"><i class="zmdi zmdi-pin-drop"></i></button><button class="fab fab--mini activo" onclick="venue2(\''.$row['id'].'\')" '.$sd2.'id="nvenue'.$row['id'].'"><i class="zmdi zmdi-pin-drop"></i></button> <button class="fab fab--material fab-centro" onclick="crear_evento(\''.$row['id'].'\', \'https://drink2nite.com/subidas/logos/'.$row['logo'].'\')"><i class="zmdi zmdi-plus"></i></button>';
						}

					$accion[] = array("id" => $row['id'], "latitude" => $row['latitud'], "longitude" => $row['longitud'], "icon" => $icono, "logo" => $logo, "nombre" => $row['nombre'], "distancia" => number_format($row['distance'],2), "baloon_text" => '<div class="local_drink2nite"><img src="https://drink2nite.com/subidas/logos/'.$row['logo'].'"><span>'.$row['nombre'].'</span></div>'.$icentro.' <button class="fab fab--mini" onclick="local(\''.$row['id'].'\', \''.$row['nombre'].'\')"><i class="zmdi zmdi-store"></i></button>');
						
					$temp = $row['distance'];
				}
				$datos = $db->super_query( "SELECT nombre, apellido, sexo, foto FROM usuarios_drink2nite WHERE id = '".$_REQUEST['id']."'");
				if($datos['sexo'] == 1 || $datos['sexo'] == 0) { $icon_u = 'img/user.png'; } else { $icon_u = 'img/user1.png'; }
					
				if($_REQUEST['id'] != 'undefined') { 
					if($datos['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$datos['foto']; } else { $foto = 'img/avatar.png'; }
					$baloon = '<div style="margin-bottom:50px;"><div class="local_drink2nite" style="position:relative; top:35px;"><img src="'.$foto.'"><span>'.$datos['nombre'].'</span></div><button class="button button--material" onclick="nuevo()" style="position:relative; top:35px;"><i class="fa fa-plus"></i> Agregar nuevo local</button></div>'; } else { $baloon = '<div class="burbuja" style="margin-bottom:60px;"><button class="button button--material" onclick="login_inicio()" style="background:#009900; position:relative; top:60px;"><i class="fa fa-user"></i> Iniciar sesión</button></div>'; }
				
				$accion[] = array("latitude" => $_REQUEST['latitud'], "longitude" => $_REQUEST['longitud'], "icon" => $icon_u, "logo" => "", "nombre" => "", "distancia" => "", "baloon_text" => $baloon);
				$accion = $_GET['callback'].'('.json_encode($accion).')';
				
			break;

			case 'agregar_evento':

				function getExtension($str) {
					$i = strrpos($str,".");
					if (!$i) { return ""; } 
					$l = strlen($str) - $i;
					$ext = substr($str,$i+1,$l);
					return $ext;
			   }
			   $file = $_FILES['imagen']['name'];
			   
			   if($file) {
				   $ext = getExtension($file);
				   $archivo_final = md5($file.time());
				   $archivo = $archivo_final.'.'.$ext;
				   move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/eventos/".$archivo);
			   }
			   
				$nombre = $_POST['nombre'];
				$descripcion = $_POST['descripcion'];
				$tipo = $_POST['tipo'];
				$comentar = $_POST['comentar'];
				$hora = $_POST['hora'];
				$fecha = $_POST['fecha'];
				$id = $_POST['id_local'];
				$id_u = $_REQUEST['id_u'];
				$fecha1 = $fecha.' '.$hora.':00';
				$fechaf = $_POST['fecha2'];
				$horaf = $_POST['hora2'];
				$fecha2f = $fechaf.' '.$horaf.':00';
				$fechat = time();

				$db->query( "INSERT INTO eventos (titulo, texto, fecha, comentar, fecha_1, fecha_2, tipo, id_l, id_u, fecha_t, imagen) values ('{$nombre}','{$descripcion}','{$fecha}','{$comentar}','{$fecha1}','{$fecha2f}', '{$tipo}', '{$id}', '{$id_u}', '{$fechat}', '{$archivo}')" );

				$row2 = $db->super_query( "SELECT id, titulo FROM eventos WHERE id_u = '".$id_u."' and fecha_t = '".$fechat."'");
				$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$id_u."'");
				if($row['seguidores']) {
					$fecha2 = time();
					$list = explode( ",", $row['seguidores'] );
					foreach ( $list as $daten ) {
						$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, evento, respuesta) values ('".$daten."', '7', '".$fecha2."', '".$id_u."', '".$id."', '".$row2['id']."', '')" );
						$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$daten."'");
						$row3 = $db->super_query( "SELECT nombre FROM locales WHERE id = '".$id."'");
						enviar_push_t('Evento',$_POST['usuario_nombre'].' acaba de crear un evento en '.$row3['nombre'],''.$daten.'','1',''.$row2['id'].'',''.$row2['titulo'].'');
					}
				}
				$accion[] = array("id" => $row2['id'], "titulo" => $row2['titulo']);
				$accion = $_GET['callback'].'('.json_encode($accion).')';
				
				break;

				case 'modificar_evento':

					function getExtension($str) {
						$i = strrpos($str,".");
						if (!$i) { return ""; } 
						$l = strlen($str) - $i;
						$ext = substr($str,$i+1,$l);
						return $ext;
				   }
				   $file = $_FILES['imagen']['name'];

				$id = $_POST['id_evento'];
				
				$row = $db->super_query( "SELECT imagen, titulo FROM eventos WHERE id = '".$id."'");
				   if($file) {
						unlink('../subidas/eventos/'.$row['imagen'].'');
					   $ext = getExtension($file);
					   $archivo_final = md5($file.time());
					   $archivo = $archivo_final.'.'.$ext;
					   move_uploaded_file($_FILES['imagen']['tmp_name'],"../subidas/eventos/".$archivo);
				   } else {
					   $archivo = $row['imagen'];
				   }
				   
					$nombre = $_POST['nombre'];
					$descripcion = $_POST['descripcion'];
					$tipo = $_POST['tipo'];
					$comentar = $_POST['comentar'];
					$hora = $_POST['hora'];
					$fecha = $_POST['fecha'];
					$id_u = $_REQUEST['id_u'];
					$fecha1 = $fecha.' '.$hora.':00';
					$fechaf = $_POST['fecha2'];
					$horaf = $_POST['hora2'];
					$fecha2f = $fechaf.' '.$horaf.':00';
					$fechat = time();
				   
					$db->query("UPDATE eventos set titulo='".$nombre."', texto='".$descripcion."', fecha='".$fecha."', comentar='".$comentar."', fecha_1='".$fecha1."', fecha_2='".$fecha2f."', tipo='".$tipo."', imagen='".$archivo."' where id='".$id."'");
	
					$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$id_u."'");
					if($row['seguidores']) {
						$fecha2 = time();
						$list = explode( ",", $row['seguidores'] );
						foreach ( $list as $daten ) {
							$row3 = $db->super_query( "SELECT nombre FROM locales WHERE id = '".$id."'");
							enviar_push_t('Evento',$_POST['usuario_nombre'].' acaba de modificar el evento '.$row['titulo'],''.$daten.'','1',''.$id.'',''.$nombre.'');
						}
					}
					$accion[] = array("id" => $id, "titulo" => $row['titulo']);
					$accion = $_GET['callback'].'('.json_encode($accion).')';
					
					break;

				case 'evento':
					$id = $_REQUEST['id'];
					$id_u = $_REQUEST['uid'];
					$lat = $_REQUEST['lat'];
					$lon = $_REQUEST['lon'];
					$row = $db->super_query( "SELECT (6371 * ACOS( 
						SIN(RADIANS(locales.latitud)) * SIN(RADIANS(".$lat.")) 
						+ COS(RADIANS(locales.longitud - ".$lon.")) * COS(RADIANS(locales.latitud)) 
						* COS(RADIANS(".$lat."))
						)
				) AS distance, locales.logo, locales.nombre, locales.lugar, locales.direccion, locales.descripcion, locales.id as id_l, locales.latitud, locales.longitud, eventos.id, eventos.titulo, eventos.texto, eventos.fecha_1, eventos.fecha_2, eventos.fecha_t, eventos.tipo, eventos.invitados, eventos.aceptado, eventos.imagen, eventos.id_u, usuarios_drink2nite.foto, CONCAT(usuarios_drink2nite.nombre, ' ' ,usuarios_drink2nite.apellido) AS completo FROM eventos INNER JOIN locales ON eventos.id_l = locales.id INNER JOIN usuarios_drink2nite ON eventos.id_u = usuarios_drink2nite.id WHERE eventos.id = '".$id."'" );
					if($row['logo']) { $logo = 'https://drink2nite.com/subidas/logos/'.$row['logo']; } else { $logo = 'https://drink2nite.com/subidas/logos/local.png'; }
					$cc = 0;
					$publicaciones_db = $db->query( "SELECT * FROM comentarios WHERE id_e = '".$id."' AND tipo = '0' ORDER by id DESC LIMIT 0,10");
					while ( $row2 = $db->get_row($publicaciones_db) ) {
						$cc++;
						$usuario = $db->super_query( "SELECT nombre, apellido, foto FROM usuarios_drink2nite WHERE id = '".$row2['id_u']."'");
						if($row2['imagen']) $imagen = '<img src="https://drink2nite.com/subidas/locales/'.$row2['imagen'].'" class="imagen">'; else $imagen = '';
						
						if($usuario['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$usuario['foto']; } else { $foto = 'img/avatar.png'; }
				$publicaciones .= '<div class="post" onclick="perfil_ver(\''.$row2['usuario'].'\',\''.$tipo.'\')"><div class="titulo"><img src="'.$foto.'">'.$usuario['nombre'].' '.$usuario['apellido'].'<span>'.$row2['lugar'].'</span></div>'.$imagen.'<div class="texto">'.$row2['texto'].'</div><div class="abajo">'.hace($row2['fechat']).'</div></div>';
					}
				if(!$publicaciones) { $publicaciones = '<div style="padding:20px; text-align:center;" id="no_hay_comentarios">No se encontraron comentarios</div>'; }
				
				
					if ( $row['imagen'] ) {
						$promo .= '<ons-carousel-item><img src="https://drink2nite.com/subidas/eventos/'.$row['imagen'].'" style="width: 100%; border-radius:3px;"> </ons-carousel-item>';
						$promo2 .= 'https://drink2nite.com/subidas/eventos/'.$row['imagen'];
					}

					if(date('m',strtotime($row['fecha_1'])) == date('m',strtotime($row['fecha_2']))) { $fecha = diac(date('N',strtotime($row['fecha_1']))).' '.date('d',strtotime($row['fecha_1'])).', '.mesc(date('n',strtotime($row['fecha_1']))).' '.date('Y g:sa',strtotime($row['fecha_1'])).' al '.diac(date('N',strtotime($row['fecha_2']))).' '.date('d g:sa',strtotime($row['fecha_2'])); 
					
					} else {

						$fecha = diac(date('N',strtotime($row['fecha_1']))).' '.date('d',strtotime($row['fecha_1'])).', '.mesc(date('n',strtotime($row['fecha_1']))).' '.date('Y g:sa',strtotime($row['fecha_1'])).' al '.diac(date('N',strtotime($row['fecha_2']))).' '.date('d',strtotime($row['fecha_2'])).', '.mesc(date('n',strtotime($row['fecha_2']))).' '.date('Y g:sa',strtotime($row['fecha_2']));
					}
					if($row['foto']) { $fotop = 'https://drink2nite.com/subidas/avatar/'.$row['foto']; } else { $fotop = 'img/avatar.png'; }
					$autor = '<img src="'.$fotop.'" style="width:25px; border-radius:30px;"> <span style="position:relative; padding-left:7px; top:-6px;">'.$row['completo'].'</span>';

					$row2 = $db->super_query( "SELECT asistencia, invitado FROM invitaciones WHERE id_e = '".$id."' AND id_u = '".$id_u."' ORDER BY id DESC" );
					if(!$row2['asistencia']) $row2['asistencia'] = 0;

					$evento = array(
					'titulo' => $row['titulo'],
					'descripcion' => $row['texto'],
					'localizacion' => $row['direccion'],
					'fecha_inicio' => date('Y-m-d',strtotime($row['fecha_1'])), // Fecha de inicio de evento en formato AAAA-MM-DD
					'hora_inicio'=>date('H:m',strtotime($row['fecha_1'])), // Hora Inicio del evento
					'fecha_fin'=>date('Y-m-d',strtotime($row['fecha_2'])), // Fecha de fin de evento en formato AAAA-MM-DD
					'hora_fin'=>date('H:m',strtotime($row['fecha_2'])), // Hora final del evento
					'nombre'=>'Drink2Nite', // Nombre del sitio
					'url'=>'www.drink2nite.com' // Url de la página
					  );
					  $m1 = date('n',strtotime($row['fecha_1']))-1;
					  $m2 = date('n',strtotime($row['fecha_2']))-1;
					  $fecha1_f = date('Y-m-d',strtotime($row['fecha_1']));
					  $fecha2_f = date('Y-m-d',strtotime($row['fecha_2']));
					
					$accion = array("nombre" => $row['nombre'], "logo" => $logo, "latitud" => $row['latitud'], "longitud" => $row['longitud'], "lugar" => $row['lugar'], "direccion" => $row['direccion'], "descripcion" => $row['texto'], "invitados" => $row['invitados'], "aceptado" => $row['aceptado'], "comentarios" => $cc, "tipo" => $tipo, "creado"=>hace($row['fecha_t']), "publicaciones" => $publicaciones, "promo" => $promo, "promo2" => $promo2, "distancia" => number_format($row['distance'],2), "propietario" => $row['id_u'], "fecha" => $fecha, "autor" => $autor, "enlace" => getGCalendarUrl($evento), "y1" => date('Y',strtotime($row['fecha_1'])), "y2" => date('Y',strtotime($row['fecha_2'])), "mi1" => date('i',strtotime($row['fecha_1'])), "mi2" => date('i',strtotime($row['fecha_2'])), "d1" => date('d',strtotime($row['fecha_1'])), "d2" => date('d',strtotime($row['fecha_2'])), "h1" => date('H',strtotime($row['fecha_1'])), "h2" => date('H',strtotime($row['fecha_2'])), "hh1" => date('H:i',strtotime($row['fecha_1'])), "hh2" => date('H:i',strtotime($row['fecha_2'])), "m1" => $m1, "m2" => $m2, "asistencia" => $row2['asistencia'], "invitado" => $row2['invitado'], "comentar" => $row['comentar'], "ff1" => $fecha1_f, "ff2" => $fecha2_f, "fechac" => date('Y/m/d H:i:s',strtotime($row['fecha_2'])));
					$accion = $_GET['callback'].'('.json_encode($accion).')';
					break;

				case 'invitar_evento':
					$id_e = $_REQUEST['id'];
					$id = $_REQUEST['idu'];
					$someArray = [];

					$row = $db->super_query( "SELECT seguidores FROM usuarios_drink2nite WHERE id = '".$id."'");
					if($row['seguidores']) {
						$list = explode( ",", $row['seguidores'] );
						foreach ( $list as $daten ) {
							$row2 = $db->super_query( "SELECT CONCAT(nombre, ' ' ,apellido) AS completo, foto FROM usuarios_drink2nite WHERE id = '".$daten."'");
							if($row2['foto']) { $foto = 'https://drink2nite.com/subidas/avatar/'.$row2['foto']; } else { $foto = 'img/avatar.png'; }
							$row3 = $db->super_query( "SELECT invitado FROM invitaciones WHERE id = '".$daten."' AND id_e = '".$id_e."'");
							array_push($someArray, [
								'nombre'   => $row2['completo'],
								'foto' => $foto,
								'invitado' => $row3['invitado'],
								'id' => $daten
							  ]);
						}
					}

					
	$accion = json_encode($someArray);
					break;

					case 'invitar_usuario':
					
						$id = $_REQUEST['id'];
						$id_u = $_REQUEST['usuario'];
						$id_u2 = $_REQUEST['usuario2'];
		
						$db->query( "INSERT INTO invitaciones (id_e, id_u, invitado, tipo) values ('{$id}','{$id_u}','{$id_u2}','2')" );
		
						$row2 = $db->super_query( "SELECT titulo, id_l FROM eventos WHERE id = '".$id."'");
						$row3 = $db->super_query( "SELECT nombre FROM usuarios_drink2nite WHERE id = '".$id_u2."'");
						$fecha2 = time();
						$db->query( "INSERT INTO notificaciones (user, tipo, fecha, propietario, local, evento, respuesta) values ('".$id_u."', '10', '".$fecha2."', '".$id_u2."', '".$row2['id_l']."', '".$id."', '0')" );
						enviar_push_t('Evento',$row3['nombre'].' acaba de invitarte al evento '.$row2['titulo'],''.$id_u.'','1',''.$id.'',''.$row2['titulo'].'');
						$db->query("UPDATE usuarios_drink2nite set notificacion=notificacion+1 where id='".$id_u."'");
						$db->query("UPDATE eventos set invitados=invitados+1 where id='".$id."'");
						
						$accion[] = array("id" => $id, "titulo" => $row2['titulo']);
						$accion = $_GET['callback'].'('.json_encode($accion).')';
						
						break;
	
						case 'cancelar_asistencia':
			$id = $_REQUEST['id'];
			$tipo = $_REQUEST['tipo'];
			$usuario = $_REQUEST['usuario'];
			$db->query("DELETE FROM invitaciones WHERE id_u='".$usuario. "' AND id_e='".$id. "'");
			$db->query("DELETE FROM notificaciones WHERE tipo = '10' AND user='".$usuario. "' AND evento='".$id. "'");
			if($tipo == 1) { 
				$db->query("UPDATE eventos set aceptado=aceptado-1 where id='".$id."'"); 
			} else {
				$db->query("UPDATE eventos set invitados=invitados-1 where id='".$id."'"); 
			}
			$accion = 1;		
			$accion = $_GET['callback'].'('.json_encode($accion).')';
							
		break;
}

$tpl->result['main'] = utf8_encode($accion);
echo $tpl->result['main'];
die ();
?>