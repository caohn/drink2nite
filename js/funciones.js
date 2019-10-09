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
        $('.profile-card').delay(150).fadeIn();
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
        modal.hide();
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron resultados</div>');
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
		$('#oon2').html(response.seguidores);
		$('#oon3').html(response.seguidos);
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
  
          content += '<ons-card onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <ons-row> <ons-col width="40px" style="padding-right:10px;"><img src="img/avatar.png" style="width: 100%; border-radius:50px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '<br><span style="color:rgba(255,255,255,0.4); font-size:13px;">Seguidores: '+ item.seguidores +'</span></div></ons-col> </ons-row></ons-card>';
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
  document.querySelector('#myNavigator').pushPage('html/seguidores.html', {data: {title: 'Seguidores'}, animation: 'slide', callback: function() {
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=seguidos_usuario&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
  
          content += '<ons-card onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <ons-row> <ons-col width="40px" style="padding-right:10px;"><img src="img/avatar.png" style="width: 100%; border-radius:50px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '<br><span style="color:rgba(255,255,255,0.4); font-size:13px;">Seguidores: '+ item.seguidores +'</span></div></ons-col> </ons-row></ons-card>';
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