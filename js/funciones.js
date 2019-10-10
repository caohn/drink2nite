function localizar(posicion) {
    tipo = storage.getItem('tipo'); 
    if(tipo == null) { tipo = 1; }
    if(tipo == 1) { $('#bar_check').attr('checked','checked'); }
    if(tipo == 2) { $('#club_check').attr('checked','checked'); }
    $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=datos&id="+localStorage["usuario_drink2nite"]+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&tipo="+tipo, "dataType": "jsonp", success: 			function( response2 ) { 
    
    storage.setItem('fecha_drink2nite', response2.fecha);
    storage.setItem('zoom_drink2nite', response2.zoom);
    storage.setItem('latitud_drink2nite', posicion.coords.latitude);
    storage.setItem('longitud_drink2nite', posicion.coords.longitude);
    if(response2.notificacion > 0){ $('#notificaciones_contenedor').html('<span class="notification" style="position: absolute; top: 10px; left:6px;">'+response2.notificacion+'</span>'); } else { $('#notificaciones_contenedor').html(''); }
    $('.foto_central').attr('src',response2.foto);
    } });
    var latlng = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
    $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=locales&tipo="+tipo+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
    if(response != null) { 
    var myMarkers = {"markers": response};
    $("#mapa").mapmarker({
      zoom	: parseFloat(storage.getItem('zoom_drink2nite')),
      center	: latlng,
      markers	: myMarkers
    }); } else { 
    $('#nohay_lugar').fadeIn();
    $("#mapa").mapmarker({
      zoom	: 15,
      center	: latlng
    });
    }
    $('#recargador').removeClass('fa-spin');
    $('#seleccionar_tipo').fadeIn();
    $('.cargando_datos, .foto_central, .pulse_holder, ons-progress-bar').fadeOut(); } });
  }

  function ayuda() {
    document.querySelector('#myNavigator').pushPage('html/ayuda.html', { animation : 'slide' });
  }

  function terminos() {
    document.querySelector('#myNavigator').pushPage('html/terminos.html', { animation : 'slide' });
  }

  function privacidad() {
    document.querySelector('#myNavigator').pushPage('html/privacidad.html', { animation : 'slide' });
  }

  function error(mensaje)  {
    console.log("Codigo de error: "+mensaje.code+" msj:"+mensaje.message);
    window.location ="inicio.html";
  }
  
  function html(id, contenido, cargador) { 
    $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act="+id, "dataType": "jsonp", success: 
      function( response ) {
          contenido = '#'+contenido;
          cargador = '#'+cargador;
          $(contenido).html(response.contenido);
          $(cargador).fadeOut();
      }
    });
  }
  function locales(id){ 
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=locales_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {

          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="http://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.lugar +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

  }

  function promo(id){ 
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=promos_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {
          content += '<ons-carousel-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"><img src="http://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width: 100%; border-radius:3px;"> </ons-carousel-item>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

  }

  function local(id, titulo2) {
    document.querySelector('#myNavigator').pushPage('html/local.html', { animation : 'slide' }).then(function() {
      $('#titulo_app').html(titulo2);
    });
    
     $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=local&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
        $('#cargador_local').fadeOut();
        $('#imagen_local').attr('src',response.logo);
        $('#descripcion_local').html(response.descripcion);
        $('#direccion_local').html(response.direccion);
        $('#botones_local').html(response.botones);
        $('#carga_rapida_local').hide();
        $('#nombre_persona, #nombre_persona2, #nombre_persona3').html(storage.getItem('nombre_drink2nite'));
        $('#foto_persona, #foto_persona2, #foto_persona3').attr("src",storage.getItem('foto_drink2nite'));
        $('#valor_valoracion').html(response.valoracion);
        if(response.calificacion == 1) { $('.calificacion').hide(); }
        $('#local_id, #local_id2').val(id);
        $('#usuario_id, #usuario_id2').val(storage.getItem('usuario_drink2nite'));
        $('#usuario_nombre, #usuario_nombre2').val(storage.getItem('nombre_drink2nite'));
        $('#usuario_foto, #usuario_foto2').val(storage.getItem('foto_drink2nite'));
         $('#ciudad_publicante').html(storage.getItem('ciudad_drink2nite'));
        $('#publicaciones_10').html(response.publicaciones);
        $('#datos_animados').fadeOut();
        $('#datos_reales').delay(400).fadeIn(); /* 300 para hacerlo preciso */
     } });
  }
  function valoracion(cantidad) {
    var estrellas = 5;
    var i;
    var j;
    estrella = '';
    $('#calificacion_valor').val(cantidad);
    var total = parseFloat(estrellas)-parseFloat(cantidad);
    for (i = 1; i <= cantidad; i++) { 
      estrella += '<i class="fa fa-star custom-star" onclick="valoracion(\''+i+'\')"></i>';
    }
    cantidad=parseFloat(cantidad)+1;
    for(j=cantidad; j <= estrellas; j++) {
      estrella += '<i class="fa fa-star-o custom-star" onclick="valoracion(\''+j+'\')"></i>';
    }
    $('#calificacion').html(estrella);
    publicar();
  }
  function publicar() {
    $('.opacidad').fadeIn();
    $('#texto').focus();
  }
  function publicar2() {
    $('.opacidad2').fadeIn();
    $('#texto3').focus();
  }
  function cerrar_publicar() {
    $('.opacidad').fadeOut();
    $('#texto').val('');
  }
  function cerrar_publicar2() {
    $('.opacidad2').fadeOut();
    $('#texto3').val('');
  }
  function escribir_publicacion() {
		$("#publicar_publicacion").submit(function( event ) {
      event.preventDefault();
			valoracion_cantidad = $('#calificacion_valor').val();
			local_id = $('#local_id').val();
			texto = $('#texto').val();
      if(texto == '') { $('#texto').focus(); return false; }
      var modal = document.querySelector('ons-modal');
			modal.show();
			$.ajax({ url: "http://drink2nite.com/app/index.php?do=drink&act=publicar_texto", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
			success: function(data) { 
				console.log(data);
				$('#publicacion_nueva').html(data).fadeIn();
				cerrar_publicar();
				modal.hide();
			} });
		});
}
function buscar_local(event) {
  if(event.which == 13){
    var modal = document.querySelector('ons-modal');
		modal.show();
    var inputVal = $('#input_buscador').val();
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=busqueda_total&busqueda='+inputVal+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#contenido_busqueda');

    var content = '';
    $.getJSON(apiSrc, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="http://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.direccion +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron lugares</div>');
        showData.prepend('<ul class="list list--material"><li class="list-header list-header--material">Locales</li></ul>');
    });

    var apiSrc2 = 'http://drink2nite.com/app/index.php?do=drink&act=busqueda_total_usuarios&busqueda='+inputVal+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_busqueda_usuarios');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content2 += '<ons-card onclick="perfil_ver(\''+ item.id +'\', \''+ item.id +'\')"> <ons-row> <ons-col width="50px" style="padding-right:10px;"><img src="img/avatar.png" style="width: 100%; border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.correo +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })
        modal.hide();
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No se encontraron usuarios</div>');
        showData2.prepend('<ul class="list list--material"><li class="list-header list-header--material">Usuarios</li></ul>');
    });
    
  }
}
function perfil_ver(id,tipo) {
	$('#carga_rapida_perfil').show();
  document.querySelector('#myNavigator').pushPage('html/perfiles.html', { animation: 'lift'});
	$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=perfil&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
		$('#carga_rapida_perfil').hide();
		$('#titulo_perfil').html(response.nombre+' '+response.apellido);
		$('#imagen_perfil_ver').attr("src",response.foto);
		$('#nombre_pperfil_ver').html(response.nombre+' '+response.apellido);
		$('#email_perfil_ver').html(response.correo);
		$('#botones_perfil').html(response.botones);
		$('#on1').html(response.check);
		$('#on2').html(response.seguidores);
		$('#on3').html(response.seguidos);
		$('#publicaciones_perfil').html(response.publicaciones);
    if(localStorage["usuario_drink2nite"] == id) { $('#botones_perfil').hide(); } else { $('#botones_perfil').show(); }
    $('#datos_animados_perfil').fadeOut();
    $('#datos_reales_perfil').delay(400).fadeIn();
	}
	});
}
function seguir_usuario(id,tipo) {
	ss = '#seguiru'+id;
	sn = '#nseguiru'+id;
	numero = $('#on2').html();
	if(tipo == 1) { 
	$(ss).hide(); $(sn).show(); mensaje = '¡Has comenzado a seguir este usuario!'; 
  suma = parseFloat(numero)+1;
  localStorage["seguidos_drink2nite"] = parseFloat(storage.getItem('seguidos_drink2nite'))+1;
	$('#on2').html(suma);
	} else { 
	$(sn).hide(); $(ss).show(); mensaje = '¡Has dejado de seguir este usuario!'; 
  resta = parseFloat(numero)-1;
  localStorage["seguidos_drink2nite"] = parseFloat(storage.getItem('seguidos_drink2nite'))-1;
	$('#on2').html(resta);
	}
	ons.notification.alert({
	  message: mensaje,
	  title: 'Seguir',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=seguir_u&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				modal.hide();
		  } });
	  }
	});
}
function seguir(id,tipo) {
	ss = '#seguir'+id;
	sn = '#nseguir'+id;
	if(tipo == 1) { 
	$(ss).hide(); $(sn).show(); mensaje = '¡Has comenzado a seguir este local!'; 
	} else { 
	$(sn).hide(); $(ss).show(); mensaje = '¡Has dejado de seguir este local!'; 
	}
	ons.notification.alert({
	  message: mensaje,
	  title: 'Seguir',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=seguir&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				modal.hide();
		  } });
	  }
	});
}
function favoritos(id,tipo) {
	fs = '#favorito'+id;
	fn = '#nfavorito'+id;
	if(tipo == 1) { 
	$(fs).hide(); $(fn).show(); mensaje = '¡Se ha agregado el local a tus favoritos!'; 
	} else { 
	$(fn).hide(); $(fs).show(); mensaje = '¡Se ha eliminado el local de tus favoritos!'; 
	}
	ons.notification.alert({
	  message: mensaje,
	  title: 'Favoritos',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=favoritos&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				modal.hide();
		  } });
	  }
	});
}
function venue(id) {
	vn = '#venue'+id;
	nv = '#nvenue'+id;
	$(vn).hide();
	$(nv).show();
	ons.notification.alert({
	  message: '¡Se ha posteado este punto de reunión a tus seguidores!',
	  title: 'Venue',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=venue&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				recargar();
				modal.hide();
		  } });
	  }
	});
}
function venue2(id) {
	vn = '#venue'+id;
	nv = '#nvenue'+id;
	$(vn).show();
	$(nv).hide();
	ons.notification.alert({
	  message: '¡Se ha removido este punto de reunión a tus seguidores!',
	  title: 'No Venue',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=nvenue&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				recargar();
				modal.hide();
		  } });
	  }
	});
}
function venue3(id) {
	ons.notification.alert({
	  message: '¡Se ha removido este punto de reunión a tus seguidores!',
	  title: 'No Venue',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=nvenue2&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
        modal.hide();
        document.querySelector('#myNavigator').popPage();
		  } });
	  }
	});
}
function reportar(id) {
	mensaje = '¡Usuario reportado!'; 
	ons.notification.alert({
	  message: mensaje,
	  title: 'Reportar',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=reportar&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
				modal.hide();
		  } });
	  }
	});
}
function cambiar_tipo(tipo) {
	localStorage["tipo"] = tipo;
	recargar();
}
function recargar() {
	$('#nohay_lugar').fadeOut();
	$('.cargando_datos, .foto_central, .pulse_holder').fadeIn();
	$('#recargador').addClass('fa-spin');
	if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(localizar, error); }  else { error('No soportado!'); }
}
function cerrar_sesion() {
  storage.removeItem('usuario_drink2nite');
	window.location ="login.html";
}
function locales_mostrar_todo() {
  promo('promo_carousel');
  locales('contenido_locales_principal');
}
function perfil_propio(){
		$('#imagen_perfil_propio').attr("src",storage.getItem('foto_drink2nite'));
		$('#nombre_pperfil_ver_propio').html(storage.getItem('nombre_drink2nite'));
		$('#email_perfil_ver_propio').html(storage.getItem('correo_drink2nite'));
$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=perfil&id="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
		$('#oon1').html(response.check);
		$('#oon2').html(response.seguidos);
		$('#oon3').html(response.seguidores);
		$('#publicaciones_perfil2').html(response.publicaciones);
	}
	});
	
}
function seguidores(id, contenedor, cargador){ 
  if(!id) id = storage.getItem('usuario_drink2nite');
  document.querySelector('#myNavigator').pushPage('html/seguidores.html', {data: {title: 'Seguidores'}, animation: 'slide', callback: function() {
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=seguidores_usuario&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
  
          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="img/avatar.png"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">Seguidores: '+ item.seguidores +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No hay usuarios</div>');
        $(cargador2).fadeOut();
  
    });
  } 
  });
  

}
function seguidos(id, contenedor, cargador){ 
  if(!id) id = storage.getItem('usuario_drink2nite');
  document.querySelector('#myNavigator').pushPage('html/seguidos.html', {data: {title: 'Seguidos'}, animation: 'slide', callback: function() {
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=seguidos_usuario&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
  
          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="img/avatar.png"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">Seguidores: '+ item.seguidores +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No hay usuarios</div>');
        $(cargador2).fadeOut();
  
    });
  } 
  });
  

}

function tonightv2() {
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=tonightv2&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#tonigh_contenido');

    var content = '';
    $.getJSON(apiSrc, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="img/avatar.png"> </div> <div class="center"> <span class="list-item__title" style="padding-bottom:10px;">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron lugares</div>');
        showData.prepend('<ul class="list list--material"><li class="list-header list-header--material">Gente cercana</li></ul>');
    });

    var apiSrc2 = 'http://drink2nite.com/app/index.php?do=drink&act=tonightv3&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#tonigh_contenido2');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="http://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No se encontraron venues</div>');
        showData2.prepend('<ul class="list list--material"><li class="list-header list-header--material">Venues cercanos</li></ul>');
    });

}
function notificacion(){ 
  id = storage.getItem('usuario_drink2nite');
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=notificaciones_todas&id='+id+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#contenido_notificaciones');
    var cargador2 = $('#cargador_notificaciones');
    $('#notificaciones_contenedor').html('');
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          
          if(item.tipo == 1) {
            content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px;"><img src="http://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un venue</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;">'+item.hace+' </button></span></ons-col> <ons-col width="100px" style="text-align:right;"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></ons-col></ons-row></ons-card>';
         }
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No hay notificaciones</div>');
        $(cargador2).fadeOut();
  
    
  });
}
function venue_ir(id){ 
  document.querySelector('#myNavigator').pushPage('html/venue.html', {data: {title: 'Venue'}, animation: 'slide', callback:function(){ 
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=venue_info&id='+id+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+"&id_u="+storage.getItem('usuario_drink2nite');
    var showData = $('#contenido_venue');
    var cargador2 = $('#cargador_venue');
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {

          var latlng = new google.maps.LatLng(item.latitud, item.longitud);
          var myMarkers = {"markers": [
            {"latitude": ""+item.latitud+"", "longitude":""+item.longitud+"", "baloon_text": ""+item.local+""}]};
         
            $("#mapa_venue").mapmarker({
            zoom	: 15,
            center	: latlng,
            markers	: myMarkers
          });

          if(storage.getItem('usuario_drink2nite') != item.id_u && item.activo == 1 && item.asistencia == 0) {
            boton_asistir = '<button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:10px;" onclick="document.getElementById(\'action-sheet-dialog\').show()">Asistiré</button>';
            acciones = '<ons-action-sheet id="action-sheet-dialog" cancelable><ons-action-sheet-button onclick="asistir_venue(\''+id+'\',1)" icon="ion-md-rainy">Yo invito</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_venue(\''+id+'\',2)" icon="ion-md-body">Si me invitas</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_venue(\''+id+'\',3)" icon="ion-md-walk">Voy a llegar</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_venue(\''+id+'\',4)" icon="md-close">Mejor otro día</ons-action-sheet-button></ons-action-sheet>';
          } else { boton_asistir = ''; acciones = ''; 
        
          if(storage.getItem('usuario_drink2nite') == item.id_u && item.activo == 1) {
            boton_asistir = '<button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:10px; border-color:#FE4B36; background:#FE4B36; color:#FFF;" onclick="venue3(\''+id+'\')">Cerrar venue</button>';
          }

          if(item.activo == 0) {
            boton_asistir = '<button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;">Cerrado</button>';
          }
        
        }

            
            content += '<ons-card> <ons-row> <ons-col width="60px" style="padding-right:10px;"><img src="http://drink2nite.com/subidas/logos/'+ item.logo +'" class="list-item__thumbnail" style="border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un venue</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;">'+item.hace+' </button> '+boton_asistir+'</span></ons-col> <ons-col width="100px" style="text-align:right;"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></ons-col></ons-row></ons-card>';
         
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        $(cargador2).fadeOut();
        $('#acciones_menu').html(acciones);
  
    
  });

  var apiSrc2 = 'http://drink2nite.com/app/index.php?do=drink&act=asistencia_todas&id='+id;
    var showData2 = $('#listado_asistencia');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          if(item.asistencia == 1) {
            asiste = '¡Asistiré y yo invitaré!';
          }
          if(item.asistencia == 2) {
            asiste = '¡Invitame y llego!';
          }
          if(item.asistencia == 3) {
            asiste = '¡Voy a ir!';
          }
          content2 += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="img/avatar.png"> </div> <div class="center"> <span class="list-item__title">' + item.completo + '</span><span class="list-item__subtitle">' + asiste + '</span> </div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No hay confirmaciones</div>');
    });
  
}});
}

function asistir_venue(id, tipo) {
  if(tipo == 1) { mensaje = '¡Asistiré y yo invitaré!'; } if(tipo == 2) { mensaje = '¡Invitame y llego!'; } if(tipo == 3) { mensaje = '¡Voy a ir!'; } if(tipo == 4) { mensaje = '¡No ire!'; }
  if(tipo != 4) {
  var modal = document.querySelector('ons-modal');
	modal.show();
  ons.notification.alert({
	  message: mensaje,
	  title: 'Seguir',
	  buttonLabel: 'OK',
    animation: 'default',
    callback: function() {
		  $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=asistir_venue&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+"&tipo="+tipo, "dataType": "jsonp", success: function( response ) {
				modal.hide();
		  } });
	  }
  });
}
  document.getElementById('action-sheet-dialog').hide();
  document.querySelector('#myNavigator').popPage();
}
function mis_venues() {
  document.querySelector('#myNavigator').pushPage('html/misvenues.html', {data: {title: 'Mis Venue'}, animation: 'slide', callback:function(){ 
  var apiSrc2 = 'http://drink2nite.com/app/index.php?do=drink&act=misvenues&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_misvenues');
    var cargador2 = $('#cargador_misvenues');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          if(item.activo == 0) boton_activo = '<button class="button button--light" style="line-height:16px; font-size:13px;">Cerrado</button>'; else boton_activo = '<button class="button button--outline" style="line-height:16px; font-size:13px; border-color:#16D558; background:#16D558; color:#FFF;">Abierto</button>';
          boton_hace = '<button class="button button--light" style="line-height:16px; font-size:13px;">'+item.hace+'</button> ';
          content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="http://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle">' + boton_hace + boton_activo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No se encontraron venues</div>');
        cargador2.hide();
    });
  }});
}
function mis_favoritos() {
  document.querySelector('#myNavigator').pushPage('html/misfavoritos.html', {data: {title: 'Mis Favoritos'}, animation: 'slide', callback:function(){ 
  var apiSrc2 = 'http://drink2nite.com/app/index.php?do=drink&act=misfavoritos&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_misfavoritos');
    var cargador2 = $('#cargador_misfavoritos');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          content2 += '<ons-list-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <div class="left"> <img class="list-item__thumbnail" src="http://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">' + item.direccion + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No se encontraron favoritos</div>');
        cargador2.hide();
    });
  }});
}