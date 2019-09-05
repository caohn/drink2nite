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
	$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=iniciar_sesion&password="+password+"&email="+email, "dataType": "jsonp", success: function( response ) {
	if(response.mensaje == 0) { 
	ons.notification.alert({
		 message: 'Los datos ingresados son incorrectos',
		 title: 'Error',
		 buttonLabel: 'OK',
		 animation: 'default',
	}); } 
	if(response.mensaje != 0) { localStorage["usuario_drink2nite"] = response.mensaje; window.location ="inicio.html";} 
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
	$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=recuperar&email="+email, "dataType": "jsonp", success: function( response ) {
			if(response.mensaje == 0) { 
				ons.notification.alert({ message: 'El correo electrónico ingresado es incorrecto', title: 'Error', buttonLabel: 'OK', animation: 'default' }); 
			} else {
				localStorage["usuario_drink2nite_recuperar"] = response.mensaje; 
				localStorage["codigo_drink2nite"] = response.generado; 
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
	$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=nueva_password&usuario="+localStorage["usuario_drink2nite_recuperar"]+"&password="+password, "dataType": "jsonp", success: function( response ) {
			localStorage["usuario_drink2nite"] = localStorage["usuario_drink2nite_recuperar"];
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
	$.ajax({ "url": "http://drink2nite.com/app/index.php?do=drink&act=registro&nombre="+nombre+"&apellido="+apellido+"&email="+email+"&password="+password+"&d="+d+"&m="+m+"&a="+a+"&sexo="+sexo, "dataType": "jsonp", success: function( response ) {
		if(response.mensaje == 0) { 
		localStorage["usuario_drink2nite"] = response.usuario; 
		ons.notification.alert({
			 message: 'Te has registrado correctamente',
			 title: '¡Felicidades!',
			 buttonLabel: 'Ok',
			 animation: 'default',
		});
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