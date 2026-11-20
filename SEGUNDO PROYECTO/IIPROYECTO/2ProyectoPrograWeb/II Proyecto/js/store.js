(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.IntroUTNStore = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var KEYS = {
    careers: 'careers',
    students: 'students',
    users: 'users',
    currentUser: 'currentUser'
  };

  function createMemoryStorage() {
    var map = Object.create(null);
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : null; },
      setItem: function (k, v) { map[k] = String(v); },
      removeItem: function (k) { delete map[k]; }
    };
  }

  function safeArray(raw) {
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (x) { return x && typeof x === 'object'; }) : [];
    } catch (_) {
      return [];
    }
  }

  function clean(v, max) {
    var s = String(v == null ? '' : v).trim();
    return max && s.length > max ? s.slice(0, max) : s;
  }

  function safeImage(v) {
    var s = clean(v, 2_000_000);
    if (!s) return '';
    if (/^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-zA-Z0-9+/=]+$/.test(s)) return s;
    if (/^[a-zA-Z0-9._-]+\.(png|jpg|jpeg|gif|webp)$/i.test(s)) return s;
    return '';
  }

  function createStore(storage) {
    var store = storage || (typeof localStorage !== 'undefined' ? localStorage : createMemoryStorage());

    function read(key) { return safeArray(store.getItem(key)); }
    function write(key, items) { store.setItem(key, JSON.stringify(items)); return items; }

    function login(username, password) {
      var u = clean(username, 80);
      var p = String(password == null ? '' : password);
      if (!u || !p) return { ok: false, error: 'Ingresa tu usuario y contraseña.' };
      if (u === 'admin' && p === 'admin') {
        store.setItem(KEYS.currentUser, JSON.stringify(u));
        return { ok: true, user: u };
      }
      var users = read(KEYS.users);
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === u && users[i].password === p) {
          store.setItem(KEYS.currentUser, JSON.stringify(u));
          return { ok: true, user: u };
        }
      }
      return { ok: false, error: 'Credenciales inválidas. Usa admin / admin o un usuario registrado.' };
    }

    function getCurrentUser() {
      var raw = store.getItem(KEYS.currentUser);
      if (!raw) return 'Invitado';
      try { return JSON.parse(raw) || 'Invitado'; } catch (_) { return String(raw); }
    }

    function logout() { store.removeItem(KEYS.currentUser); }

    function listCareers() { return read(KEYS.careers); }
    function saveCareer(data, index) {
      var codigo = clean(data.codigo, 20);
      var nombre = clean(data.nombre, 100);
      if (!codigo || !nombre) return { ok: false, error: 'Código y nombre son obligatorios.' };
      var list = listCareers();
      for (var i = 0; i < list.length; i++) {
        if (i !== index && clean(list[i].codigo).toLowerCase() === codigo.toLowerCase()) {
          return { ok: false, error: 'Ya existe una carrera con ese código.' };
        }
      }
      var item = { codigo: codigo, nombre: nombre };
      if (typeof index === 'number' && index >= 0 && index < list.length) list[index] = item;
      else list.push(item);
      write(KEYS.careers, list);
      return { ok: true, item: item, list: list };
    }
    function deleteCareer(index) {
      var list = listCareers();
      if (index < 0 || index >= list.length) return { ok: false, error: 'Carrera no encontrada.' };
      list.splice(index, 1);
      write(KEYS.careers, list);
      return { ok: true, list: list };
    }

    function listStudents() { return read(KEYS.students); }
    function saveStudent(data, index) {
      var cedula = clean(data.cedula, 30);
      var nombre = clean(data.nombre, 100);
      var carrera = clean(data.carrera, 80) || 'Sin asignar';
      var ingles = clean(data.ingles, 20) || 'Alto';
      var list = listStudents();
      var isEdit = typeof index === 'number' && index >= 0 && index < list.length;
      var imagen = safeImage(data.imagen);
      if (!imagen && isEdit) imagen = safeImage(list[index].imagen);
      if (!cedula || !nombre) return { ok: false, error: 'Cédula y nombre son obligatorios.' };
      for (var i = 0; i < list.length; i++) {
        if (i !== index && clean(list[i].cedula).toLowerCase() === cedula.toLowerCase()) {
          return { ok: false, error: 'Ya existe un estudiante con esa cédula.' };
        }
      }
      var item = { cedula: cedula, nombre: nombre, carrera: carrera, ingles: ingles, imagen: imagen };
      if (isEdit) list[index] = item;
      else list.push(item);
      write(KEYS.students, list);
      return { ok: true, item: item, list: list };
    }
    function deleteStudent(index) {
      var list = listStudents();
      if (index < 0 || index >= list.length) return { ok: false, error: 'Estudiante no encontrado.' };
      list.splice(index, 1);
      write(KEYS.students, list);
      return { ok: true, list: list };
    }

    function listUsers() { return read(KEYS.users); }
    function saveUser(data, index) {
      var cedula = clean(data.cedula, 30);
      var nombre = clean(data.nombre, 100);
      var role = clean(data.role, 40) || 'Admin';
      var username = clean(data.username, 60);
      var password = String(data.password == null ? '' : data.password).trim();
      var list = listUsers();
      var isEdit = typeof index === 'number' && index >= 0 && index < list.length;
      if (!password && isEdit) password = list[index].password || '';
      if (!cedula || !nombre || !username || !password) {
        return { ok: false, error: 'Todos los campos del usuario son obligatorios.' };
      }
      for (var i = 0; i < list.length; i++) {
        if (i !== index && clean(list[i].username).toLowerCase() === username.toLowerCase()) {
          return { ok: false, error: 'Ese nombre de usuario ya existe.' };
        }
      }
      var item = { cedula: cedula, nombre: nombre, role: role, username: username, password: password };
      if (isEdit) list[index] = item;
      else list.push(item);
      write(KEYS.users, list);
      return { ok: true, item: item, list: list };
    }
    function deleteUser(index) {
      var list = listUsers();
      if (index < 0 || index >= list.length) return { ok: false, error: 'Usuario no encontrado.' };
      list.splice(index, 1);
      write(KEYS.users, list);
      return { ok: true, list: list };
    }

    function search(query) {
      var q = clean(query, 80).toLowerCase();
      if (!q) return { careers: listCareers(), students: listStudents(), users: listUsers() };
      return {
        careers: listCareers().filter(function (c) { return (c.codigo + ' ' + c.nombre).toLowerCase().includes(q); }),
        students: listStudents().filter(function (s) { return (s.cedula + ' ' + s.nombre + ' ' + s.carrera + ' ' + s.ingles).toLowerCase().includes(q); }),
        users: listUsers().filter(function (u) { return (u.cedula + ' ' + u.nombre + ' ' + u.username + ' ' + u.role).toLowerCase().includes(q); })
      };
    }

    return {
      login: login,
      getCurrentUser: getCurrentUser,
      logout: logout,
      listCareers: listCareers,
      saveCareer: saveCareer,
      deleteCareer: deleteCareer,
      listStudents: listStudents,
      saveStudent: saveStudent,
      deleteStudent: deleteStudent,
      listUsers: listUsers,
      saveUser: saveUser,
      deleteUser: deleteUser,
      search: search
    };
  }

  return { createStore: createStore, createMemoryStorage: createMemoryStorage };
});
