function localizar(posicion) {
    tipo = localStorage.getItem("tipo");
    if(tipo == null) { tipo = 1; }
    if(tipo == 1) { $('#bar_check').attr('checked','checked'); }
    if(tipo == 2) { $('#club_check').attr('checked','checked'); }
    $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=datos&id="+localStorage["usuario_drink2nite"]+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&tipo="+tipo, "dataType": "jsonp", success: 			function( response2 ) { 
    localStorage["nombre_drink2nite"] = response2.nombre; 
    localStorage["foto_drink2nite"] = response2.foto; 
    localStorage["correo_drink2nite"] = response2.correo; 
    localStorage["fecha_drink2nite"] = response2.fecha;
    localStorage["zoom_drink2nite"] = response2.zoom;
    localStorage["latitud_drink2nite"] = posicion.coords.latitude; 
    localStorage["longitud_drink2nite"] = posicion.coords.longitude; 
    $('.foto_central').attr('src',response2.foto);
    } });
    var latlng = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
    $.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=locales&tipo="+tipo+"&latitud="+posicion.coords.latitude+"&longitud="+posicion.coords.longitude+"&id="+localStorage["usuario_drink2nite"], "dataType": "jsonp", success: function( response ) {
    if(response != null) { 
    var myMarkers = {"markers": response};
    $("#mapa").mapmarker({
      zoom	: parseFloat(localStorage["zoom_drink2nite"]),
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
    console.log("Codigo de error: "+mensaje.code+" msj:"+mensaje.message)
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
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=locales_cerca&lat='+localStorage["latitud_drink2nite"]+'&lon='+localStorage["longitud_drink2nite"];
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {

          content += '<ons-card onclick="ons.notification.alert(\''+ item.lugar +'\')"> <ons-row> <ons-col width="100px" style="padding-right:10px;"><img src="http://drink2nite.com/subidas/logos/'+ item.logo +'" style="width: 100%; border-radius:3px;"> </ons-col> <ons-col><div class="title" style="font-size:18px;"> ' + item.nombre + '</div><span style="color:rgba(255,255,255,0.4); font-size:13px;">'+ item.lugar +'<br>'+ item.distancia +'km</span></ons-col> </ons-row></ons-card>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

    showData.text('Cargando...');

  }

  function promo(id){ 
    var apiSrc = 'http://drink2nite.com/app/index.php?do=drink&act=promos_cerca&lat='+localStorage["latitud_drink2nite"]+'&lon='+localStorage["longitud_drink2nite"];
    var showData = $('#'+id);


    $.getJSON(apiSrc, function(data) {
        console.log(data);

        var content = '';

        $.each(data, function(i, item) {
          content += '<ons-carousel-item><img src="http://drink2nite.com/subidas/promos/'+ item.imagen +'" style="width: 100%; border-radius:3px;"> </ons-carousel-item>';
            //alert(item.title);
        })

        showData.empty();
        showData.append(content);

    });

    showData.text('Cargando...');

  }