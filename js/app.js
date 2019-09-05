window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }
});

myApp.controllers = {

  PrincipalPage: function(page) {

    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(localizar, error, options); }  
      else { alert('No soportado!'); }

    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/search"]').onclick = function() {
      document.querySelector('#myNavigator').pushPage('html/buscar.html', {data: {title: 'Buscar'}, animation: 'lift'});
    };

    page.querySelector('[component="button/settings"]').onclick = function() {
      document.querySelector('#myNavigator').pushPage('html/configuracion.html', {data: {title: 'Configuración'}, animation: 'lift'});
    };

    page.querySelector('[component="button/menu"]').onclick = function() {
      document.querySelector('#myNavigator').pushPage('html/menu.html', {data: {title: 'Menu'}, animation: 'lift'});
    };
},

ayudaPage: function(page) {
  html('ayuda', 'contenido_ayuda', 'cargador_ayuda');
},

terminosPage: function(page) {
  html('terminos', 'contenido_terminos', 'cargador_terminos');
}, 

privacidadPage: function(page) {
  html('privacidad', 'contenido_privacidad', 'cargador_privacidad');
},

tonightPage: function(page) {

  promo('promo_carousel');
  locales('contenido_tonight');
  
},
buscarPage: function(page) {
  locales('contenido_busqueda');
}
};

document.addEventListener('prechange', function(event) {
  if(event.tabItem.getAttribute('label') != 'Inicio') {
    document.querySelector('ons-toolbar .center').innerHTML = event.tabItem.getAttribute('label'); } else {
      document.querySelector('ons-toolbar .center').innerHTML = '<img src="img/logo.png" height="30" style="position:relative; top:8px;">';
      }
  });