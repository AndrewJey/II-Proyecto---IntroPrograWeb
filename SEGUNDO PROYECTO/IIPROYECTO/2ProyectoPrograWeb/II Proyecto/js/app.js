(function () {
  'use strict';

  var store = window.IntroUTNStore.createStore();
  var pendingPhoto = '';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, String(attrs[k]));
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function toast(msg) {
    var box = document.getElementById('toast-box');
    if (!box) return;
    var t = el('div', { className: 'toast toast-ok', text: msg });
    box.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }

  function openModal(title, node) {
    document.getElementById('modal-title').textContent = title;
    var body = document.getElementById('modal-body');
    body.innerHTML = '';
    body.appendChild(node);
    document.getElementById('modal-backdrop').hidden = false;
    var first = body.querySelector('input, select, button');
    if (first) first.focus();
  }

  function closeModal() {
    document.getElementById('modal-backdrop').hidden = true;
    document.getElementById('modal-body').innerHTML = '';
    pendingPhoto = '';
  }

  function switchTab(id) {
    for (var i = 1; i <= 4; i++) {
      var btn = document.getElementById('tab-btn-' + i);
      var panel = document.getElementById('tab-' + i);
      var active = i === id;
      if (btn) btn.setAttribute('aria-selected', String(active));
      if (panel) panel.hidden = !active;
    }
  }

  function refreshCounts() {
    var c = store.listCareers().length;
    var s = store.listStudents().length;
    var u = store.listUsers().length;
    document.getElementById('pill-careers').textContent = c;
    document.getElementById('pill-students').textContent = s;
    document.getElementById('pill-users').textContent = u;
    document.getElementById('kpi-careers').textContent = c;
    document.getElementById('kpi-students').textContent = s;
    document.getElementById('kpi-users').textContent = u;
  }

  function loadCareers() {
    var wrap = document.getElementById('carreras');
    if (!wrap) return;
    wrap.innerHTML = '';
    var list = store.listCareers();
    if (!list.length) {
      wrap.appendChild(el('div', { className: 'empty', text: 'Sin carreras registradas. Haz clic en "+ Nueva carrera".' }));
      return;
    }
    var tbody = el('tbody');
    list.forEach(function (c, idx) {
      tbody.appendChild(el('tr', null, [
        el('td', { text: c.codigo }),
        el('td', { text: c.nombre }),
        el('td', { className: 'actions-cell' }, [
          el('button', { type: 'button', className: 'btn btn-secondary btn-sm', text: 'Editar', onClick: function () { openCareerModal(idx); } }),
          el('button', { type: 'button', className: 'btn btn-danger btn-sm', text: 'Eliminar', onClick: function () { confirmDelete('carrera', function () { store.deleteCareer(idx); renderAll(); toast('Carrera eliminada.'); }); } })
        ])
      ]));
    });
    wrap.appendChild(el('table', { className: 'data-table' }, [
      el('thead', null, [el('tr', null, [el('th', { text: 'Código' }), el('th', { text: 'Nombre' }), el('th', { text: 'Acciones' })])]),
      tbody
    ]));
  }

  function loadStudents() {
    var wrap = document.getElementById('estudiantes');
    if (!wrap) return;
    wrap.innerHTML = '';
    var list = store.listStudents();
    if (!list.length) {
      wrap.appendChild(el('div', { className: 'empty', text: 'Sin estudiantes registrados. Haz clic en "+ Nuevo estudiante".' }));
      return;
    }
    var tbody = el('tbody');
    list.forEach(function (s, idx) {
      var photoCell = el('td');
      if (s.imagen && s.imagen.indexOf('data:image/') === 0) {
        photoCell.appendChild(el('img', { className: 'thumb', src: s.imagen, alt: 'Foto de ' + s.nombre }));
      } else {
        photoCell.textContent = s.imagen || '—';
      }
      tbody.appendChild(el('tr', null, [
        el('td', { text: s.cedula }),
        el('td', { text: s.nombre }),
        el('td', { text: s.carrera }),
        el('td', { text: s.ingles }),
        photoCell,
        el('td', { className: 'actions-cell' }, [
          el('button', { type: 'button', className: 'btn btn-secondary btn-sm', text: 'Editar', onClick: function () { openStudentModal(idx); } }),
          el('button', { type: 'button', className: 'btn btn-danger btn-sm', text: 'Eliminar', onClick: function () { confirmDelete('estudiante', function () { store.deleteStudent(idx); renderAll(); toast('Estudiante eliminado.'); }); } })
        ])
      ]));
    });
    wrap.appendChild(el('table', { className: 'data-table' }, [
      el('thead', null, [el('tr', null, ['Cédula', 'Nombre', 'Carrera', 'Inglés', 'Imagen', 'Acciones'].map(function (h) { return el('th', { text: h }); }))]),
      tbody
    ]));
  }

  function loadUsers() {
    var wrap = document.getElementById('usuarios');
    if (!wrap) return;
    wrap.innerHTML = '';
    var list = store.listUsers();
    if (!list.length) {
      wrap.appendChild(el('div', { className: 'empty', text: 'Sin usuarios registrados. Haz clic en "+ Nuevo usuario".' }));
      return;
    }
    var tbody = el('tbody');
    list.forEach(function (u, idx) {
      var roleLabel = u.role === 'Dc' ? 'Director de Carrera' : u.role === 'Admin' ? 'Administrador' : u.role;
      tbody.appendChild(el('tr', null, [
        el('td', { text: u.cedula }),
        el('td', { text: u.nombre }),
        el('td', { text: u.username }),
        el('td', { text: roleLabel }),
        el('td', { className: 'actions-cell' }, [
          el('button', { type: 'button', className: 'btn btn-secondary btn-sm', text: 'Editar', onClick: function () { openUserModal(idx); } }),
          el('button', { type: 'button', className: 'btn btn-danger btn-sm', text: 'Eliminar', onClick: function () { confirmDelete('usuario', function () { store.deleteUser(idx); renderAll(); toast('Usuario eliminado.'); }); } })
        ])
      ]));
    });
    wrap.appendChild(el('table', { className: 'data-table' }, [
      el('thead', null, [el('tr', null, ['Cédula', 'Nombre', 'Usuario', 'Rol', 'Acciones'].map(function (h) { return el('th', { text: h }); }))]),
      tbody
    ]));
  }

  function confirmDelete(label, onConfirm) {
    openModal('Confirmar eliminación', el('div', null, [
      el('p', { text: '¿Seguro que deseas eliminar este registro de ' + label + '?' }),
      el('div', { className: 'modal-foot' }, [
        el('button', { type: 'button', className: 'btn btn-secondary', text: 'Cancelar', onClick: closeModal }),
        el('button', { type: 'button', className: 'btn btn-danger', text: 'Eliminar', onClick: function () { closeModal(); onConfirm(); } })
      ])
    ]));
  }

  function openCareerModal(idx) {
    var isEdit = typeof idx === 'number';
    var cur = isEdit ? store.listCareers()[idx] : null;
    var err = el('div', { className: 'alert alert-error', role: 'alert', hidden: '' });
    var codIn = el('input', { id: 'm-cod', type: 'text', required: '', value: cur ? cur.codigo : '' });
    var nomIn = el('input', { id: 'm-nom', type: 'text', required: '', value: cur ? cur.nombre : '' });
    openModal(isEdit ? 'Editar carrera' : 'Nueva carrera', el('form', {
      onSubmit: function (e) {
        e.preventDefault();
        var res = store.saveCareer({ codigo: codIn.value, nombre: nomIn.value }, isEdit ? idx : undefined);
        if (!res.ok) { err.textContent = res.error; err.hidden = false; return; }
        closeModal(); renderAll(); toast(isEdit ? 'Carrera actualizada.' : 'Carrera creada.');
      }
    }, [
      err,
      el('div', { className: 'field' }, [el('label', { for: 'm-cod', text: 'Código' }), codIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-nom', text: 'Nombre' }), nomIn]),
      el('div', { className: 'modal-foot' }, [
        el('button', { type: 'button', className: 'btn btn-secondary', text: 'Cancelar', onClick: closeModal }),
        el('button', { type: 'submit', className: 'btn btn-primary', text: 'Guardar' })
      ])
    ]));
  }

  function openStudentModal(idx) {
    var isEdit = typeof idx === 'number';
    var cur = isEdit ? store.listStudents()[idx] : null;
    var careers = store.listCareers();
    var err = el('div', { className: 'alert alert-error', role: 'alert', hidden: '' });
    pendingPhoto = cur ? (cur.imagen || '') : '';

    var cedIn = el('input', { id: 'm-sced', type: 'text', required: '', value: cur ? cur.cedula : '' });
    var nomIn = el('input', { id: 'm-snom', type: 'text', required: '', value: cur ? cur.nombre : '' });
    var opts = careers.length ? careers.map(function (c) { return { v: c.codigo, l: c.nombre + ' (' + c.codigo + ')' }; }) : [{ v: 'Sin asignar', l: 'Sin asignar' }];
    var carSel = el('select', { id: 'm-scar' }, opts.map(function (o) {
      return el('option', { value: o.v, text: o.l, selected: cur && cur.carrera === o.v ? '' : null });
    }));
    var selectedEng = (cur && cur.ingles) || 'Alto';
    var engRadios = ['Bajo', 'Intermedio', 'Alto'].map(function (lvl) {
      var r = el('input', { type: 'radio', name: 'm-eng', value: lvl, checked: selectedEng === lvl ? '' : null });
      return { r: r, node: el('label', null, [r, lvl]) };
    });
    var fileIn = el('input', {
      id: 'm-simg',
      type: 'file',
      accept: 'image/png,image/jpeg,image/gif,image/webp',
      onChange: function (evt) {
        var f = evt.target.files && evt.target.files[0];
        if (!f) return;
        if (f.size > 1024 * 1024) { err.textContent = 'Imagen mayor a 1 MB.'; err.hidden = false; return; }
        var reader = new FileReader();
        reader.onload = function (e) { pendingPhoto = e.target.result; };
        reader.readAsDataURL(f);
      }
    });

    openModal(isEdit ? 'Editar estudiante' : 'Nuevo estudiante', el('form', {
      onSubmit: function (e) {
        e.preventDefault();
        var checked = engRadios.find(function (x) { return x.r.checked; });
        var res = store.saveStudent({
          cedula: cedIn.value,
          nombre: nomIn.value,
          carrera: carSel.value,
          ingles: checked ? checked.r.value : 'Alto',
          imagen: pendingPhoto
        }, isEdit ? idx : undefined);
        if (!res.ok) { err.textContent = res.error; err.hidden = false; return; }
        closeModal(); renderAll(); toast(isEdit ? 'Estudiante actualizado.' : 'Estudiante creado.');
      }
    }, [
      err,
      el('div', { className: 'field' }, [el('label', { for: 'm-sced', text: 'Cédula' }), cedIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-snom', text: 'Nombre' }), nomIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-scar', text: 'Carrera' }), carSel]),
      el('div', { className: 'field' }, [el('label', { text: 'Nivel de inglés' }), el('div', { className: 'radio-row' }, engRadios.map(function (x) { return x.node; }))]),
      el('div', { className: 'field' }, [el('label', { for: 'm-simg', text: 'Imagen (opcional, máx. 1 MB)' }), fileIn]),
      el('div', { className: 'modal-foot' }, [
        el('button', { type: 'button', className: 'btn btn-secondary', text: 'Cancelar', onClick: closeModal }),
        el('button', { type: 'submit', className: 'btn btn-primary', text: 'Guardar' })
      ])
    ]));
  }

  function openUserModal(idx) {
    var isEdit = typeof idx === 'number';
    var cur = isEdit ? store.listUsers()[idx] : null;
    var err = el('div', { className: 'alert alert-error', role: 'alert', hidden: '' });
    var cedIn = el('input', { id: 'm-uced', type: 'text', required: '', value: cur ? cur.cedula : '' });
    var nomIn = el('input', { id: 'm-unom', type: 'text', required: '', value: cur ? cur.nombre : '' });
    var rolSel = el('select', { id: 'm-urol' }, [
      el('option', { value: 'Admin', text: 'Administrador', selected: cur && cur.role === 'Admin' ? '' : null }),
      el('option', { value: 'Dc', text: 'Director de Carrera', selected: cur && cur.role === 'Dc' ? '' : null })
    ]);
    var usrIn = el('input', { id: 'm-uusr', type: 'text', required: '', value: cur ? cur.username : '' });
    var pwdIn = el('input', { id: 'm-upwd', type: 'password', placeholder: isEdit ? 'Vacío para conservar actual' : 'Contraseña', required: isEdit ? null : '' });

    openModal(isEdit ? 'Editar usuario' : 'Nuevo usuario', el('form', {
      onSubmit: function (e) {
        e.preventDefault();
        var res = store.saveUser({
          cedula: cedIn.value,
          nombre: nomIn.value,
          role: rolSel.value,
          username: usrIn.value,
          password: pwdIn.value
        }, isEdit ? idx : undefined);
        if (!res.ok) { err.textContent = res.error; err.hidden = false; return; }
        closeModal(); renderAll(); toast(isEdit ? 'Usuario actualizado.' : 'Usuario creado.');
      }
    }, [
      err,
      el('div', { className: 'field' }, [el('label', { for: 'm-uced', text: 'Cédula' }), cedIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-unom', text: 'Nombre' }), nomIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-urol', text: 'Rol' }), rolSel]),
      el('div', { className: 'field' }, [el('label', { for: 'm-uusr', text: 'Usuario' }), usrIn]),
      el('div', { className: 'field' }, [el('label', { for: 'm-upwd', text: 'Contraseña' }), pwdIn]),
      el('div', { className: 'modal-foot' }, [
        el('button', { type: 'button', className: 'btn btn-secondary', text: 'Cancelar', onClick: closeModal }),
        el('button', { type: 'submit', className: 'btn btn-primary', text: 'Guardar' })
      ])
    ]));
  }

  function renderAll() {
    loadCareers();
    loadStudents();
    loadUsers();
    refreshCounts();
  }

  function initLogin() {
    var form = document.getElementById('form-1');
    if (!form) return false;
    var err = document.getElementById('login-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var res = store.login(document.getElementById('username').value, document.getElementById('password').value);
      if (res.ok) window.location.href = 'index.html';
      else { err.textContent = res.error; err.hidden = false; }
    });
    return true;
  }

  function initDashboard() {
    if (!document.getElementById('carreras')) return;
    document.getElementById('welcome-user').textContent = '¡Hola! ' + store.getCurrentUser();
    document.getElementById('btn-logout').addEventListener('click', function () {
      store.logout();
      window.location.href = 'Login.html';
    });
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchTab(Number(btn.getAttribute('data-tab'))); });
    });
    document.getElementById('btn-add-career').addEventListener('click', function () { openCareerModal(); });
    document.getElementById('btn-add-student').addEventListener('click', function () { openStudentModal(); });
    document.getElementById('btn-add-user').addEventListener('click', function () { openUserModal(); });
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.getElementById('modal-backdrop').hidden) closeModal(); });

    document.getElementById('local-search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = document.getElementById('local-search-input').value.trim();
      var box = document.getElementById('local-search-results');
      box.innerHTML = '';
      if (!q) return;
      var r = store.search(q);
      var total = r.careers.length + r.students.length + r.users.length;
      box.appendChild(el('div', { className: 'alert alert-info', text: total + ' coincidencia(s): ' + r.careers.length + ' carreras, ' + r.students.length + ' estudiantes, ' + r.users.length + ' usuarios.' }));
    });
    document.getElementById('local-search-clear').addEventListener('click', function () {
      document.getElementById('local-search-input').value = '';
      document.getElementById('local-search-results').innerHTML = '';
    });

    renderAll();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!initLogin()) initDashboard();
  });
})();
