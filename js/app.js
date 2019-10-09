window.myApp = {};
var storage = window.localStorage;
document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }
});

myApp.controllers = {

  PrincipalPage: function(page) {

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

localesPage: function(page) {

  promo('promo_carousel');
  locales('contenido_locales_principal');
  
},
buscarPage: function(page) {
  locales('contenido_busqueda');
}
};