	var usuarioActual = "";

function prepareBinding(){
	$( "#btnLogin" ).click(function() { 
		comprobarUsuario();
	});

$( "a" ).click(function() { 
		cargarCarreras();
		cargarEstudiantes();
		cargarUsuarios();
	});

	cargarCarreras();
	cargarEstudiantes();
	cargarUsuarios();
	usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
$(".msj").html("<p><font color=#FF0000>¡Hola!: </font> "+usuarioActual+" <a href=login.html>  &#187;Salir&#171;</a> </p>");

};

function cargarEstudiantes(){
	var students = JSON.parse(localStorage.getItem('students'));
	if (students === null) {
		students = [];
	};
	var table = "<table> <tr><th><font color=#0404B4><center>C&eacute;dula</th><th><center><font color=#0404B4>Nombre</th><th><font color=#0404B4>Carrera</th><th><font color=#FF0000>Eliminar</th><th><font color=#FF0000>Editar</th></font><th><img class=createStudent src=Create.png /></th></tr>";
	for (var i = 0; i < students.length; i++) {
		table += "<tr><td>"+students[i].cedula +"</td><td>"+students[i].nombre+"</td><td>"+students[i].carrera+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteStudent /></td><td><img class=editStudent src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#estudiantes').html(table);
	$(".editStudent").click(function(){
		var index = $(this).data('index');
		editarEstudiantes(index);
	});

	$(".deleteStudent").click(function(){
		var index = $(this).data('index');
		borrarEstudiantes(index);
	});

	$(".createStudent").click(function(){
		crearEstudiantes();
	});
};

function cargarCarreras(){
	var careers = JSON.parse(localStorage.getItem('careers'));
	if (careers === null) {
		careers = [];
	};
	var table = "<table> <tr><th><font color=#0404B4><center>C&oacute;digo</th><th><font color=#0404B4><center>Nombre</th><th><font color=#FF0000>Eliminar</th><th><font color=#FF0000>Editar</th><th><img class=createCareer src=Create.png /></th></tr>";
	for (var i = 0; i < careers.length; i++) {
		table += "<tr><td>"+careers[i].codigo +"</td><td>"+careers[i].nombre+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteCareer /></td><td><img class=editCareer src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#carreras').html(table);

	$(".editCareer").click(function(){
		var index = $(this).data('index');
		editarCarreras(index);
	});

	$(".deleteCareer").click(function(){
		var index = $(this).data('index');
		borrarCarreras(index);
	});

	$(".createCareer").click(function(){
		crearCarrera();
	});
};

function cargarUsuarios(){
	var users = JSON.parse(localStorage.getItem('users'));
	if (users === null) {
		users = [];
	};
	var table = "<table> <tr><th><center><font color=#0404B4>C&eacute;dula</th><th><font color=#0404B4><center>Nombre</th><th><font color=#0404B4>Usuario</th><th><font color=#0404B4>Rol</font></th><th><font color=#FF0000>Eliminar</th><th><font color=#FF0000>Editar</th><th><img class=createUser src=Create.png /></th></tr>";
	for (var i = 0; i < users.length; i++) {
		table += "<tr><td>"+users[i].cedula +"</td><td>"+users[i].nombre+"</td><td>"+users[i].username+"</td><td>"+users[i].role+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteUser /></td><td><img class=editUser src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#usuarios').html(table);

	$(".editUser").click(function(){
		var index = $(this).data('index');
		editarUsuario(index);
	});

	$(".deleteUser").click(function(){
		var index = $(this).data('index');
		borrarUsuarios(index);
	});

	$(".createUser").click(function(){
		crearUsuario();
	});
};

function borrarCarreras(index){
	var careers = JSON.parse(localStorage.getItem('careers'));
	delete careers[index];
	var arreglo = [];
	for (var i = 0; i <= careers.length; i++) {
		if (careers[i]==null) {

		}
		else{
			arreglo.push(careers[i]);
		};
	};
    // volver a Salvar en Local_Storage
    localStorage.setItem('careers',JSON.stringify(arreglo));
    cargarCarreras();
};

function borrarEstudiantes(index){
	var students = JSON.parse(localStorage.getItem('students'));
	delete students[index];
	var arreglo = [];
	for (var i = 0; i <= students.length; i++) {
		if (students[i]==null) {

		}
		else{
			arreglo.push(students[i]);
		};
	};
    // volver a Salvar en Local_Storage
    localStorage.setItem('students',JSON.stringify(arreglo));
    cargarEstudiantes();
};

function borrarUsuarios(index){
	var users = JSON.parse(localStorage.getItem('users'));
	delete users[index];
	var arreglo = [];
	for (var i = 0; i <= users.length; i++) {
		if (users[i]==null) {

		}
		else{
			arreglo.push(users[i]);
		};
	};
    // volver a Salvar en Local_Storage
    localStorage.setItem('users',JSON.stringify(arreglo));
    cargarUsuarios();
};

function crearEstudiantes(){
	var careers = JSON.parse(localStorage.getItem('careers'));
    if (careers === null) {
    	careers = [];
    }
    var combo = "<select id=carrera name=carrera>";
    for (var i = 0; i < careers.length; i++) {
    	combo += "<option value="+careers[i].codigo+">"+careers[i].nombre+"</option>";
    };
    combo += "</select>";
	var html = "<form><input type=file name=datafile size=40 /><output id=result /><br/><label>C&eacute;dula:  </label> <input type=text id=cedula name=cedula maxlength=9 size=9 ></input><br/>"
	+"<br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 ></input><br/>"
	+"<br><label for=carrera>Carrera:  </label> " + combo + "<br/><br><label>Nivel de Ingl&eacute;s:  </label> <br/>"
	+"<input type=radio id=ingles name=ingles value=Bajo> Bajo </input> <input type=radio id=ingles name=ingles value=Intermedio > Intermedio </input>"
    +"<input type=radio id=ingles name=ingles value=Alto > Alto </input><br/>"
	+"<br><center><input type=button value=Guardar onclick=guardarEstudianteCreado() /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarEstudiantes() />";
	$('#estudiantes').html(html);
};

function guardarEstudianteCreado(){
	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	carrera = $('#carrera').val(),
	ingles = $("input[name='ingles']:checked").val(),
	imagen = $('input[type=file]').val().split('\\').pop();
 	
	if (cedula == "" || nombre == "") {
		crearEstudiantes();
	}
	else{
	// crear objeto estudiante
	var student = { "cedula": cedula, "nombre": nombre, "carrera": carrera, "ingles": ingles, "imagen": imagen};

    // leer los estudiantes de localstorage
    var students = JSON.parse(localStorage.getItem('students'));
    if (students === null) {
    	students = [];
    }

    // agregar el estudiante
    students.push(student);

    // volver guardar en localstoraage
    localStorage.setItem('students',JSON.stringify(students));
    cargarEstudiantes();
};
};

function crearCarrera(){
	var html = "<form><label>C&oacute;digo:  </label> <input type=text id=codigo name=codigo maxlength=10 size=20 ></input><br/>"
	+"<br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 ></input><br/>"
	+"<br><center><input type=button value=Guardar onclick=guardarCarreraCreada() /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarCarreras() />";
	$('#carreras').html(html);
};

function guardarCarreraCreada(){
	var codigo = $('#codigo').val(),
	nombre = $('#nombre').val();
	if (codigo == "" || nombre=="") {
		crearCarrera();
	}
	else{
	// Crear la Carrera
	var career = { "codigo": codigo, "nombre": nombre };

    // Leer las Carreras de Local_Storage
    var careers = JSON.parse(localStorage.getItem('careers'));
    if (careers === null) {
    	careers = [];
    }

    // Agregar la Carrera
    careers.push(career);

    // Volver Salvar en Local_Storage
    localStorage.setItem('careers',JSON.stringify(careers));
    cargarCarreras();
};
};

function crearUsuario(){
	var users = JSON.parse(localStorage.getItem('users'));
    if (users === null) {
    	users = [];
    }
    
	var html = "<form><br/><label>C&eacute;dula:  </label> <input type=text id=cedula name=cedula maxlength=100 size=15 ></input><br/>"
	+"<br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 ></input><br/>"
	+"<br><label for=role>Rol:  </label> <select id=role name=role><option value=Admin>Administrador</option><option value=Dc>Director de Carrera</option></select><br/>"
	+"<br><label>Usuario:  </label> <input type=text id=username name=username maxlength=100 size=50 ></input><br/>"
	+"<br><label>Contrase&#241;a:  </label> <input type=text id=password name=password maxlength=100 size=50 ></input><br/>"
	+"<br><center><input type=button value=Guardar onclick=guardarUsuarioCreado() /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarUsuarios() />";
	$('#usuarios').html(html);
};

function guardarUsuarioCreado(){
	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	role = $('#role').val(),
	username = $('#username').val(),
	password = $('#password').val();

	if (cedula == "" || nombre == "" || username == "" || password == "") {
		crearUsuario();
	}
	else{
	// Crear Usuarios
	var user = { "cedula": cedula, "nombre": nombre, "role": role, "username": username, "password": password};

    // Leer los Usuarios de Local_Storage
    var users = JSON.parse(localStorage.getItem('users'));
    if (users === null) {
    	users = [];
    }

    // Agregar el Usuario
    users.push(user);

    // Volver a Salvar en Local_Storage
    localStorage.setItem('users',JSON.stringify(users));
    cargarUsuarios();
};
};

function editarEstudiantes(index){

	var students = JSON.parse(localStorage.getItem('students'));
	var careers = JSON.parse(localStorage.getItem('careers'));
	var combo = "<select id=carrera name=carrera>";
    for (var i = 0; i < careers.length; i++) {
    	combo += "<option value="+careers[i].codigo+">"+careers[i].nombre+"</option>";
    };
    combo += "</select>";
	var html = "<form><br/><label>C&eacute;dula:  </label> <input type=text id=cedula name=cedula maxlength=100 size=15 value="+students[index].cedula+" ></input><br/>"
	+"<br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 value="+students[index].nombre+" ></input><br/>"
	+"<br><label for=carrera>Carrera:  </label> " + combo + "<br/><br><label>Nivel de Ingl&eacute;s </label> <br/>"
	+"<input type=radio id=ingles name=ingles value=Bajo> Bajo </input> <input type=radio id=ingles name=ingles value=Intermedio > Intermedio </input>"
    +"<input type=radio id=ingles name=ingles value=Alto > Alto </input><br/>"
	+"<br><center><input type=button value=Guardar onclick=guardarUsuarioEditado("+index+") /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarEstudiantes() />";
	$('#estudiantes').html(html);
};

function guardarUsuarioEditado(index){

	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	carrera = $('#carrera').val(),
	ingles = $("input[name='ingles']:checked").val(),
	imagen = $('input[type=file]').val().split('\\').pop();

	if (cedula == "" || nombre == "") {

	}
	else{
	// leer los estudiantes de localstorage
    var students = JSON.parse(localStorage.getItem('students'));

	students[index].cedula = cedula;
	students[index].nombre = nombre;
	students[index].carrera = carrera;
	students[index].ingles = ingles;
	students[index].imagen = imagen;

    // volver guardar en localstoraage
    localStorage.setItem('students',JSON.stringify(students));
    cargarEstudiantes();
};
};

function editarCarreras(index){

	var careers = JSON.parse(localStorage.getItem('careers'));
	var html = "<form><label>C&oacute;digo:  </label> <input type=text id=codigo name=codigo maxlength=10 size=10 value="+careers[index].codigo
	+" ></input><br/><br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 value=\""+careers[index].nombre+"\" ></input><br/><br><center><input type=button value=Guardar onclick=guardarCarreraEditada("+index+") /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarCarreras() />";
	$('#carreras').html(html);
};

function guardarCarreraEditada(index){
	var codigo = $('#codigo').val(),
	nombre = $('#nombre').val();
	if(codigo==""||nombre==""){

	}
	else{
    // Leer las Carreras de Local_Storage
    var careers = JSON.parse(localStorage.getItem('careers'));
    careers[index].codigo = codigo;
    careers[index].nombre = nombre;
    localStorage.setItem('careers',JSON.stringify(careers));
    cargarCarreras();
};
};

function editarUsuario(index){

	var users = JSON.parse(localStorage.getItem('users'));

	var html = "<form><br/><label>C&eacute;dula:  </label> <input type=text id=cedula name=cedula maxlength=10 size=10 value="+users[index].cedula+" ></input><br/>"
	+"<br><label>Nombre:  </label> <input type=text id=nombre name=nombre maxlength=100 size=50 value="+users[index].nombre+" ></input><br/>"
	+"<br><label for=role>Rol:  </label> <select id=role name=role><option value=Admin>Administrador</option><option value=Dc>Director de Carrera</option></select><br/>"
	+"<br><label>Usuario:  </label> <input type=text id=username name=username maxlength=100 size=50 value="+users[index].username+" ></input><br/>"
	+"<br><label>Contrase&#241;a:  </label> <input type=text id=password name=password maxlength=100 size=50 value="+users[index].password+" ></input><br/>"
	+"<br><center><input type=button value=Guardar onclick=guardarUsuarioEditado("+index+") /></form><br>"
	+"<br><center><input type=button value=Cancelar onclick=cargarUsuarios() />";
	$('#usuarios').html(html);
};

function guardarUsuarioEditado(index){

	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	role = $('#role').val(),
	username = $('#username').val(),
	password = $('#password').val();

	if (cedula == "" || nombre == "" || username == "" || password == "") {
		
	}
	else{
	// Leer los Usuarios de Local_Storage
    var users = JSON.parse(localStorage.getItem('users'));

	users[index].cedula = cedula;
	users[index].nombre = nombre;
	users[index].role = role;
	users[index].username = username;
	users[index].password = password;

    // Volver a Salvar en Local_Storage
    localStorage.setItem('users',JSON.stringify(users));
    cargarUsuarios();
};
};

function comprobarUsuario(){
	var correctUser = false;
	var username = $('#username').val(),
	password = $('#password').val();
	if (username == "admin" && password == "admin") {
		correctUser = true;
	}
	else{
		var users = JSON.parse(localStorage.getItem('users'));
		if (users === null) {
			users = [];
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i].username == username && users[i].password == password) {
				correctUser = true;
			};

		};

	};
	if (correctUser) {
		usuarioActual = username;
		localStorage.setItem('usuarioActual',JSON.stringify(usuarioActual));
		document.location.href="index.html";
	}
	else{
		document.location.href="Login.html";
	};
};


