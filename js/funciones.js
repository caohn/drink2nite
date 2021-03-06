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
    storage.setItem('timeout_drink2nite', 1);
    if(response2.notificacion > 0){ $('#notificaciones_contenedor').html('<span class="notification" style="position: absolute; top: 10px; left:6px;">'+response2.notificacion+'</span>'); } else { $('#notificaciones_contenedor').html(''); }
    /* $('.foto_central').attr('src',response2.foto); */
    } });
    var latlng = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=localesn2&tipo="+tipo+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
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
    $('.cargando_datos, .foto_central, .pulse_holder, ons-progress-bar').fadeOut(); 
    localesx2();
    $("#lugares_proximos").removeClass("arriba medio2");
    $("#lugares_proximos").addClass("medio");
  } });
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
    ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Vamos a proceder, obteniendo datos de tu IP.', { timeout: 1000, animation: 'ascend' });
    if(!localStorage["timeout_drink2nite"]) { localizar_ip(); }
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
      } });
      var latlng = new google.maps.LatLng(response.latitude, response.longitude);
      $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=localesn2&tipo="+tipo+"&latitud="+response.latitude+"&longitud="+response.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
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
      $('.cargando_datos, .foto_central, .pulse_holder, ons-progress-bar').fadeOut();
      localesx2();
      $("#lugares_proximos").removeClass("arriba medio2");
      $("#lugares_proximos").addClass("medio");
    } });
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
  function locales(id,pagina){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=locales_cerca3&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+'&pagina='+pagina;
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);
        var content = '';
        var j = 0;
        $.each(data, function(i, item) {
          j++;
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><div class="logo_local" style="background-image:url(\''+ logo_url +'\');"></div></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.lugar +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+ item.distancia +'km </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" id="color_valoracion">'+ item.valoracion +'</button></span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })

        if(pagina == 1) { showData.empty(); }
        showData.append(content);
        pagina++;
        if(j == 5) {
          $('#boton_cargar').html('<div style="padding:10px;"><ons-button modifier="large" onclick="locales(\'contenido_locales_principal\',\''+pagina+'\');">Cargar más</ons-button></div>').fadeIn();
        } else { $('#boton_cargar').fadeOut(); }
    });
    
  }

  function localesx2(){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=locales_cerca2&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#localesx2');


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<div class="item" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> <ons-row> <ons-col width="80px" style="padding-right:10px; padding-top:5px;"><div class="logo_local2" style="background-image:url(\''+ logo_url +'\');"></div></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span font-size:13px;"><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="margin-right:3px; position:relative; top:-2px;"></ons-icon> '+ item.distancia +'km </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" id="color_valoracion">'+ item.valoracion +'</button></span></ons-col> </ons-row></div>';
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
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<ons-carousel-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"><img src="https://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width: 100%; height:180px; border-radius:3px;"> </ons-carousel-item>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

  }

  function eventos_c(id){ 
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=eventos_cerca&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {
          content += '<ons-carousel-item onclick="ver_evento(\''+ item.id +'\', \''+ item.titulo +'\')" style="position:relative; padding:0;"><div style="height:180px; border-radius:0; overflow:hidden; position:relative;"><div style="text-align:left; padding-top:10px; position:absolute; bottom:35px; left:15px; text-shadow:0 2px 2px #333; z-index:12;"><div class="title" style="font-size:18px; font-weight:bold;">'+item.titulo+'</div><div class="title" style="font-size:14px;">'+item.fecha_i+'</div></div><div class="title" style="font-size:14px; position:absolute; bottom:9px; right:15px; z-index:12;"><img src="'+item.foto+'" style="width:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.completo+'</div><div class="title" style="font-size:14px; position:absolute; bottom:9px; left:15px; z-index:12;"><img src="https://drink2nite.com/subidas/logos/'+item.logo+'" style="width:25px; height:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.nombre+'</div><div class="degradado_negro2" style="bottom:0;"></div><img src="https://drink2nite.com/subidas/eventos/'+ item.imagen +'" style="width: 100%; height:180px;"></div></ons-carousel-item>';

          /*
          content += '<ons-carousel-item onclick="ver_evento(\''+ item.id +'\', \''+ item.titulo +'\')" style="position:relative; padding:15px;"><div style="height:180px; border-radius:20px; overflow:hidden; position:relative;"><div class="title" style="font-size:14px; position:absolute; bottom:9px; right:15px; z-index:12;"><img src="'+item.foto+'" style="width:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.completo+'</div><div class="title" style="font-size:14px; position:absolute; bottom:9px; left:15px; z-index:12;"><img src="https://drink2nite.com/subidas/logos/'+item.logo+'" style="width:25px; height:25px; border-radius:30px; margin-right:4px; position:relative; top:7px;"> '+item.nombre+'</div><div class="degradado_negro2" style="bottom:0;"></div><img src="https://drink2nite.com/subidas/eventos/'+ item.imagen +'" style="width: 100%; height:180px;"></div><div style="text-align:center; padding-top:10px;"><div class="title" style="font-size:18px; font-weight:bold;">'+item.titulo+'</div><div class="title" style="font-size:14px;">'+item.fecha_i+'</div></div></ons-carousel-item>'; 
          */
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

  }

  function local(id, titulo2, logo_url) {
    document.querySelector('#myNavigator').pushPage('html/local.html', { animation : 'slide' }).then(function() {
      $('#titulo_app').html(titulo2);
      $('#boton_right').html('<ons-toolbar-button><i class="ion-md-add" onclick="crear_evento(\''+id+'\',\''+logo_url+'\')"></i></ons-toolbar-button>');
    });
    
     $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=local2&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
      if(response.tipo == 1) { icono = '<img src="img/bar_i.png">'; } else { icono = '<img src="img/club_i.png">'; }
      $('#titulo_local').html(titulo2);
      $('#cargador_local').fadeOut();
        $('#imagen_local').attr('src',response.logo);
        $('#descripcion_local').html(response.descripcion2);
        $('#icono_local').html(icono);
        $('#direccion_local').html(response.direccion);
        $('#botones_local').html(response.botones+'<button class="button button--material" style="margin-top:7px; width: 100%; min-height:30px; line-height:25px; font-weight:bold; background: transparent; border:1px solid rgba(255,255,255,0.2);" onclick="invitar_local(\''+id+'\')"><i class="zmdi zmdi-account-add"></i> Invitar amigos</button>');
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
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<ons-card onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="'+logo_url+'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.direccion +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
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
	  message: '¡Se ha posteado este Check In a tus seguidores, durará 24 horas en la sección de Tonight!',
	  title: 'Check In',
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
	  message: '¡Se ha cerrado tu Check In!',
	  title: 'Check Out',
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
	  message: '¡Se ha cerrado tu Check In!',
	  title: 'Check Out',
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
  ons.notification.toast('<i class="fa fa-circle-notch fa-spin"></i> Cargando datos', { timeout: 1000, animation: 'ascend' });
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
  locales('contenido_locales_principal',1);
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
function ver_mas_usuarios(pagina) {
  var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=tonightv2&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+'&pagina='+pagina+'&cantidad=10';
  var showData = $('#contenido_vermas');
  var cargador = $('#cargador_vermas');

  $.getJSON(apiSrc, function(data) {
      console.log(data);
      var content = '';
      var j = 0;
      $.each(data, function(i, item) {
        j++;
        content += '<ons-list-item onclick="perfil_ver(\''+ item.id +'\', \''+ item.tipo +'\')"> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title" style="padding-bottom:10px;">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
          //alert(item.title);
      })

      if(pagina == 1) { showData.empty(); }
      showData.append(content);
      cargador.hide();
      pagina++;
      if(j == 10) {
        $('#boton_cargar2').html('<div style="padding:10px;"><ons-button modifier="large" onclick="ver_mas_usuarios(\''+pagina+'\');">Cargar más</ons-button></div>').fadeIn();
      } else { 
        $('#boton_cargar2').fadeOut(); }
  });
}
function ver_mas_venues(pagina) {
  var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=tonightv32&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite')+'&pagina='+pagina+'&cantidad=4';
  var showData = $('#contenido_vermas');
  var cargador = $('#cargador_vermas');

  $.getJSON(apiSrc, function(data) {
      console.log(data);
      var content = '';
      var j = 0;
      $.each(data, function(i, item) {
        j++;
        content += '<ons-card onclick="venue_ir(\''+ item.id_v +'\')" style="margin:10px 12px 5px 12px;"><ons-row> <ons-col width="110px" style="padding-right:10px; position: relative;"><div style="position:relative;"> <img style="width:30px; height:30px; border-radius:30px; position:absolute; bottom:-10px; right:15px; border:3px solid #424242;" src="'+item.foto+'"><div class="logo_local" style="background-image:url(https://drink2nite.com/subidas/logos/' + item.logo + ')"></div></div></ons-col><ons-col><div class="title" style="font-size:18px;">' + item.local + '</div><span style="font-size:13px;"><span style="color:rgba(255,255,255,0.6);">'+item.completo+'</span><br><div style="margin-top:8px;"><button class="button button--light" style="line-height:16px; font-size:13px;">'+item.hace+' </button> <a class="button button--light" style="line-height:16px; font-size:13px;" href="https://maps.google.com/?q='+item.latitud+','+item.longitud+'" target="_blank">¿Cómo llegar?</a></div></span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+item.asistencia+'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-chatbubbles" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+item.chat+'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Chats</span></ons-col></ons-row></ons-card>';
          //alert(item.title);
      })

      if(pagina == 1) { showData.empty(); }
      showData.append(content);
      cargador.hide();
      pagina++;
      if(j == 4) {
        $('#boton_cargar2').html('<div style="padding:10px;"><ons-button modifier="large" onclick="ver_mas_venues(\''+pagina+'\');">Cargar más</ons-button></div>').fadeIn();
      } else { 
        $('#boton_cargar2').fadeOut(); }
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
        if(!content) { showData.html('<div style="padding:20px; text-align:center;">No se encontraron personas</div>'); botonm1 = ''; } else { botonm1 = '<button class="button button--light" style="line-height:16px; font-size:13px; float:right;" onclick="document.querySelector(\'#myNavigator\').pushPage(\'html/vermas.html\', {data: {title: \'Ver más\'}, animation: \'slide\', callback: function() { ver_mas_usuarios(\'1\'); } });">Ver más</button>'; }
        showData.prepend('<ul class="list list--material"><li class="list-header list-header--material">Gente cercana'+botonm1+'</li></ul>');
    });

    var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=tonightv3&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#tonigh_contenido2');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {

          content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left" style="position:relative;"> <img style="width:20px; height:20px; border-radius:30px; position:absolute; bottom:8px; right:0; border:3px solid #303030;" src="'+item.foto+'"><div class="logo_local2" style="background-image:url(https://drink2nite.com/subidas/logos/' + item.logo + ')"></div> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle" style="color:#999;">' + item.completo + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';

          // content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="https://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle" sty><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:3px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:3px;"><ons-icon icon="ion-md-person" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> ' + item.completo + ' </button></span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>'; //

          // content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="https://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle" sty><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:3px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.distancia+'km </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:3px;"><ons-icon icon="ion-md-person" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> ' + item.completo + ' </button></span> </div> </ons-list-item>';
            //alert(item.title);
            // content2 += '<ons-list-item onclick="venue_ir(\''+ item.id_v +'\')"> <div class="left"> <img class="list-item__thumbnail" src="https://drink2nite.com/subidas/logos/' + item.logo + '"> </div> <div class="center"> <span class="list-item__title">' + item.local + '</span><span class="list-item__subtitle" sty><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:3px;"><ons-icon icon="ion-md-person" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> ' + item.completo + ' </button></span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) { 
          showData2.html('<div style="padding:20px 20px 0 20px; text-align:center;"><img src="img/checkin.png" style="width:150px; margin-bottom:15px;"><div style="padding-bottom:15px;">No se encontraron check ins</div><div id="realizar_checkin"><div class="titulo">Lugares que te podrían interesar</div><div style="position:relative; height:200px;"><p style="text-align: center; height: 40px; position: absolute; top:0; left: 0; right: 0; bottom: 0; margin: auto; width: 100%;"><ons-progress-circular indeterminate></ons-progress-circular></p></div></div></div>'); botonm2 = ''; 
          realizar_checkin();
        } else { botonm2 = '<button class="button button--light" style="line-height:16px; font-size:13px; float:right;" onclick="document.querySelector(\'#myNavigator\').pushPage(\'html/vermas.html\', {data: {title: \'Ver más\'}, animation: \'slide\', callback: function() { ver_mas_venues(\'1\'); } });">Ver más</button>'; }
        showData2.prepend('<ul class="list list--material"><li class="list-header list-header--material">Check In cercanos'+botonm2+'</li></ul>');
    });
    eventos_c('eventos_carousel');
}
function realizar_checkin(){ 
  var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=locales_cerca2&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
  var showData = $('#realizar_checkin');


  $.getJSON(apiSrc, function(data) {
      console.log(data);

      var content = '';

      $.each(data, function(i, item) {
        logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
        content += '<div class="item" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')" style="padding-top:15px;"> <ons-row> <ons-col width="50px" style="padding-right:10px; padding-top:5px;"><div class="logo_local2" style="background-image:url(\''+ logo_url +'\');"></div></ons-col> <ons-col><div class="title" style="font-size:18px; text-align:left; padding-left:12px;"> ' + item.nombre + '</div><span font-size:13px;"><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="margin-right:3px; position:relative; top:-2px;"></ons-icon> '+ item.distancia +'km </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" id="color_valoracion">'+ item.valoracion +'</button></span></ons-col><ons-col width="80px"><button class="button button--outline" style="margin-top:16px;" onclick="check_in_ahora(\''+item.id+'\')">Check In</button></ons-col></ons-row></div>';
          //alert(item.title);
      })

      showData.empty();
      showData.append('<div class="titulo">Lugares que te podrían interesar</div><div class="contenedor">'+content+'</div>');

  });

}
function check_in_ahora(id) {
	ons.notification.alert({
	  message: '¡Se ha posteado este Check In a tus seguidores, durará 24 horas en la sección de Tonight!',
	  title: 'Check In',
	  buttonLabel: 'OK',
	  animation: 'default',
	  callback: function() {
      var modal = document.querySelector('ons-modal');
		  modal.show();
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=venue&id="+id+"&uid="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
        recargar();
        tonightv2();
				modal.hide();
		  } });
	  }
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
          /*
          1. Realizar Check-In
          2. Asistencia al Check-In
          3. Realizar Check-Out
          4. Realizar Check-In
          5. Comentar en el Check-In
          7. Crear Evento
          8. Asistencia al Evento
          9. Comentar al Evento
          10. Invitación al Evento
          11. Aceptar al Evento
          12. Invitar Local
          13. Aceptar ir a Local
          */
          if(item.tipo == 1) {
            content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="ion-md-flame" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#C81C60;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un Check In</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
         }

         if(item.tipo == 2) {
           if(item.respuesta == 1) { res = 'él invitará'; }
           if(item.respuesta == 2) { res = 'si lo invitas'; }
           if(item.respuesta == 3) { res = 'irá'; }
           if(item.respuesta == 4) { res = 'no asistirá'; icono_m = '<ons-icon icon="ion-md-close-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon>'; } else { icono_m = '<ons-icon icon="ion-md-checkmark-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#19BE64;"></ons-icon>'; }

          content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div>'+icono_m+'</ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha respondido al Check In que '+res+'</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
       }

       if(item.tipo == 3) {
        content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="ion-md-close-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha cerrado el Check In</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col> </ons-row></ons-card>';
     }

     if(item.tipo == 4) {
      logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
      content += '<ons-card onclick="local(\''+ item.id_l +'\', \''+ item.local +'\', \''+logo_url+'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\''+ logo_url +'\');"></div><ons-icon icon="ion-md-flag" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un check in</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col> </ons-row></ons-card>';
   }
   if(item.tipo == 5) {
    content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="ion-md-text" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha comentado el Check In</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col></ons-row></ons-card>';
 }

 if(item.tipo == 7) {
  content += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+ item.local +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="ion-md-text" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha creado un evento</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></span></ons-col></ons-row></ons-card>';
}

if(item.tipo == 8) {
  if(item.respuesta == 1) { res = 'él invitará'; }
  if(item.respuesta == 2) { res = 'si lo invitas'; }
  if(item.respuesta == 3) { res = 'irá'; }
  if(item.respuesta == 4) { res = 'otro día'; icono_m = '<ons-icon icon="ion-md-close-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#F21E05;"></ons-icon>'; } else { icono_m = '<ons-icon icon="ion-md-checkmark-circle" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#19BE64;"></ons-icon>'; }

 content += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+item.local+'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div>'+icono_m+'</ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha respondido al Evento que '+res+'</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
}

if(item.tipo == 9) {

 content += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+item.local+'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="ion-md-text" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha comentado al Evento</div><span style="font-size:13px;">'+ item.titulo +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-clock" style="color:#999; margin-right:3px; position:relative; top:-2px;"></ons-icon> '+item.hace+' </button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> '+item.distancia+' km</button></ons-col></ons-row></ons-card>';
}

if(item.tipo == 10) {

  content += '<ons-card> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="md-drink" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' te ha invitado al Evento '+item.titulo+'</div><span style="font-size:13px;">'+ item.local +'<br><div id="botones_invitar_'+item.id_e+'"><button class="button" style="line-height:16px; font-size:13px; margin-top:10px; background:#e14339;" modifier="material" onclick="aceptar_asistencia(\''+item.id_e+'\')">Aceptar invitación</button> <button class="button" modifier="material" style="line-height:16px; font-size:13px; margin-top:10px; background:#333;" onclick="rechazar_asistencia(\''+item.id_e+'\')">Rechazar</button></div></ons-col></ons-row></ons-card>';
 }

 if(item.tipo == 11) {

  content += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+item.local+'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="md-drink" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha aceptado tu invitación al evento</div><span style="font-size:13px;">'+ item.local +'</ons-col></ons-row></ons-card>';
 }

 if(item.tipo == 12) {

  content += '<ons-card> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="md-drink" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' te ha invitado a este local</div><span style="font-size:13px;">'+ item.local +'<br><div id="botones_invitar_'+item.id+'"><button class="button" style="line-height:16px; font-size:13px; margin-top:10px; background:#e14339;" modifier="material" onclick="aceptar_asistencia_local(\''+item.id+'\')">Aceptar invitación</button> <button class="button" modifier="material" style="line-height:16px; font-size:13px; margin-top:10px; background:#333;" onclick="rechazar_asistencia_local(\''+item.id+'\')">Rechazar</button></div></ons-col></ons-row></ons-card>';
 }

 if(item.tipo == 13) {

  content += '<ons-card onclick="venue_ir(\''+ item.id +'\')"> <ons-row> <ons-col width="60px" style="padding-right:10px; position:relative;"><div class="logo_local2" style="background-image:url(\'https://drink2nite.com/subidas/logos/'+ item.logo +'\');"></div><ons-icon icon="md-drink" style="padding:5px; text-align:center; font-size:20px; border-radius:20px; width:20px; height:20px; position:absolute; top:35px; right:5px; background:#058AF2;"></ons-icon></ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha aceptado tu invitación</div><span style="font-size:13px;">'+ item.local +'</ons-col></ons-row></ons-card>';
 }
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="position:absolute; top:-56px; bottom:0; left:0; right:0; margin:auto; height:160px; text-align:center;"><i class="zmdi zmdi-notifications" style="font-size:64px; display:block; margin:20px 0; text-align:center;"></i><ons-button modifier="large--quiet" disabled="true">No hay notificaciones todavía</ons-button></div>');
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
            boton_asistir = '<button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:10px; border-color:#FE4B36; background:#FE4B36; color:#FFF;" onclick="venue3(\''+id+'\')">Check Out</button>';
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

        if(item.activo == 1) {
          $('#clock').countdown(item.fechac).on('update.countdown', function(event) {
var format = '%H:%M:%S';
if(event.offset.totalDays > 0) {
  format = '%-d día%!d ' + format;
}
if(event.offset.weeks > 0) {
  format = '%-w semana%!w ' + format;
}
$(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
$(this).html('¡El Check-In ha terminado!')
  .parent().addClass('disabled');
}); } else {
$('#clock').html('El Check-In se ha cerrado');
}

            content += '<ons-card> <ons-row> <ons-col width="60px" style="padding-right:10px;"><img src="https://drink2nite.com/subidas/logos/'+ item.logo +'" class="list-item__thumbnail" style="border-radius:30px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.completo + ' ha realizado un Check In</div><span style="font-size:13px;">'+ item.local +'<br><button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;">'+item.hace+' </button> '+boton_asistir+'</span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.cantidad +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-body" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ asistire +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Asistencia</span></ons-col></ons-row></ons-card>';
         
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
        if(!content3) showData3.html('<div style="padding:20px; text-align:center;">No se encontraron chats en este check in</div>');
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
	  title: 'Asistecia',
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
function asistir_evento(id, tipo, invitado) {
  if(tipo == 1) { mensaje = '¡Asistiré y yo invitaré!'; } if(tipo == 2) { mensaje = '¡Invitame y llego!'; } if(tipo == 3) { mensaje = '¡Voy a ir!'; } if(tipo == 4) { mensaje = '¡Hacelo otro día!'; }
  if(tipo != 4) {
  var modal = document.querySelector('ons-modal');
	modal.show();
  ons.notification.alert({
	  message: mensaje,
	  title: 'Asistencia a Evento',
	  buttonLabel: 'OK',
    animation: 'default',
    callback: function() {
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=asistir_evento&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+"&tipo="+tipo+"&invitado="+invitado, "dataType": "jsonp", success: function( response ) {
        modal.hide();
        if(invitado != 1) {
          $('#botones_local').html('<button class="button button--material" style="width: 100%; min-height:30px; line-height:25px; font-weight:bold; background: transparent; border:1px solid rgba(255,255,255,0.2);"><i class="zmdi zmdi-account-add"></i> Asistirás al evento</button>');
        }
		  } });
	  }
  });
}
if(invitado != 1) {
  document.getElementById('action-sheet-dialog').hide();
  document.querySelector('#myNavigator').popPage();
}
}
function asistir_local(id, tipo, invitado) {
  
  mensaje = '¡Asistiré!';
  var modal = document.querySelector('ons-modal');
	modal.show();
  ons.notification.alert({
	  message: mensaje,
	  title: 'Asistencia al Local',
	  buttonLabel: 'OK',
    animation: 'default',
    callback: function() {
		  $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=asistir_local_acepto&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+"&tipo="+tipo+"&invitado="+invitado, "dataType": "jsonp", success: function( response ) {
        modal.hide();
		  } });
	  }
  });
}
function mis_eventos() {
  document.querySelector('#myNavigator').pushPage('html/miseventos.html', {data: {title: 'Mis Check-Ins'}, animation: 'slide', callback:function(){ 
  var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=miseventos&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_miseventos');
    var cargador2 = $('#cargador_miseventos');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          if(item.terminado == 1) {
            cout = '<div style="position:absolute; bottom:15px; font-weight:bold; left:15px; color:#FFF; text-shadow:0 2px 2px #333; z-index:12; font-size:20px;">Evento finalizado</div>';
          } else {
            cout = '<div data-countdown="'+item.fechac+'" style="position:absolute; bottom:15px; font-weight:bold; left:15px; color:#FFF; text-shadow:0 2px 2px #333; z-index:12; font-size:20px;"></div>';
          }
          if(item.imagen) {
          content2 += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+item.titulo+'\')" style="margin:10px 12px 5px 12px; position: relative;overflow: hidden; padding-top: 160px;"><div style=" position: absolute; top: 0; left: 0; right: 0; height:140px; border-bottom:2px solid #333;">'+cout+'<div class="degradado_negro4" style="bottom:0;"></div><img src="https://drink2nite.com/subidas/eventos/'+item.imagen+'" style="margin-bottom: 15px; width: 100%; height:140px;"></div><ons-row> <ons-col width="130px" style="padding-right:10px; position: relative;"><div style="position: relative;"><img src="https://drink2nite.com/subidas/logos/' + item.logo + '" class="list-item__thumbnail" style="width:110px; height:auto; position:relative; border-radius:0px;"></div></ons-col><ons-col><div class="title" style="font-size:18px;">' + item.titulo + '</div><span style="font-size:13px;">'+ item.local +'<br><span style="color:rgba(255,255,255,0.6);">'+item.direccion+'</span><br><div style="margin-top:8px;"><button class="button button--light" style="line-height:16px; font-size:13px; border-color:#FFF; color:#FFF;"><b>Fecha:</b> '+item.fecha+' </button> </div></span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.asistencia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-chatbubbles" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.chat +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Chats</span></ons-col></ons-row></ons-card>';
        } else {
          content2 += '<ons-card onclick="ver_evento(\''+ item.id_e +'\', \''+item.titulo+'\')" style="margin:10px 12px 5px 12px; position: relative;overflow: hidden; padding-top: 160px;"><div style=" position: absolute; top: 0; left: 0; right: 0; height:140px; border-bottom:2px solid #333;">'+cout+'<div class="degradado_negro4" style="bottom:0;"></div><img src="img/evento.jpg" style="margin-bottom: 15px; width: 100%; height:140px;"></div><ons-row> <ons-col width="130px" style="padding-right:10px; position: relative;"><div style="position: relative;"><img src="https://drink2nite.com/subidas/logos/' + item.logo + '" class="list-item__thumbnail" style="width:110px; height:auto; position:relative; border-radius:0px;"></div></ons-col><ons-col><div class="title" style="font-size:18px;">' + item.titulo + '</div><span style="font-size:13px;">'+ item.local +'<br><span style="color:rgba(255,255,255,0.6);">'+item.direccion+'</span><br><div style="margin-top:8px;"><button class="button button--light" style="line-height:16px; font-size:13px; border-color:#FFF; color:#FFF;"><b>Fecha:</b> '+item.fecha+' </button> </div></span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.asistencia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-chatbubbles" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.chat +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Chats</span></ons-col></ons-row></ons-card>';
        }
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) { showData2.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No se encontraron eventos</ons-button></div>'); } else {
          $('[data-countdown]').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
              $this.html(event.strftime('%D días %H:%M:%S'));
            });
          });
        }
        cargador2.hide();
    });
  }});
}
function mis_venues() {
  document.querySelector('#myNavigator').pushPage('html/misvenues.html', {data: {title: 'Mis Check-Ins'}, animation: 'slide', callback:function(){ 
  var apiSrc2 = 'https://drink2nite.com/app/index.php?do=drink&act=misvenues&id='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData2 = $('#contenido_misvenues');
    var cargador2 = $('#cargador_misvenues');

    var content2 = '';
    $.getJSON(apiSrc2, function(data) {
        console.log(data);

        $.each(data, function(i, item) {
          if(item.activo == 0) boton_activo = '<button class="button button--light" style="line-height:16px; font-size:13px;">Cerrado</button>'; else boton_activo = '<button class="button button--outline" style="line-height:16px; font-size:13px; border-color:#FE4B36; background:#FE4B36; color:#FFF;">Check out</button>';
          
          
          content2 += '<ons-card onclick="venue_ir(\''+ item.id_v +'\')" style="margin:10px 12px 5px 12px;"><ons-row> <ons-col width="130px" style="padding-right:10px; position: relative;"><div style="position: relative;"><img src="https://drink2nite.com/subidas/logos/' + item.logo + '" class="list-item__thumbnail" style="width:110px; height:auto; position:relative; border-radius:0px;"></div></ons-col><ons-col><div class="title" style="font-size:18px;">' + item.local + '</div><span style="font-size:13px;"><span style="color:rgba(255,255,255,0.6);">'+item.direccion+'</span><br><div style="margin-top:8px;"><button class="button button--light" style="line-height:16px; font-size:13px;">'+item.hace+' </button> '+boton_activo+'</div></span></ons-col></ons-row><ons-row style="margin-top:20px;"><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-walk" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.distancia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-6px; color:#999;">Distancia (km)</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-contacts" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.asistencia +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Confirmados</span></ons-col><ons-col width="35px" style="padding-right:10px;"><ons-icon icon="ion-md-chatbubbles" size="28px" style="color:#999;"></ons-icon></ons-col><ons-col><span style="font-size:20px;">'+ item.chat +'</span><br><span style="font-size:10px; text-transform:uppercase; position:relative; top:-5px; color:#999;">Chats</span></ons-col></ons-row></ons-card>';
            //alert(item.title);
        })
        showData2.empty();
        showData2.append(content2);
        if(!content2) showData2.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No se encontraron check-ins</ons-button></div>');
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
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content2 += '<ons-list-item onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> <div class="left"> <img style="width:75px; margin-right:10px;" src="' + logo_url + '"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span class="list-item__subtitle">' + item.direccion + '</span> </div> <div class="right"><span style="font-size:20px;">'+ item.distancia +'</span><span style="font-size:11px">km</span></div></ons-list-item>';
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
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<ons-card> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="'+ logo_url +'" style="width: 100%; border-radius:3px;" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> </ons-col> <ons-col><div class="title" style="font-size:18px;" onclick="local(\''+ item.id +'\', \''+ item.nombre +'\')"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.descripcion +'<br><span style="color:rgba(255,255,255,0.8)">'+item.lugar+'</span></span><div><button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:10px;" onclick="editar_local(\''+ item.id +'\')"><ons-icon icon="ion-md-create" style="color:#FFF; margin-right:3px; position:relative; top:-2px;" ></ons-icon> Editar local</button> <button class="button button--light" style="line-height:16px; font-size:13px; margin-top:10px;" onclick="eliminar_local(\''+ item.id +'\', \''+ item.nombre +'\')"><ons-icon icon="ion-md-close" style="color:#999; margin-right:3px; position:relative; top:-2px;" ></ons-icon> Eliminar</button></div></ons-col> </ons-row></ons-card>';
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
          logo_url = 'https://drink2nite.com/subidas/logos/'+ item.logo;
          content += '<ons-list-item><div class="center"><span class="list-item__title"><img class="list-item__thumbnail" style="display:inline-block; margin-top:-6px;" align="middle" src="'+ logo_url +'" onclick="local(\''+ item.id_l +'\', \''+ item.nombre +'\', \''+logo_url+'\')"> <span style="margin:0 0 0 5px; display:inline-block;">' + item.nombre + '</span></span><span class="list-item__subtitle"><img src="https://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width:100%; margin-top:5px; border-radius:10px;"><div style="margin-top:7px;"><ons-button modifier="material" onclick="editar_promo(\''+ item.id +'\', \'https://drink2nite.com/subidas/promos/'+ item.imagen +'\')"><i class="fa fa-pencil"></i> Editar</ons-button> <ons-button modifier="material" onclick="eliminar_promo(\''+ item.id +'\')"><i class="fa fa-trash"></i> Eliminar</ons-button></div></span></div></ons-list-item>';
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
        if(!content) showData.html('<div style="padding:20px; text-align:center;">No se encontraron chats en este check-in</div>');
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
        refrescar();
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
function crear_evento(id, imagen) {
  document.querySelector('#myNavigator').pushPage('html/crearevento.html', { animation : 'slide', callback: function() {
    /* Funciones al abrir el creador */
    $('#imagen_fondo').css('background-image', 'url(' + imagen + ')');
    $('#id_local').val(id);
    $('#usuario_nombre').val(storage.getItem('nombre_drink2nite'));
  } });
}
function crear_ahora() {
  $("#formulario_creare").submit(function( event ) {
  if(!$('#nombre').val()) {
    ons.notification.alert({message: '¡Falta agregar el títutlo del evento!', title: 'Error', buttonLabel: 'OK', animation: 'default'});
    return false;
  }
  if(!$('#h_e').val()) {
    ons.notification.alert({message: '¡Falta agregar la hora del evento!', title: 'Error', buttonLabel: 'OK', animation: 'default'});
    return false;
  }
  if(!$('#fecha').val()) {
    ons.notification.alert({message: '¡Falta agregar la fecha del evento!', title: 'Error', buttonLabel: 'OK', animation: 'default'});
    return false;
  }
  if(!$('#h_c').val()) {
    ons.notification.alert({message: '¡Falta agregar la hora que termina el evento!', title: 'Error', buttonLabel: 'OK', animation: 'default'});
    return false;
  }
  if(!$('#fecha2').val()) {
    ons.notification.alert({message: '¡Falta agregar la fecha que termina el evento!', title: 'Error', buttonLabel: 'OK', animation: 'default'});
    return false;
  }
    var modal = document.querySelector('ons-modal');
    modal.show();
  
		$.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=agregar_evento&id_u="+storage.getItem('usuario_drink2nite'), type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
			success: function(data) { 
        console.log(data);
        modal.hide();
        document.querySelector('#myNavigator').popPage();
        ons.notification.alert({
          message: '¡Los datos de tu evento se han agregado con éxito!',
          title: 'Evento creado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        setTimeout(ver_evento(data.id, data.titulo),1000);
        refrescar();
      } });

			event.preventDefault();
	});
}
function ver_evento(id,titulo) {
  document.querySelector('#myNavigator').pushPage('html/evento.html', { animation : 'slide', callback: function() {
    $('#titulo_app').html(titulo);
    $('#boton_right').html('<ons-toolbar-button onclick="document.getElementById(\'action-sheet-dialogg\').show()" id="right_b" style="display:none;"><ons-icon icon="md-more-vert"></ons-icon></ons-toolbar-button>');
    $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=evento&id="+id+"&uid="+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite'), "dataType": "jsonp", success: function( response ) {
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
     if(response.propietario != storage.getItem('usuario_drink2nite')) {
       if(response.asistencia == 0) {
          $('#botones_local').html('<button class="button button--material" style="width: 100%; min-height:30px; line-height:25px; font-weight:bold; background: transparent; border:1px solid rgba(255,255,255,0.2);" onclick="document.getElementById(\'action-sheet-dialog\').show()"><i class="zmdi zmdi-account-add"></i> Asistiré</button>');

           acciones = '<ons-action-sheet id="action-sheet-dialog" cancelable><ons-action-sheet-button onclick="asistir_evento(\''+id+'\',1)" icon="ion-md-rainy">Yo invito</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_evento(\''+id+'\',2)" icon="ion-md-body">Si me invitas</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_evento(\''+id+'\',3)" icon="ion-md-walk">Voy a llegar</ons-action-sheet-button><ons-action-sheet-button onclick="asistir_evento(\''+id+'\',4)" icon="md-close">Mejor otro día</ons-action-sheet-button></ons-action-sheet>';
         } else {
           acciones = '';
           if(response.asistencia == 1) {
             texto_asistencia = 'Yo invitaré';
           } if(response.asistencia == 2) {
             texto_asistencia = 'Si me invitas';
           } if(response.asistencia == 3) {
             texto_asistencia = 'Voy a llegar';
           } if(response.asistencia == 4) {
             texto_asistencia = 'Has propuesto otro día';
           }
           $('#botones_local').html('<button class="button button--material" style="width: 100%; min-height:30px; line-height:25px; font-weight:bold; background: transparent; border:1px solid rgba(255,255,255,0.2);" onclick="cancelar_asistencia(\''+id+'\'); $(\'#botones_local\').html(\'Cancelado\');">Cancelar asistencia</button>');
         }
         acciones2 = '';
     } else {
       acciones = '';
       $('#right_b').fadeIn();
       acciones2 = '<ons-action-sheet id="action-sheet-dialogg" cancelable><ons-action-sheet-button onclick="editar_evento(\''+id+'\',\''+response.promo2+'\',\''+response.logo+'\',\''+response.hh1+'\',\''+response.hh2+'\',\''+response.ff1+'\',\''+response.ff2+'\',\''+titulo+'\',\''+response.descripcion+'\',\''+response.comentar+'\',\''+response.tipo+'\')" icon="md-edit">Editar evento</ons-action-sheet-button><ons-action-sheet-button onclick="eliminar_evento(\''+id+'\')" modifier="destructive" icon="md-delete">Eliminar evento</ons-action-sheet-button></ons-action-sheet>';
     }
     $('#acciones_menu2').html(acciones2);
     $('#botones_evento').html('<button class="button button--material" style="width: 49%; font-weight:bold; background:transparent; border:1px solid rgba(255,255,255,0.2)" onclick="agregar_calendario(\''+titulo+'\', \''+response.direccion+'\', \''+response.descripcion+'\',\''+response.y1+'\',\''+response.y2+'\',\''+response.m1+'\',\''+response.m2+'\',\''+response.d1+'\',\''+response.d2+'\',\''+response.h1+'\' ,\''+response.h2+'\',\''+response.mi1+'\',\''+response.mi2+'\')"><i class="zmdi zmdi-calendar-alt"></i> Agregar evento</button> <button onclick="invitar_evento(\''+id+'\')" class="button button--material" style="width: 49%; font-weight:bold; background: #df453f;"><i class="zmdi zmdi-mail-reply"></i> Invitar amigos</button>');
     $('#cargador_local').fadeOut();
     $('#titulo_evento').html(titulo);
     $('#titulo_local').html(response.nombre);
     $('#imagen_local').attr('src',response.logo);
     $('#descripcion_local').html(response.descripcion2);
     $('#datos_animados').fadeOut();
     $('#datos_reales').delay(400).fadeIn();
     $('#direccion_local').html('<span style="color:#FFF;">Dirección:</span> '+response.direccion);
     $('#distancia_local').html('<span style="color:#FFF;">Distancia:</span> '+response.distancia+'km <a class="button button--light" style="line-height:7px; padding:3px 4px; font-size:11px;" href="https://maps.google.com/?q='+response.latitud+','+response.longitud+'" target="_blank">Como llegar</a>');
     $('#carga_rapida_local').hide();
     $('#evento_id').val(id);
     $('#usuario_id').val(storage.getItem('usuario_drink2nite'));
     $('#usuario_nombre').val(storage.getItem('nombre_drink2nite'));
     $('#usuario_foto').val(storage.getItem('foto_drink2nite'));
     $('#foto_persona, #foto_persona2').attr("src",storage.getItem('foto_drink2nite'));
     $('#nombre_persona, #nombre_persona2').html(storage.getItem('nombre_drink2nite'));
     $('#publicaciones_10').html(response.publicaciones);
     $('#fecha_evento').html(response.fecha);
     $('#autor_evento').html(response.autor);
     $('#descripcion_evento').html(response.descripcion);
     $('#n_comentarios').html(response.comentarios);
     $('#n_invitados').html(response.invitados);
     $('#n_confirmados').html(response.aceptado);
     $('#acciones_menu').html(acciones);

     $('#clock').countdown(response.fechac)
.on('update.countdown', function(event) {
  var format = '%H:%M:%S';
  if(event.offset.totalDays > 0) {
    format = '%-d día%!d ' + format;
  }
  if(event.offset.weeks > 0) {
    format = '%-w semana%!w ' + format;
  }
  $(this).html(event.strftime(format));
})
.on('finish.countdown', function(event) {
  $(this).html('¡El evento ha terminado!')
    .parent().addClass('disabled');
$('#botones_evento').html('');
$('#botones_local').html('');
});
    } });
  } });
}
function escribir_comentario() {
  $("#publicar_comentario").submit(function( event ) {
    
    event.preventDefault();
    evento_id = $('#evento_id').val();
    texto = $('#texto').val();
    if(texto == '') { $('#texto').focus(); return false; }
    var modal = document.querySelector('ons-modal');
    modal.show();
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=publicar_comentario", type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
    success: function(data) { 
      console.log(data);
      $('#publicacion_nueva').html(data).fadeIn();
      cerrar_publicar();
      modal.hide();
      $('#no_hay_comentarios').hide();
    } });

  });
}
function invitar_evento(id) {
  document.querySelector('#myNavigator').pushPage('html/invitar.html', { animation : 'slide', callback: function() {
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=invitar_evento&id='+id+'&idu='+storage.getItem('usuario_drink2nite');
    var showData = $('#contenido_invitar');
    var cargador = $('#cargador_invitar');
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          if(item.invitado == null) { boton = '<button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:3px;" onclick="invitar(\''+id+'\',\''+item.id+'\')">Invitar al evento</button>'; } else { boton = 'Ya está invitado'; }
          content += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span id="botoninvitar_'+item.id+'" class="list-item__subtitle">'+ boton +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No tienes seguidores para invitar</ons-button></div>');
        $(cargador).fadeOut();
  
    });
  } });
}
function invitar_local(id) {
  document.querySelector('#myNavigator').pushPage('html/invitar.html', { animation : 'slide', callback: function() {
    var apiSrc = 'https://drink2nite.com/app/index.php?do=drink&act=invitar_local&id='+id+'&idu='+storage.getItem('usuario_drink2nite')+'&lat='+storage.getItem('latitud_drink2nite')+'&lon='+storage.getItem('longitud_drink2nite');
    var showData = $('#contenido_invitar');
    var cargador = $('#cargador_invitar');
  
  
    $.getJSON(apiSrc, function(data) {
        console.log(data);
  
        var content = '';
  
        $.each(data, function(i, item) {
          if(item.invitado == null) { boton = '<button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:3px;" onclick="invitar2(\''+id+'\',\''+item.id+'\')">Invitar al local</button>'; } else { boton = 'Ya está invitado'; }
          
          content += '<ons-list-item> <div class="left"> <img class="list-item__thumbnail" src="'+item.foto+'"> </div> <div class="center"> <span class="list-item__title">' + item.nombre + '</span><span id="botoninvitar_'+item.id+'" class="list-item__subtitle"><button class="button button--outline" style="line-height:16px; font-size:13px; margin-top:3px; border-color:rgba(255,255,255,0.2);"><ons-icon icon="ion-md-walk" style="color:#999; margin-right:3px; position:relative; top:-2px;" class="ons-icon ion-md-walk ons-icon--ion" modifier="material"></ons-icon> '+item.distancia+'km</button> '+ boton +'</span> </div> </ons-list-item>';
            //alert(item.title);
        })
  
        showData.empty();
        showData.append(content);
        if(!content) showData.html('<div style="padding:20px; text-align:center;"><img src="img/noi.png" width="40%" style="display:block; margin:20px auto 20px auto;"><ons-button modifier="large--quiet" disabled="true">No tienes seguidores para invitar</ons-button></div>');
        $(cargador).fadeOut();
  
    });
  } });
}
function invitar(id, usuario) {
    $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=invitar_usuario&id="+id+"&usuario="+usuario+"&usuario2="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
      $('#botoninvitar_'+usuario).html('Invitación enviada');
    } });
}
function invitar2(id, usuario) {
  $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=invitar_usuario2&id="+id+"&usuario="+usuario+"&usuario2="+storage.getItem('usuario_drink2nite'), "dataType": "jsonp", success: function( response ) {
    $('#botoninvitar_'+usuario).html('Invitación enviada');
  } });
}
function agregar_calendario(titulo,lugar,notas,y1,y2,m1,m2,d1,d2,h1,h2,mi1,mi2) {
  var startDate = new Date(y1,m1,d1,h1,mi1,0,0,0); 
  var endDate = new Date(y2,m2,d2,h2,mi2,0,0,0);
  var title = titulo;
  var eventLocation = lugar;
  var notes = notas;
  var success = function(message) { 
    ons.notification.alert({
    message: '¡Los datos del evento '+titulo+' se han agregado con éxito al calendario!',
    title: 'Evento agregado',
    buttonLabel: 'OK',
    animation: 'default'
  }); 
};
  var error = function(message) { alert("Hubo un error al momento de agregar el evento"); };
  window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
}
function rechazar_asistencia(id) {
  $('#botones_invitar_'+id).html('Se rechazó');
  cancelar_asistencia(id,2);
}
function aceptar_asistencia(id) {
  $('#botones_invitar_'+id).html('Se aceptó');
  asistir_evento(id,3,1);
}
function rechazar_asistencia_local(id) {
  $('#botones_invitar_'+id).html('Se rechazó');
  cancelar_asistencia_local(id,2);
}
function aceptar_asistencia_local(id) {
  $('#botones_invitar_'+id).html('Se aceptó');
  asistir_local(id,3,1);
}
function cancelar_asistencia(id,tipo) {
  var modal = document.querySelector('ons-modal');
  modal.show();
  if(tipo == 2) {
    tipoc = 2;
  } else {
    tipoc = 1;
  }
  $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=cancelar_asistencia&id="+id+"&usuario="+storage.getItem('usuario_drink2nite')+"&tipo="+tipoc, "dataType": "jsonp", success: function( response ) {
    modal.hide();
    ons.notification.alert({
      message: '¡Se ha cancelado la asistencia!',
      title: 'Asistencia',
      buttonLabel: 'OK',
      animation: 'default'
    });
    } });
}
function cancelar_asistencia_local(id,tipo) {
  var modal = document.querySelector('ons-modal');
  modal.show();
  if(tipo == 2) {
    tipoc = 2;
  } else {
    tipoc = 1;
  }
  $.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=cancelar_asistencia_local&id="+id+"&usuario="+storage.getItem('usuario_drink2nite')+"&tipo="+tipoc, "dataType": "jsonp", success: function( response ) {
    modal.hide();
    ons.notification.alert({
      message: '¡Se ha cancelado la asistencia!',
      title: 'Asistencia',
      buttonLabel: 'OK',
      animation: 'default'
    });
    } });
}
function editar_evento(id, imagen, logo, h1, h2, fecha1, fecha2, titulo, descripcion, comentar, tipo) {
  document.querySelector('#myNavigator').pushPage('html/editarevento.html', { animation : 'slide', callback: function() {
    $('#id_evento').val(id);
    $('#usuario_nombre').val(storage.getItem('nombre_drink2nite'));
    $('#imagen_fondo').css('background-image', 'url(' + logo + ')');
    $('#imagen_evento').css('background-image', 'url(' + imagen + ')');
    $('#nombre').val(titulo);
    $('#descripcion').text(descripcion);
    $('#h_e').val(h1);
    $('#fecha1').val(fecha1);
    $('#h_c').val(h2);
    $('#fecha2').val(fecha2);
    document.getElementById("comentar").selectedIndex = comentar;
    document.getElementById("tipo").selectedIndex = tipo;
  } });
}
function modificar_evento() {
	$("#formulario_modificare").submit(function( event ) {
    var modal = document.querySelector('ons-modal');
    modal.show();
  
		$.ajax({ url: "https://drink2nite.com/app/index.php?do=drink&act=modificar_evento&id_u="+storage.getItem('usuario_drink2nite'), type:"POST", data: new FormData(this), contentType: false, cache: false, processData:false,
			success: function(data) { 
        console.log(data);
        modal.hide();
        document.querySelector('#myNavigator').popPage();
        ons.notification.alert({
          message: '¡Los datos de tu evento se han modificado con éxito!',
          title: 'Evento modificado',
          buttonLabel: 'OK',
          animation: 'default'
        });
        refrescar();
      } });

			event.preventDefault();
	});
}