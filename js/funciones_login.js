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
    /* $('.foto_central').attr('src',response2.foto); */
    } });
    var latlng = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=localesn&tipo="+tipo+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
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
  function refrescar() {
    $('#icono_refrescar').hide();
    $('#icono_refrescar_vueltas').show();
    
    ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Cargando datos', { timeout: 1000, animation: 'ascend' });
      if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: false,
          timeout: 25000,
          maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(localizar, error, options); 
        visita = storage.getItem('visita_drink2nite');
        if(!visita) {
          storage.setItem('visita_drink2nite', 1);
          window.location ="inicio_login.html";
        }
      }  
        else { alert('No soportado!'); }
  }
  function login_google() {
    window.plugins.googleplus.login(
        {},
        function (obj) {
        correo = obj.email;
				nombre = obj.displayName;
				foto = obj.imageUrl;
				id = obj.userId;
				var modal = document.querySelector('ons-modal');
				modal.show();
       $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=login_google&nombre="+nombre+"&email="+correo+"&id="+id+"&foto="+foto, "dataType": "jsonp", success: function( response ) {
					storage.setItem('usuario_drink2nite', response.usuario);
					storage.setItem('nombre_drink2nite', response.nombre);
					storage.setItem('correo_drink2nite', response.correo);
					storage.setItem('foto_drink2nite', response.foto);
					storage.setItem('seguidos_drink2nite', response.seguidos);
					storage.setItem('seguidores_drink2nite', response.seguidores);
					modal.hide();
					window.location ="inicio.html";
					}
        });
        },
        function (msg) {
          alert("error: " + msg);
        }
    );
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

  function error(mensaje)  {
      /* window.location ="inicio.html"; 
    location.reload(); */
    ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Tiempo agotado, obteniendo datos de tu IP.', { timeout: 1000, animation: 'ascend' });
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
      $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=localesn&tipo="+tipo+"&latitud="+response.latitude+"&longitud="+response.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
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

          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><div class="logo_local" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.lugar +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+ item.distancia +'km </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" id="color_valoracion">'+ item.valoracion +'</button></span></ons-col> </ons-row></ons-card>';
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
    login_inicio();
  }
  function publicar2() {
    login_inicio();
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
		login_inicio();
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
	login_inicio();
}
function seguir(id,tipo) {
	login_inicio();
}
function favoritos(id,tipo) {
	login_inicio();
}
function venue(id) {
	login_inicio();
}
function venue2(id) {
	login_inicio();
}
function venue3(id) {
	login_inicio();
}
function reportar(id,tipo) {
	login_inicio();
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
  storage.removeItem('apellidos_drink2nite');
  storage.removeItem('codigo_drink2nite');
  storage.removeItem('fecha_drink2nite');
  storage.removeItem('foto_drink2nite');
  storage.removeItem('ip_drink2nite');
  storage.removeItem('nombre_drink2nite');
  storage.removeItem('nombres_drink2nite');
  storage.removeItem('seguidores_drink2nite');
  storage.removeItem('seguidos_drink2nite');
  storage.removeItem('usuario_drink2nite_recuperar');
  storage.removeItem('correo_drink2nite');
	window.location ="inicio_login.html";
}
function locales_mostrar_todo() {
  promo('promo_carousel');
  locales('contenido_locales_principal');
}
function perfil_propio(){

}
function seguidores(id, contenedor, cargador){ 
  login_inicio();
}
function seguidos(id, contenedor, cargador){ 
  login_inicio();
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

        content2 += '<ons-list-item onclick="login_inicio()"> <div class="left" style="position:relative;"> <img style="width:20px; height:20px; border-radius:30px; position:absolute; bottom:8px; right:0; border:3px solid #303030;" src="'+item.foto+'"><div class="logo_local2" style="background-image:url(https://drink2nite.com/subidas/logos/' + item.logo + ')"></div> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle" style="color:#999;">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
      })
      showData2.empty();
      showData2.append(content2);
      if(!content2) showData2.html('<div style="padding:20px; text-align:center;">No se encontraron check ins</div>');
      showData2.prepend('<ul class="list list--material"><li class="list-header list-header--material">Check In cercanos</li></ul>');
  });
  eventos_c('eventos_carousel');
}
function eventos_c(id){ 
  var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=eventos_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
  var showData = $('#'+id);


  $.getJSON(apiSrc, function(data) {
      console.log(data);

      var content = '';

      $.each(data, function(i, item) {
        content += '<ons-carousel-item onclick="login_inicio()" style="position:relative; padding:0;"><div style="height:180px; border-radius:0; overflow:hidden; position:relative;"><div style="text-align:left; padding-top:10px; position:absolute; bottom:35px; left:15px; text-shadow:0 2px 2px #333; z-index:12;"><div class="title" style="font-size:18px; font-weight:bold;">'+item.titulo+'</div><div class="title" style="font-size:14px;">'+item.fecha_i+'</div></div><div class="title" style="font-size:14px; position:absolute; bottom:9px; right:15px; z-index:12;"><img src="'+item.foto+'" style="width:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.completo+'</div><div class="title" style="font-size:14px; position:absolute; bottom:9px; left:15px; z-index:12;"><img src="https://drink2nite.com/subidas/logos/'+item.logo+'" style="width:25px; height:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.nombre+'</div><div class="degradado_negro2" style="bottom:0;"></div><img src="https://drink2nite.com/subidas/eventos/'+ item.imagen +'" style="width: 100%; height:180px;"></div></ons-carousel-item>';

      })

      showData.empty();
      showData.append(content);

  });

}
function notificacion(){ 
  login_inicio();
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
  login_inicio();
}
function mis_venues() {
  login_inicio();
}
function mis_favoritos() {
  login_inicio();
}
function mis_locales(id, contenedor, cargador){ 
  login_inicio();
}
function escribir_chat(event) {
  login_inicio();
}
function editar_cuenta() {
  login_inicio();
}
function editar_acceso() {
  login_inicio();
}
function editar_local(id) {
  login_inicio();
}
function editar_local_guardar() {
  login_inicio();
}
function eliminar_local(id, nombre) {
  login_inicio();
}
function enviar() {
	login_inicio();
}
function login_inicio() {
  document.querySelector('#myNavigator').pushPage('html/login.html', {data: {title: 'Login'}, animation: 'slide'});
}
function crear_evento(id) {
  login_inicio();
}