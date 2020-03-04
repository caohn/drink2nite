function onLoad() {
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
  document.addEventListener("menubutton", onMenuKeyDown, false);

  FCMPlugin.getToken(function(token){
      var t = null==token ? "NULL": token;
      storage.setItem('token_drink2nite', token);
      // alert("TOKEN: " +t);
  });
  
  FCMPlugin.subscribeToTopic(localStorage["usuario_drink2nite"]);


  FCMPlugin.onNotification(function(data){
    if(data.wasTapped){
      //Notification was received on device tray and tapped by the user.
      if(data.tipo == 1) {
        ver_evento(data.id_e, data.titulo);
      } 
      if(data.tipo == 2) {
        venue_ir(data.id_v);
      } 
      if(data.tipo == 3) {
        local(data.id_l, data.titulo);
      } 
    }else{
      //Notification was received in foreground. Maybe the user needs to be notified.
      if(data.tipo == 1) {
        ver_evento(data.id_e, data.titulo);
      } 
      if(data.tipo == 2) {
        venue_ir(data.id_v);
      }
      if(data.tipo == 3) {
        local(data.id_l, data.titulo);
      } 
    }
});
}
function onPause() {
}
function onResume() {
}
function onMenuKeyDown() {
}