function localizar(posicion) {
    tipo = storage.getItem('tipo'); 
    if(tipo == null) { tipo = 1; }
    if(tipo == 1) { $('#bar_check').attr('checked','checked'); }
    if(tipo == 2) { $('#club_check').attr('checked','checked'); }
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=datos&id="+localStorage["usuario_drink2nite"]+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&tipo="+tipo, "dataType": "jsonp", success: 			function( response2 ) { 
    
    storage.setItem('fecha_drink2nite', response2.fecha);
    storage.setItem('zoom_drink2nite', response2.zoom);
    storage.setItem('latitud_drink2nite', posicion.coords.latitude);
    storage.setItem('longitud_drink2nite', posicion.coords.longitude);
    storage.setItem('nombres_drink2nite', response2.nombres);
    storage.setItem('apellidos_drink2nite', response2.apellidos);
    storage.setItem('foto_drink2nite', response2.foto);
    if(response2.notificacion > 0){ $('#notificaciones_contenedor').html('<span class="notification" style="position: absolute; top: 10px; left:6px;">'+response2.notificacion+'</span>'); } else { $('#notificaciones_contenedor').html(''); }
    $('.foto_central').attr('src',response2.foto);
    } });
    var latlng = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=locales&tipo="+tipo+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
    if(response != null) { 
    var myMarkers = {"markers": response};
    $("#mapa").mapmarker({
      zoom	: parseFloat(storage.getItem('zoom_drink2nite')),
      center	: latlng,
      markers	: myMarkers
    }); } else { 
    var myToast = document.querySelector('myToast');
    myToast.toggle();
    $("#mapa").mapmarker({
      zoom	: 15,
      center	: latlng
    });
    }
    $('#recargador').removeClass('fa-spin');
    /* $('#seleccionar_tipo, #fab_ref').fadeIn(); */
    $('#fab_ref').fadeIn();
    $('#icono_refrescar_vueltas').hide();
    $('#icono_refrescar').show();
    $('.cargando_datos, .foto_central, .pulse_holder, ons-progress-bar').fadeOut(); } });
  }
  function editar_perfil() {
    document.querySelector('#myNavigator').pushPage('html/editar.html', { animation : 'slide', callback: function() {
      $('#imagen_fondo').css('background-image', 'url(' + storage.getItem('foto_drink2nite') + ')');
      $('#nombre').val(storage.getItem('nombres_drink2nite'));
      $('#apellido').val(storage.getItem('apellidos_drink2nite'));
      $('#email').val(storage.getItem('correo_drink2nite'));
    }
     });
  }
function refrescar() {
  $('#icono_refrescar').hide();
  $('#icono_refrescar_vueltas').show();

  ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Cargando datos', { timeout: 1000, animation: 'ascend' });
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: false,
        timeout: 50000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(localizar, error, options); 
      visita = storage.getItem('visita_drink2nite');
      if(!visita) {
        storage.setItem('visita_drink2nite', 1);
        window.location ="inicio.html";
      }
    }  
      else { alert('No soportado!'); }
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

  function nuevo() {
    document.querySelector('#myNavigator').pushPage('html/nuevo.html', { animation : 'slide' });
  }

  function agregar_promo() {
    document.querySelector('#myNavigator').pushPage('html/crearpromo.html', { animation : 'slide', callback: function() {
      var modal = document.querySelector('ons-modal');
      modal.show();
      
      var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=listado_locales&id='+storage.getItem('usuario_drink2nite');
      var showData = $('#locales-select');


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {

          content += '<option value="'+item.id+'">' + item.nombre + '</option>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);
        modal.hide();
        if(!content) {
          ons.notification.alert({
            message: '¡Debes de tener locales agregados a tu cuenta para continuar!',
            title: 'Error',
            buttonLabel: 'OK',
            animation: 'default'
          });
          document.querySelector('#myNavigator').popPage();
        }
    });
    } });
  }

  function error(mensaje)  {
    /* window.location ="inicio.html"; 
    location.reload(); */
    ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Tiempo de espera agotado, obteniendo datos de tu IP.', { timeout: 1000, animation: 'ascend' });
    localizar_ip();
  }
  function localizar_ip() {
    ip = storage.getItem('ip_drink2nite');
    $.ajax({ "url": "http://api.ipstack.com/"+ip+"?access_key=6a1bbce76235bb02c84cd913d1d1671b", "dataType": "jsonp", success: function( response ) {
      tipo = storage.getItem('tipo'); 
      if(tipo == null) { tipo = 1; }
      if(tipo == 1) { $('#bar_check').attr('checked','checked'); }
      if(tipo == 2) { $('#club_check').attr('checked','checked'); }
      $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=datos&id="+localStorage["usuario_drink2nite"]+"&latitud="+response.latitude+"&longitud="+response.longitude+"&tipo="+tipo, "dataType": "jsonp", success: 			function( response2 ) { 
      
      storage.setItem('fecha_drink2nite', response2.fecha);
      storage.setItem('zoom_drink2nite', response2.zoom);
      storage.setItem('latitud_drink2nite', response.latitude);
      storage.setItem('longitud_drink2nite', response.longitude);
      storage.setItem('nombres_drink2nite', response2.nombres);
      storage.setItem('apellidos_drink2nite', response2.apellidos);
      storage.setItem('foto_drink2nite', response2.foto);
      if(response2.notificacion > 0){ $('#notificaciones_contenedor').html('<span class="notification" style="position: absolute; top: 10px; left:6px;">'+response2.notificacion+'</span>'); } else { $('#notificaciones_contenedor').html(''); }
      $('.foto_central').attr('src',response2.foto);
      } });
      var latlng = new google.maps.LatLng(response.latitude, response.longitude);
      $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=locales&tipo="+tipo+"&latitud="+response.latitude+"&longitud="+response.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
      if(response != null) { 
      var myMarkers = {"markers": response};
      $("#mapa").mapmarker({
        zoom	: parseFloat(storage.getItem('zoom_drink2nite')),
        center	: latlng,
        markers	: myMarkers
      }); } else { 
      var myToast = document.querySelector('myToast');
      myToast.toggle();
      $("#mapa").mapmarker({
        zoom	: 15,
        center	: latlng
      });
      }
      $('#recargador').removeClass('fa-spin');
      /* $('#seleccionar_tipo, #fab_ref').fadeIn(); */
      $('#fab_ref').fadeIn();
      $('#icono_refrescar_vueltas').hide();
      $('#icono_refrescar').show();
      $('.cargando_datos, .foto_central, .pulse_holder, ons-progress-bar').fadeOut(); } });
    } });
  }
  function html(id, contenido, cargador) { 
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act="+id, "dataType": "jsonp", success: 
      function( response ) {
          contenido = '#'+contenido;
          cargador = '#'+cargador;
          $(contenido).html(response.contenido);
          $(cargador).fadeOut();
      }
    });
  }
  function locales(id){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=locales_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {

          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.lugar +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

  }

  function promo(id){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=promos_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {
          content += '<ons-carousel-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"><img src="https://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width: 100%; border-radius:3px;"> </ons-carousel-item>';
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
    
     $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=local&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite'), "dataType": "jsonp", success: function( response ) {
       if(response.promo) {
          $('#mapa_venue').html('<ons-carousel swipeable auto-scroll var="carousel">'+response.promo+'</ons-carousel>').css("height", "auto");
          $('#ons-card-info').css("top", "-5px");
          $('.degradado_negro').css("bottom", "5px");
       } else {
        var latlng = new google.maps.LatLng(response.latitud, response.longitud);
        var myMarkers = {"markers": [
          {"latitude": ""+response.latitud+"", "longitude":""+response.longitud+"", "baloon_text": ""+response.local+""}]};
      
          $("#mapa_venue").mapmarker({
          zoom	: 11,
          center	: latlng,
          markers	: myMarkers
        });
      }
      if(response.tipo == 1) { icono = '<ons-icon icon="ion-md-beer" style="color:#FFF; font-size:16px; position:relative; top:-2px;"></ons-icon>'; } else { icono = '<ons-icon icon="ion-md-wine" style="color:#FFF; font-size:16px; position:relative; top:-2px;"></ons-icon>'; }
      $('#titulo_local').html(titulo2);
      $('#cargador_local').fadeOut();
        $('#imagen_local').attr('src',response.logo);
        $('#descripcion_local').html(response.descripcion2);
        $('#icono_local').html(icono);
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
			$.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=publicar_texto", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
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
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=busqueda_total&busqueda='+inputVal+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#contenido_busqueda');

    var content = '';
    $.getJSON(apiSrc, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.direccion +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron lugares</div>');
        showData.prepend('<ul class="list list--material"><li class="list-header list-header--material">Locales</li></ul>');
    });

    var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=busqueda_total_usuarios&busqueda='+inputVal+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+'&id='+storage.getItem('usuario_drink2nite');
    var showData2 = $('#contenido_busqueda_usuarios');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content2 += '<ons-card onclick="perfil_ver(\''+ item.id +'\', \''+ item.id +'\')"> <ons-row> <ons-col width="50px" style="padding-right:10px;"><img src="'+item.foto+'" style="width: 100%; border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.correo +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
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
	$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=perfil&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
    acciones = '<ons-action-sheet id="action-sheet-dialog" cancelable><ons-action-sheet-button onclick="reportar(\''+id+'\',1)" icon="ion-md-flash">Lenguaje inapropiado</ons-action-sheet-button><ons-action-sheet-button onclick="reportar(\''+id+'\',2)" icon="ion-md-hand">Comentarios racistas</ons-action-sheet-button><ons-action-sheet-button onclick="reportar(\''+id+'\',3)" icon="ion-md-man">Acoso</ons-action-sheet-button><ons-action-sheet-button onclick="reportar(\''+id+'\',4)" icon="ion-md-sad">Robo de identidad</ons-action-sheet-button></ons-action-sheet>';
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
    $('#acciones_menu').html(acciones);
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=seguir_u&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=seguir&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=favoritos&id="+id+"&tipo="+tipo+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=venue&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=nvenue&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=nvenue2&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
        modal.hide();
        document.querySelector('#myNavigator').popPage();
		  } });
	  }
	});
}
function reportar(id,tipo) {
	mensaje = '¡El usuario se ha bloqueado!'; 
	ons.notification.alert({
	  message: mensaje,
	  title: 'Reportar',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=reportar&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+"&tipo="+tipo, "dataType": "jsonp", success: function( response ) {
        modal.hide();
        document.getElementById('action-sheet-dialog').hide();
        document.querySelector('#myNavigator').popPage();
        tonightv2();
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
$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=perfil&id="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=seguidores_usuario&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
  
          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">Seguidores: '+ item.seguidores +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No hay usuarios</ons-button></div>');
        $(cargador2).fadeOut();
  
    });
  } 
  });
  

}
function seguidos(id, contenedor, cargador){ 
  if(!id) id = storage.getItem('usuario_drink2nite');
  document.querySelector('#myNavigator').pushPage('html/seguidos.html', {data: {title: 'Seguidos'}, animation: 'slide', callback: function() {
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=seguidos_usuario&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
  
          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">Seguidores: '+ item.seguidores +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No hay usuarios</ons-button></div>');
        $(cargador2).fadeOut();
  
    });
  } 
  });
  

}

function tonightv2() {
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=tonightv2&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#tonigh_contenido');

    var content = '';
    $.getJSON(apiSrc, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title" style="padding-bottom:10px;">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron lugares</div>');
        showData.prepend('<ul class="list list--material"><li class="list-header list-header--material">Gente cercana</li></ul>');
    });

    var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=tonightv3&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#tonigh_contenido2');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="https://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
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
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=notificaciones_todas&id='+id+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#contenido_notificaciones');
    var cargador2 = $('#cargador_notificaciones');
    $('#notificaciones_contenedor').html('');
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          
          if(item.tipo == 1) {
            content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; height:50px; border-radius:30px;"><ons-icon icon="ion-md-flame" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#C81C60;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un venue</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
         }

         if(item.tipo == 2) {
           if(item.respuesta == 1) { res = 'él invitará'; }
           if(item.respuesta == 2) { res = 'si lo invitas'; }
           if(item.respuesta == 3) { res = 'irá'; }
           if(item.respuesta == 4) { res = 'no asistirá'; icono_m = '<ons-icon icon="ion-md-close-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon>'; } else { icono_m = '<ons-icon icon="ion-md-checkmark-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#19BE64;"></ons-icon>'; }

          content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; height:50px; border-radius:30px;">'+icono_m+'</ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha respondido al venue que '+res+'</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
       }

       if(item.tipo == 3) {
        content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; height:50px; border-radius:30px;"><ons-icon icon="ion-md-close-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha cerrado el venue</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col> </ons-row></ons-card>';
     }

     if(item.tipo == 4) {
      content += '<ons-card onclick="local(\''+ item.id_l +'\', \''+ item.local +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; border-radius:30px; height:50px;"><ons-icon icon="ion-md-flag" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un check in</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col> </ons-row></ons-card>';
   }
   if(item.tipo == 5) {
    content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 50px; height:50px; border-radius:30px;"><ons-icon icon="ion-md-text" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha comentado el venue</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col></ons-row></ons-card>';
 }
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No hay notificaciones</ons-button></div>');
        $(cargador2).fadeOut();
  
    
  });
}
function venue_ir(id){ 
  document.querySelector('#myNavigator').pushPage('html/venue.html', {data: {title: 'Venue'}, animation: 'slide', callback:function(){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=venue_info&id='+id+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+"&id_u="+storage.getItem('usuario_drink2nite');
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
            zoom	: 13,
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
        if(item.asistencia == 1) {
          asistire = 'Yo invito';
        } 
        if(item.asistencia == 2) {
          asistire = 'Si me inv.';
        } 
        if(item.asistencia == 3) {
          asistire = 'Llegaré';
        } 
        if(item.asistencia == 4) {
          asistire = 'Otro día';
        } 
        if(item.asistencia == 0 && storage.getItem('usuario_drink2nite') == item.id_u) {
          asistire = 'Anfitrión';
        } 
        if(item.asistencia == 0 && storage.getItem('usuario_drink2nite') != item.id_u) {
          asistire = 'No confir.';
        }
            content += '<ons-card> <ons-row> <ons-col width="60px" style="padding-right:10px;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" class="list-item__thumbnail" style="border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un venue</div><span style="font-size:13px;">'+ item.local +'<br><span style="color:rgba(255,255,255,0.6);">'+item.descripcion+'</span><br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;">'+item.hace+' </button> '+boton_asistir+'</span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.cantidad +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-body" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ asistire +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Asistencia</span></ons-col></ons-row></ons-card>';
         
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        $(cargador2).fadeOut();
        $('#acciones_menu').html(acciones);
  
    
  });

  var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=asistencia_todas&id='+id;
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
          content2 += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.completo + '</span><span class="list-item__subtitle">' + asiste + '</span> </div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No hay confirmaciones</div>');
    });

    var apiSrc3 = 'https://drink2nite.com/app/index.php?do=drink&act=chat_venue&id='+id;
    var showData3 = $('#chat_venue');

    var content3 = '';
    $.getJSON(apiSrc3, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          content3 += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + ' <span style="background:rgba(255,255,255,0.3); font-size:10px; padding:2px 4px; margin-left:5px; border-radius:3px; color:#FFF; margin-top:-2px;">'+item.fechac+'</span></span><span class="list-item__subtitle">' + item.texto + '</span> </div> </ons-list-item>';
            //alert(item.title);
        })
        showData3.empty();
        showData3.append(content3);
        if(!content3) showData3.html('<div style="padding:20px; text-align:center;">No se encontraron chats en este venue</div>');
    });

    $('#venue_id').val(id);
  
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
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=asistir_venue&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+"&tipo="+tipo, "dataType": "jsonp", success: function( response ) {
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
  var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=misvenues&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_misvenues');
    var cargador2 = $('#cargador_misvenues');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          if(item.activo == 0) boton_activo = '<button class="button button--light" style="line-height:16px; font-size:13px;">Cerrado</button>'; else boton_activo = '<button class="button button--outline" style="line-height:16px; font-size:13px; border-color:#FE4B36; background:#FE4B36; color:#FFF;">Cerrar venue</button>';
          
          
          content2 += '<ons-card onclick="venue_ir(\''+ item.id_v +'\')" style="margin:10px 12px 5px 12px;"><ons-row> <ons-col width="130px" style="padding-right:10px; position: relative;"><div style="position: relative;"><img src="https://drink2nite.com/subidas/logos/' + item.logo + '" class="list-item__thumbnail" style="width:110px; height:auto; position:relative; border-radius:5px;"></div></ons-col><ons-col><div class="title" style="font-size:18px;">' + item.local + '</div><span style="font-size:13px;">'+ item.local +'<br><span style="color:rgba(255,255,255,0.6);">'+item.direccion+'</span><br><div style="margin-top:8px;"><button class="button button--light" style="line-height:16px; font-size:13px;">'+item.hace+' </button> '+boton_activo+'</div></span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.asistencia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-chatbubbles" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.chat +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Chats</span></ons-col></ons-row></ons-card>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No se encontraron venues</ons-button></div>');
        cargador2.hide();
    });
  }});
}
function mis_favoritos() {
  document.querySelector('#myNavigator').pushPage('html/misfavoritos.html', {data: {title: 'Mis Favoritos'}, animation: 'slide', callback:function(){ 
  var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=misfavoritos&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_misfavoritos');
    var cargador2 = $('#cargador_misfavoritos');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          content2 += '<ons-list-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <div class="left"> <img style="width:75px; margin-right:10px;" src="https://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">' + item.direccion + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No se encontraron favoritos</ons-button></div>');
        cargador2.hide();
    });
  }});
}
function mis_locales(id, contenedor, cargador){ 
  if(!id) id = storage.getItem('usuario_drink2nite');
  document.querySelector('#myNavigator').pushPage('html/mislocales.html', {data: {title: 'Mis Locales'}, animation: 'slide', callback: function() {
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=mislocales&id='+id;
    var showData = $('#'+contenedor);
    var cargador2 = $('#'+cargador);
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          
          content += '<ons-card> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> </ons-col> <ons-col><div class="title" style="font-size:18px;" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.descripcion +'<br><span style="color:rgba(255,255,255,0.8)">'+item.lugar+'</span></span><div><button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:10px;" onclick="editar_local(\''+ item.id +'\')"><ons-icon icon="ion-md-create" style="color:#FFF; margin-right:3px; position:relative; top:-2px;" ></ons-icon> Editar local</button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" onclick="eliminar_local(\''+ item.id +'\', \''+ item.nombre +'\')"><ons-icon icon="ion-md-close" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> Eliminar</button></div></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No hay locales en tu cuenta</ons-button></div>');
        $(cargador2).fadeOut();
  
    });
  } 
  });
  

}
function mis_promos(id){ 
  if(!id) id = storage.getItem('usuario_drink2nite');
  
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=mispromos&id='+id;
    var showData = $('#contenido_mispromos');
    var cargador2 = $('#cargador_mispromos');
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          
          content += '<ons-list-item><div class="center"><span class="list-item__title"><img class="list-item__thumbnail" style="display:inline-block; margin-top:-6px;" align="middle" src="https://drink2nite.com/subidas/logos/'+ item.logo +'" onclick="local(\''+ item.id_l +'\', \''+ item.nombre +'\')"> <span style="margin:0 0 0 5px; display:inline-block;">' + item.nombre + '</span></span><span class="list-item__subtitle"><img src="https://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width:100%; margin-top:5px; border-radius:10px;"><div style="margin-top:7px;"><ons-button modifier="material" onclick="editar_promo(\''+ item.id +'\', \'https://drink2nite.com/subidas/promos/'+ item.imagen +'\')"><i class="fa fa-pencil"></i> Editar</ons-button> <ons-button modifier="material" onclick="eliminar_promo(\''+ item.id +'\')"><i class="fa fa-trash"></i> Eliminar</ons-button></div></span></div></ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No hay promociones en tu cuenta</ons-button></div>');
        $(cargador2).fadeOut();
  
    });
  
  

}
function escribir_chat(event) {
  if(event.which == 13){
    var modal = document.querySelector('ons-modal');
		modal.show();
    var inputVal = $('#escribir_chat').val();
    id_v = $('#venue_id').val();
    id_u = storage.getItem('usuario_drink2nite');
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=escribir_chat&texto='+inputVal+'&id='+id_v+'&id_u='+id_u;
    var showData = $('#chat_venue');

    var content = '';
    $.getJSON(apiSrc, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + ' <span style="background:rgba(255,255,255,0.3); font-size:10px; padding:2px 4px; margin-left:5px; border-radius:3px; color:#FFF; margin-top:-2px;">'+item.fechac+'</span></span><span class="list-item__subtitle">' + item.texto + '</span> </div> </ons-list-item>';
            //alert(item.title);
        })
        showData.empty();
        showData.append(content);
        modal.hide();
        $('#escribir_chat').val('').blur();
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron chats en este venue</div>');
    });
    
  }
}
function editar_cuenta() {
  $("#informacion_basica").submit(function( event ) {
    event.preventDefault();
    id = storage.getItem('usuario_drink2nite');
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=editar_cuenta&id="+id, type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) {
      console.log(data);
      modal.hide();
      if(data == '("0")') {
        ons.notification.alert({
          message: '¡Tu correo electrónico es inválido!',
          title: 'Inválido',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      else {
        ons.notification.alert({
          message: '¡Tus datos se han actualizado con éxito!',
          title: 'Actualizado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        recargar();
        document.querySelector('#myNavigator').popPage();
      }
    } });
  });
}
function editar_acceso() {
  $("#informacion_acceso").submit(function( event ) {
    event.preventDefault();
    id = storage.getItem('usuario_drink2nite');
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=editar_acceso&id="+id, type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) {
      console.log(data);
      modal.hide();
      if(data == '("0")') {
        ons.notification.alert({
          message: '¡La contraseña ingresada no es la actual!',
          title: 'Error',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      if(data == '("1")') {
        ons.notification.alert({
          message: '¡Las contraseña no coinciden!',
          title: 'Error',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      if(data == '("2")') {
        ons.notification.alert({
          message: '¡Tus datos se han actualizado con éxito!',
          title: 'Actualizado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        recargar();
        document.querySelector('#myNavigator').popPage();
      }
    } });
  });
}
function editar_local(id) {
  document.querySelector('#myNavigator').pushPage('html/editarlocal.html', {data: {title: 'Editar local'}, animation: 'slide', callback: function() {
    var modal = document.querySelector('ons-modal');
    modal.show();
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=datos_local&id='+id;
  
    $.getJSON(apiSrc, function(data) {
      $.each(data, function(i, item) {
        item.logo = 'https://drink2nite.com/subidas/logos/'+item.logo;
        modal.hide();
        $('#cargador_editarlocal').fadeOut();
        $('#nombre').val(item.nombre);
        $('#direccion').val(item.direccion);
        $('#descripcion').val(item.descripcion);
        $('#h_e').val(item.h_e);
        $('#h_c').val(item.h_c);
        $('#telefono').val(item.numero);
        $('#pagina').val(item.pagina);
        $('#id_local').val(id);
        $('#imagen_fondo').css('background-image', 'url(' + item.logo + ')');
        $('#imagen_fondo').css('background-position', 'center');
      })
    });
  } 
  });

}
function editar_local_guardar() {
  $("#informacion_basica").submit(function( event ) {
    event.preventDefault();
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=editar_local", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) {
      console.log(data);
      modal.hide();
      if(data == '("0")') {
        ons.notification.alert({
          message: '¡Alguna información suministrada es inválida!',
          title: 'Inválido',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      else {
        ons.notification.alert({
          message: '¡Los datos se han actualizado con éxito!',
          title: 'Actualizado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        document.querySelector('#myNavigator').popPage();
      }
    } });
  });
}
function eliminar_local(id, nombre) {
  ons.notification.confirm({message:'¿Seguro que quieres eliminar '+nombre+'?', callback: function(answer) { switch (answer) { 
    case 1: 
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=eliminar_local&id="+id, "dataType": "jsonp", success: function( response ) {
      modal.hide();
      document.querySelector('#myNavigator').popPage();
    } });
    break; }}});
}
function enviar() {
	$("#formulario_agregar").submit(function( event ) {
    var modal = document.querySelector('ons-modal');
    modal.show();
		$.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=agregar_local", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
			success: function(data) { 
        console.log(data);
        modal.hide();
        document.querySelector('#myNavigator').popPage();
        ons.notification.alert({
          message: '¡Los datos de tu local se han agregado con éxito!',
          title: 'Local agregado',
          buttonLabel: 'OK',
          animation: 'default'
        });
			} });
			event.preventDefault();
	});
}
function crear_promo() {
  $("#informacion_promo").submit(function( event ) {
    event.preventDefault();
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=guardar_promo", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) {
      console.log(data);
      modal.hide();
      if(data == '("0")') {
        ons.notification.alert({
          message: '¡Las dimensiones enviadas no son válidas!',
          title: 'Inválido',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      else {
        ons.notification.alert({
          message: '¡La promo se ha cargado con éxito!',
          title: 'Creado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        document.querySelector('#myNavigator').popPage();
        mis_promos();
      }
    } });
  });
}
function eliminar_promo(id) {
  ons.notification.confirm({message:'¿Seguro que quieres eliminar esta promoción?', callback: function(answer) { switch (answer) { 
    case 1: 
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=eliminar_promo&id="+id, "dataType": "jsonp", success: function( response ) {
      modal.hide();
      mis_promos();
    } });
    break; }}});
}
function editar_promo(id, imagen) {
  document.querySelector('#myNavigator').pushPage('html/editarpromo.html', { animation : 'slide', callback: function() {
    $('#id_promo').val(id);
    $('#imagen_fondo').css('background-image', 'url(' + imagen + ')');
  } });
}
function actualizar_promo() {
  $("#informacion_promo").submit(function( event ) {
    event.preventDefault();
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=actualizar_promo", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) {
      console.log(data);
      modal.hide();
      if(data == '("0")') {
        ons.notification.alert({
          message: '¡Las dimensiones enviadas no son válidas!',
          title: 'Inválido',
          buttonLabel: 'OK',
          animation: 'default'
        });
      }
      else {
        ons.notification.alert({
          message: '¡La promo se ha actualizado con éxito!',
          title: 'Creado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        document.querySelector('#myNavigator').popPage();
        mis_promos();
      }
    } });
  });
}