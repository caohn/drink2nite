var storage = window.localStorage;
function iniciar_sesion() {
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(email == '' || !expr.test(email)) { ons.notification.alert({
		message: 'Ingresa un correo electrónico válido',
		title: 'Error',
		buttonLabel: 'OK',
		animation: 'default',
   }); return false; }
	if(password == '') { ons.notification.alert({
		message: 'Ingresa el campo de contraseña',
		title: 'Error',
		buttonLabel: 'OK',
		animation: 'default',
   }); return false; }
	$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=iniciar_sesion&password="+password+"&email="+email, "dataType": "jsonp", success: function( response ) {
	if(response.mensaje == 0) { 
	ons.notification.alert({
		 message: 'Los datos ingresados son incorrectos',
		 title: 'Error',
		 buttonLabel: 'OK',
		 animation: 'default',
	}); } 
	if(response.mensaje != 0) { 
		storage.setItem('usuario_drink2nite', response.mensaje);
		storage.setItem('nombre_drink2nite', response.nombre);
		storage.setItem('correo_drink2nite', response.correo);
		storage.setItem('foto_drink2nite', response.foto);
		storage.setItem('seguidos_drink2nite', response.seguidos);
		storage.setItem('seguidores_drink2nite', response.seguidores);
		window.location ="inicio.html";
	} 
	} });
}
function deshabilitado() {
	ons.notification.alert({
			 message: 'Temporalmente deshabilitado',
			 title: 'Error',
			 buttonLabel: 'OK',
			 animation: 'default',
		});
}
function recuperar() {
	email = document.getElementById("email2").value;
	expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(email == '' || !expr.test(email)) { ons.notification.alert({
		message: 'Ingrese un correo electrónico válido',
		title: 'Error',
		buttonLabel: 'OK',
		animation: 'default',
   }); return false; }
	var modal = document.querySelector('ons-modal');
	modal.show();
	$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=recuperar&email="+email, "dataType": "jsonp", success: function( response ) {
			if(response.mensaje == 0) { 
				ons.notification.alert({ message: 'El correo electrónico ingresado es incorrecto', title: 'Error', buttonLabel: 'OK', animation: 'default' }); 
			} else {
				storage.setItem('usuario_drink2nite_recuperar', response.mensaje);
				storage.setItem('codigo_drink2nite', response.generado);
				myNavigator.pushPage('recuperar2.html', { animation : 'slide' } ); 
			}
			modal.hide();
		}
	});
}
function recuperar2() {
	codigo = document.getElementById("codigo").value;
	if(localStorage["codigo_drink2nite"] == codigo) { myNavigator.pushPage('recuperar3.html', { animation : 'slide' } ); } else {
		ons.notification.alert({
					 message: 'El código ingresado es incorrecto',
					 title: 'Error',
					 buttonLabel: 'OK',
					 animation: 'default'
				}); 
		document.getElementById("codigo").focus();
	}
}
function recuperar3() {
	password = document.getElementById("nueva_password").value;
	password2 = document.getElementById("nueva_password2").value;
	if(password == password2) { 
	modal.show();
	$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=nueva_password&usuario="+localStorage["usuario_drink2nite_recuperar"]+"&password="+password, "dataType": "jsonp", success: function( response ) {
		storage.setItem('usuario_drink2nite', storage.getItem('usuario_drink2nite_recuperar'));
		storage.setItem('nombre_drink2nite', response.nombre);
		storage.setItem('correo_drink2nite', response.correo);
		storage.setItem('foto_drink2nite', response.foto);
		storage.setItem('seguidos_drink2nite', response.seguidos);
		storage.setItem('seguidores_drink2nite', response.seguidores);
			modal.hide();
			window.location ="inicio.html";
		}
	});
	} else {
		ons.notification.alert({
					 message: 'Las contraseñas no coinciden',
					 title: 'Error',
					 buttonLabel: 'OK',
					 animation: 'default'
				}); 
		document.getElementById("codigo").focus();
	}
}
function registro_1() {
	nombre = document.getElementById("nombre").value;
	apellido = document.getElementById("apellido").value;
	email = document.getElementById("email3").value;
	password = document.getElementById("password2").value;
	d = document.getElementById("dia").value;
	m = document.getElementById("mes").value;
	a = document.getElementById("year").value;
	sexo = document.getElementById("sexo").value;
	expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(nombre == '' || apellido == '' || email == '' || !expr.test(email) || password == '') {
		if(nombre == '') { ons.notification.alert({
			message: 'Ingrese un nombre',
			title: 'Error',
			buttonLabel: 'OK',
			animation: 'default',
	   }); return false; }
		if(apellido == '') { ons.notification.alert({
			message: 'Ingrese un apellido',
			title: 'Error',
			buttonLabel: 'OK',
			animation: 'default',
	   }); return false; }
		if(email == '' || !expr.test(email)) { ons.notification.alert({
			message: 'Ingrese un correo electrónico válido',
			title: 'Error',
			buttonLabel: 'OK',
			animation: 'default',
	   }); return false; }
		if(password == '') { ons.notification.alert({
			message: 'Ingrese una contraseña',
			title: 'Error',
			buttonLabel: 'OK',
			animation: 'default',
	   }); return false; }
	}
	$.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=registro&nombre="+nombre+"&apellido="+apellido+"&email="+email+"&password="+password+"&d="+d+"&m="+m+"&a="+a+"&sexo="+sexo, "dataType": "jsonp", success: function( response ) {
		if(response.mensaje == 0) { 
		storage.setItem('usuario_drink2nite', response.usuario);
		storage.setItem('nombre_drink2nite', response.nombre);
		storage.setItem('correo_drink2nite', response.correo);
		storage.setItem('foto_drink2nite', response.foto);
		storage.setItem('seguidos_drink2nite', response.seguidos);
		storage.setItem('seguidores_drink2nite', response.seguidores);
		window.location ="inicio.html"; }
		if(response.mensaje == 1) { 
		ons.notification.alert({
			 message: 'Este correo ya esta registrado',
			 title: 'Lo sentimos',
			 buttonLabel: 'Ok',
			 animation: 'default',
		}); } 
	}
	});
}
function loginWithFB() {
    facebookConnectPlugin.login(["public_profile", "email", "user_birthday"], function(result) {
        //calling api after login success
        facebookConnectPlugin.api("/me?fields=email,name,picture,birthday",
            ["public_profile", "email", "user_birthday"],
            function(userData) {
				//API success callback
				correo = userData.email;
				nombre = userData.name;
				foto = userData.picture.data.url;
				fecha = userData.birthday;
				id = userData.id;
				var modal = document.querySelector('ons-modal');
				modal.show();
                $.ajax({ "url": "https://drink2nite.com/app/index.php?do=drink&act=login_fb&nombre="+nombre+"&email="+correo+"&fecha="+fecha+"&id="+id+"&foto="+foto, "dataType": "jsonp", success: function( response ) {
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
            function(error) {
                //API error callback
                alert(JSON.stringify(error));
            });
    }, function(error) {
        //authenication error callback
        alert(JSON.stringify(error));
    });
}