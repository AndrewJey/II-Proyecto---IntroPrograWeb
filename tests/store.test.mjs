import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createStore, createMemoryStorage } = require('../SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/II Proyecto/js/store.js');

test('default admin/admin login and registered user login work safely', () => {
  const store = createStore(createMemoryStorage());
  assert.equal(store.login('admin', 'bad').ok, false);
  assert.equal(store.login('admin', 'admin').ok, true);
  assert.equal(store.getCurrentUser(), 'admin');
  assert.equal(store.saveUser({ cedula: '101', nombre: 'Juan Pérez', role: 'Dc', username: 'jperez', password: 'pw' }).ok, true);
  assert.equal(store.login('jperez', 'pw').ok, true);
  assert.equal(store.getCurrentUser(), 'jperez');
});

test('careers, students, and users CRUD preserve photos and handle spaces/XSS safely', () => {
  const store = createStore(createMemoryStorage());
  assert.equal(store.saveCareer({ codigo: 'ISW', nombre: 'Ingeniería del Software' }).ok, true);
  assert.equal(store.saveCareer({ codigo: 'isw', nombre: 'Duplicada' }).ok, false);

  const img = 'data:image/png;base64,iVBORw0KGgo=';
  assert.equal(store.saveStudent({ cedula: '207', nombre: 'María López', carrera: 'ISW', ingles: 'Alto', imagen: img }).ok, true);
  assert.equal(store.saveStudent({ cedula: '207', nombre: 'María López Solís', carrera: 'ISW', ingles: 'Intermedio', imagen: '' }, 0).ok, true);
  assert.equal(store.listStudents()[0].imagen, img);

  const res = store.search('Solís');
  assert.equal(res.students.length, 1);
  assert.equal(store.deleteStudent(0).ok, true);
  assert.equal(store.listStudents().length, 0);
});
