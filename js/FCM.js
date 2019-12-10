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
}
function onPause() {
}
function onResume() {
}
function onMenuKeyDown() {
}