	var currentUser = "";

function prepareBinding(){
	$( "#btnLogin" ).click(function() { 
		comprobarUsuario();
	});

$( "a" ).click(function() { 
		loadCareers();
		loadStudents();
		loadUsers();
	});

	loadCareers();
	loadStudents();
	loadUsers();
	currentUser = JSON.parse(localStorage.getItem('currentUser'));
$(".msj").html("<p>¡Hola! "+currentUser+" <a href=login.html>Salir</a> </p>");

};

function loadStudents(){
	var students = JSON.parse(localStorage.getItem('students'));
	if (students === null) {
		students = [];
	};
	var table = "<table> <tr><th>C&eacute;dula</th><th>Nombre</th><th>Carrera</th><th>Eliminar</th><th>Editar</th><th><img class=createStudent src=Create.png /></th></tr>";
	for (var i = 0; i < students.length; i++) {
		table += "<tr><td>"+students[i].cedula +"</td><td>"+students[i].nombre+"</td><td>"+students[i].carrera+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteStudent /></td><td><img class=editStudent src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#estudiantes').html(table);
	$(".editStudent").click(function(){
		var index = $(this).data('index');
		editStudents(index);
	});

	$(".deleteStudent").click(function(){
		var index = $(this).data('index');
		deleteStudents(index);
	});

	$(".createStudent").click(function(){
		createStudents();
	});
};

function loadCareers(){
	var careers = JSON.parse(localStorage.getItem('careers'));
	if (careers === null) {
		careers = [];
	};
	var table = "<table> <tr><th>C&oacute;digo</th><th>Nombre</th><th>Eliminar</th><th>Editar</th><th><img class=createCareer src=Create.png /></th></tr>";
	for (var i = 0; i < careers.length; i++) {
		table += "<tr><td>"+careers[i].codigo +"</td><td>"+careers[i].nombre+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteCareer /></td><td><img class=editCareer src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#carreras').html(table);

	$(".editCareer").click(function(){
		var index = $(this).data('index');
		editCareers(index);
	});

	$(".deleteCareer").click(function(){
		var index = $(this).data('index');
		deleteCareers(index);
	});

	$(".createCareer").click(function(){
		createCareers();
	});
};

function loadUsers(){
	var users = JSON.parse(localStorage.getItem('users'));
	if (users === null) {
		users = [];
	};
	var table = "<table> <tr><th>C&eacute;dula</th><th>Nombre</th><th>Usuario</th><th>Role</th><th>Eliminar</th><th>Editar</th><th><img class=createUser src=Create.png /></th></tr>";
	for (var i = 0; i < users.length; i++) {
		table += "<tr><td>"+users[i].cedula +"</td><td>"+users[i].nombre+"</td><td>"+users[i].username+"</td><td>"+users[i].role+"</td><td><img  src=delete.png data-index="+i
		+" class=deleteUser /></td><td><img class=editUser src=edit.png data-index="+i+" /></td></tr>";
	};
	table+= "</table>";
	$('#usuarios').html(table);

	$(".editUser").click(function(){
		var index = $(this).data('index');
		editUsers(index);
	});

	$(".deleteUser").click(function(){
		var index = $(this).data('index');
		deleteUsers(index);
	});

	$(".createUser").click(function(){
		createUsers();
	});
};

function deleteCareers(index){
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
    // volver guardar en localstoraage
    localStorage.setItem('careers',JSON.stringify(arreglo));
    loadCareers();
};

function deleteStudents(index){
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
    // volver guardar en localstoraage
    localStorage.setItem('students',JSON.stringify(arreglo));
    loadStudents();
};

function deleteUsers(index){
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
    // volver guardar en localstoraage
    localStorage.setItem('users',JSON.stringify(arreglo));
    loadUsers();
};

function createStudents(){
	var careers = JSON.parse(localStorage.getItem('careers'));
    if (careers === null) {
    	careers = [];
    }
    var combo = "<select id=carrera name=carrera>";
    for (var i = 0; i < careers.length; i++) {
    	combo += "<option value="+careers[i].codigo+">"+careers[i].nombre+"</option>";
    };
    combo += "</select>";
	var create = "<form><br/><label>C&eacute;dula</label><input type=text id=cedula name=cedula maxlength=9 size=9 ></input><br/>"
	+"<label>Nombre</label><input type=text id=nombre name=nombre maxlength=30 size=30 ></input><br/>"
	+"<label for=carrera>Carrera</label>"+combo+"<br/><label>Nivel de Ingl&eacute;s</label> <br/>"
	+"<input type=radio id=ingles name=ingles value=Bajo> Bajo</input> <input type=radio id=ingles name=ingles value=Intermedio > Intermedio</input>"
    +" <input type=radio id=ingles name=ingles value=Alto > Alto</input><br/>"
	+"<input type=submit value=Guardar onclick=saveCreatedStudent() /></form>"
	+"<input type=submit value=Cancelar onclick=loadStudents() />";
	$('#estudiantes').html(create);
};

function saveCreatedStudent(){
	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	carrera = $('#carrera').val(),
	ingles = $('#ingles').val(),
	foto = $('#datafile').val();

	if (cedula == "" || nombre == "") {
		createStudents();
	}
	else{
	// crear objeto estudiante
	var student = { "cedula": cedula, "nombre": nombre, "carrera": carrera, "ingles": ingles, "foto": foto};

    // leer los estudiantes de localstorage
    var students = JSON.parse(localStorage.getItem('students'));
    if (students === null) {
    	students = [];
    }

    // agregar el estudiante
    students.push(student);

    // volver guardar en localstoraage
    localStorage.setItem('students',JSON.stringify(students));
    loadStudents();
};
};

function createCareers(){
	var create = "<form><label>C&oacute;digo </label><input type=text id=codigo name=codigo maxlength=10 size=10 ></input><br/>"
	+"<label>Nombre </label><input type=text id=nombre name=nombre maxlength=30 size=30 ></input><br/>"
	+"<input type=submit value=Guardar onclick=saveCreatedCareer() /></form>"
	+"<input type=submit value=Cancelar onclick=loadCareers() />";
	$('#carreras').html(create);
};

function saveCreatedCareer(){
	var codigo = $('#codigo').val(),
	nombre = $('#nombre').val();
	if (codigo == "" || nombre=="") {
		createCareers();
	}
	else{
	// crear objeto carrera
	var career = { "codigo": codigo, "nombre": nombre };

    // leer las carreras de localstorage
    var careers = JSON.parse(localStorage.getItem('careers'));
    if (careers === null) {
    	careers = [];
    }

    // agregar la carrera
    careers.push(career);

    // volver guardar en localstoraage
    localStorage.setItem('careers',JSON.stringify(careers));
    loadCareers();
};
};

function createUsers(){
	var users = JSON.parse(localStorage.getItem('users'));
    if (users === null) {
    	users = [];
    }
    
	var create = "<form><br/><label>C&eacute;dula</label><input type=text id=cedula name=cedula maxlength=9 size=9 ></input><br/>"
	+"<label>Nombre</label><input type=text id=nombre name=nombre maxlength=30 size=30 ></input><br/>"
	+"<label for=role>Role</label><select id=role name=role><option value=Admin>Administrador</option><option value=Dc>Director de Carrera</option></select><br/>"
	+"<label>Username</label><input type=text id=username name=username maxlength=30 size=30 ></input><br/>"
	+"<label>Password</label><input type=text id=password name=password maxlength=30 size=30 ></input><br/>"
	+"<input type=submit value=Guardar onclick=saveCreatedUser() /></form>"
	+"<input type=submit value=Cancelar onclick=loadUsers() />";
	$('#usuarios').html(create);
};

function saveCreatedUser(){
	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	role = $('#role').val(),
	username = $('#username').val(),
	password = $('#password').val();

	if (cedula == "" || nombre == "" || username == "" || password == "") {
		createUsers();
	}
	else{
	// crear objeto usuario
	var user = { "cedula": cedula, "nombre": nombre, "role": role, "Usuario": username, "contraseña": password};

    // leer los usuarios de localstorage
    var users = JSON.parse(localStorage.getItem('users'));
    if (users === null) {
    	users = [];
    }

    // agregar el usuario
    users.push(user);

    // volver guardar en localstoraage
    localStorage.setItem('users',JSON.stringify(users));
    loadUsers();
};
};

function editStudents(index){

	var students = JSON.parse(localStorage.getItem('students'));
	var careers = JSON.parse(localStorage.getItem('careers'));
	var combo = "<select id=carrera name=carrera>";
    for (var i = 0; i < careers.length; i++) {
    	combo += "<option value="+careers[i].codigo+">"+careers[i].nombre+"</option>";
    };
    combo += "</select>";
	var edit = "<form><br/><label>C&eacute;dula</label><input type=text id=cedula name=cedula maxlength=9 size=9 value="+students[index].cedula+"></input><br/>"
	+"<label>Nombre</label><input type=text id=nombre name=nombre maxlength=30 size=30 value="+students[index].nombre+" ></input><br/>"
	+"<label for=carrera>Carrera</label>"+combo+"<br/><label>Nivel de Ingl&eacute;s</label> <br/>"
	+"<input type=radio id=ingles name=ingles value=Bajo> Bajo</input> <input type=radio id=ingles name=ingles value=Intermedio > Intermedio</input>"
    +" <input type=radio id=ingles name=ingles value=Alto > Alto</input><br/>"
	+"<input type=submit value=Guardar onclick=saveEditedStudent("+index+") /></form>"
	+"<input type=submit value=Cancelar onclick=loadStudents() />";
	$('#estudiantes').html(edit);
};

function saveEditedStudent(index){

	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	carrera = $('#carrera').val(),
	ingles = $('#ingles').val();

	if (cedula == "" || nombre == "") {

	}
	else{
	// leer los estudiantes de localstorage
    var students = JSON.parse(localStorage.getItem('students'));

	students[index].cedula = cedula;
	students[index].nombre = nombre;
	students[index].carrera = carrera;
	students[index].ingles = ingles;

    // volver guardar en localstoraage
    localStorage.setItem('students',JSON.stringify(students));
    loadStudents();
};
};

function editCareers(index){

	var careers = JSON.parse(localStorage.getItem('careers'));
	var edit = "<form><label>C&oacute;digo</label><input type=text id=codigo name=codigo maxlength=10 size=10 value="+careers[index].codigo
	+" ></input><br/><label>Nombre</label><input type=text id=nombre name=nombre maxlength=30 size=30 value="+careers[index].nombre+" ></input><br/><input type=submit value=Guardar onclick=saveEditedCareer("+index+") /></form>"
	+"<input type=submit value=Cancelar onclick=loadCareers() />";
	$('#carreras').html(edit);
};

function saveEditedCareer(index){
	var codigo = $('#codigo').val(),
	nombre = $('#nombre').val();
	if(codigo==""||nombre==""){

	}
	else{
    // leer las carreras de localstorage
    var careers = JSON.parse(localStorage.getItem('careers'));
    careers[index].codigo = codigo;
    careers[index].nombre = nombre;
    localStorage.setItem('careers',JSON.stringify(careers));
    loadCareers();
};
};

function editUsers(index){

	var users = JSON.parse(localStorage.getItem('users'));

	var edit = "<form><br/><label>C&eacute;dula</label><input type=text id=cedula name=cedula maxlength=9 size=9 value="+users[index].cedula+"></input><br/>"
	+"<label>Nombre</label><input type=text id=nombre name=nombre maxlength=30 size=30 value="+users[index].nombre+" ></input><br/>"
	+"<label for=role>Role</label><select id=role name=role><option value=Admin>Administrador</option><option value=Dc>Director de Carrera</option></select><br/>"
	+"<label>Username</label><input type=text id=username name=username maxlength=30 size=30 value="+users[index].username+" ></input><br/>"
	+"<label>Password</label><input type=text id=password name=password maxlength=30 size=30 value="+users[index].password+" ></input><br/>"
	+"<input type=submit value=Guardar onclick=saveEditedUser("+index+") /></form>"
	+"<input type=submit value=Cancelar onclick=loadUsers() />";
	$('#usuarios').html(edit);
};

function saveEditedUser(index){

	var cedula = $('#cedula').val(),
	nombre = $('#nombre').val(),
	role = $('#role').val(),
	username = $('#username').val(),
	password = $('#password').val();

	if (cedula == "" || nombre == "" || username == "" || password == "") {
		
	}
	else{
	// leer los usuarios de localstorage
    var users = JSON.parse(localStorage.getItem('users'));

	users[index].cedula = cedula;
	users[index].nombre = nombre;
	users[index].role = role;
	users[index].username = username;
	users[index].password = password;

    // volver guardar en localstoraage
    localStorage.setItem('users',JSON.stringify(users));
    loadUsers();
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
		currentUser = username;
		localStorage.setItem('currentUser',JSON.stringify(currentUser));
		document.location.href="index.html";
	}
	else{
		document.location.href="Login.html";
	};
};

