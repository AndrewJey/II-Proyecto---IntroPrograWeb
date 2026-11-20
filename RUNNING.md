

<!-- local-development:start -->
# Desarrollo local

Puedes abrir este repositorio en VS Code, Antigravity o Sublime Text. El compilador y los servicios necesarios dependen del componente indicado abajo.

## Python

Crea un entorno por aplicación desde PyCharm o la CLI. Python 3.12 es el punto inicial de compatibilidad; no se presume que todo el código o sus paquetes antiguos ya lo soporten.

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r 'SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/bootstrap-3.2.0/test-infra/requirements.txt'
```

## PHP

Usa un runtime PHP aislado compatible con la aplicación. Ejecuta Composer únicamente en la carpeta con `composer.json`; las aplicaciones Laravel antiguas requieren revisar también PHP y dependencias. Configura las credenciales de base de datos localmente.

## Componentes y validación

Inventario y compilaciones locales del 2026-11-15. Una compilación correcta no acredita todavía interacción, compatibilidad de base de datos, instalador ni despliegue.

| Componente | Tipo / destino | Validación |
| --- | --- | --- |
| [SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/bootstrap-3.2.0/package.json](<SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/bootstrap-3.2.0/package.json>) | node | Sin ejecutar |
| [SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/bootstrap-3.2.0/test-infra/requirements.txt](<SEGUNDO PROYECTO/IIPROYECTO/2ProyectoPrograWeb/bootstrap-3.2.0/test-infra/requirements.txt>) | python | Sin ejecutar |

## Archivos ignorados

`.gitignore` excluye credenciales locales, estado del editor y salidas de las herramientas detectadas. No deja de versionar archivos que ya estaban en Git. Los manifiestos, archivos de bloqueo, recursos fuente y scripts de esquema forman parte del código.
<!-- local-development:end -->

<!-- improvements-20261119:start -->
## Mejoras y verificación funcional (2026-11-19)

- **Mejoras aplicadas:** Modernización completa de `II Proyecto` (`Login.html`, `index.html`, `js/store.js`, `js/app.js`, `css/modern-app.css`) + página índice en raíz (`index.html`): corrección de fallos al editar estudiantes sin foto, eliminación off-by-one, atributos sin comillas, enlaces rotos (`Login.html`) y renderizado seguro sin XSS.
- **Pruebas ejecutadas:** `node --test tests/store.test.mjs` (2/2 pruebas aprobadas: login admin/usuarios y CRUD completo con preservación de imagen).
<!-- improvements-20261119:end -->
