# Filmate User Frontend

Aplicacion frontend de Filmate desarrollada con React y Vite. Este proyecto incluye el flujo principal de usuario para iniciar sesion, registrarse, ver la cartelera, revisar detalles de peliculas y navegar por las secciones de cines, dulceria y social.

## Descripcion

Filmate es una interfaz web pensada para una experiencia visual moderna y rapida. El frontend esta organizado por componentes reutilizables y utiliza:

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Lucide React para iconos

## Funcionalidades

- Pantalla de inicio de sesion con logo principal y modal de exito.
- Pantalla de registro de usuario.
- Menu principal con recomendaciones, cartelera y peliculas trending.
- Detalle de pelicula con informacion, horarios, trailer y reseñas.
- Seccion de cines con busqueda de funciones.
- Seccion de dulceria con carrito de compras.
- Seccion social completa: feed de actividad, perfiles, reseñas, peliculas seguidas.
- Notificaciones en tiempo real (campana).
- Instalacion como PWA (Progressive Web App).
- Proteccion de rutas para usuarios registrados.
- Lazy loading de componentes con React.lazy y Suspense.
- Manejo de errores global con AppErrorBoundary.
- Navegacion entre vistas con React Router.
- Header y Footer reutilizables.
- Diseno responsivo para escritorio y movil.

## Requisitos

- Node.js 20.19.x o 22.12 o superior
- npm 10 o superior

## Instalacion

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Copia `.env.example` a `.env.local` si necesitas cambiar la URL del backend.

## Variables de entorno

```env
VITE_API_URL=/api
VITE_WS_URL=
```

- `VITE_API_URL`: URL base de la API. En desarrollo, `/api` usa el proxy de Vite hacia `http://127.0.0.1:8000`.
- `VITE_WS_URL`: URL base opcional para WebSocket, sin `/ws/seats`. Si se omite, se deriva desde `VITE_API_URL`.

No coloques tokens, contraseñas ni secretos en variables `VITE_*`: Vite las incluye en el JavaScript público.

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia Vite en modo desarrollo.

### Compilacion

```bash
npm run build
```

Genera la version de produccion dentro de `dist/`.

### Vista previa

```bash
npm run preview
```

Sirve la build de produccion de forma local.

## Despliegue

La configuración recomendada es servir frontend y backend bajo el mismo dominio:

- `/` sirve el contenido de `dist/`.
- `/api/*` se reenvía al backend eliminando el prefijo `/api`.
- `/api/ws/*` se reenvía como WebSocket al backend eliminando el prefijo `/api`.
- Toda ruta que no sea un archivo ni API debe responder con `dist/index.html`, porque la aplicación usa `BrowserRouter`.

La build está preparada para publicarse en la raíz del dominio. Si se necesita una subruta como `/filmate/`, primero deben configurarse el `base` de Vite, el `basename` del router y las rutas de recursos estáticos.

El backend actual no configura CORS. Si frontend y backend se publican en dominios distintos, el backend deberá autorizar explícitamente el origen del frontend; definir solamente `VITE_API_URL` no evita esa restricción del navegador.

Antes de desplegar:

```bash
npm ci
npm run lint
npm run test
npm run build
```

### Contrato comercial actual

- El precio de entradas proviene de `precio_base` de cada función.
- Los precios y el stock de dulcería provienen de los endpoints públicos de snacks y se revalidan antes del pago.
- El frontend no consulta rutas administrativas ni aplica tasa, IVA, tipos de entrada o la matriz sala/formato, porque el backend todavía no publica ni cobra esas reglas.
- La compra exclusiva de dulcería permanece deshabilitada hasta que el backend acepte órdenes sin función ni asientos.

### Lint

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

### Pruebas

```bash
npm run test
npm run test:coverage
npm run test:e2e
npm run test:all
```

Las pruebas unitarias e integracion usan Vitest y Testing Library. Las E2E crean una build de producción y ejecutan Playwright contra `dist` con un backend mock local. La documentacion completa esta en `docs/testing/`.

Para generar el informe PDF de pruebas:

```bash
npm run report:testing
```

Para generar el informe PDF de problemas detectados:

```bash
npm run report:problems
```

### SonarQube

```bash
npm run test:coverage
npm run sonar -- --define sonar.host.url=http://127.0.0.1:9000 --define sonar.token=<TOKEN>
```

El analisis requiere un servidor SonarQube accesible y un token valido.

## Estructura del proyecto

```text
frontend-user/
├── docs/
│   ├── manual-usuario/
│   └── testing/
├── public/
│   ├── favicon.png
│   ├── logo.png
│   └── otros assets estaticos
├── src/
│   ├── assets/
│   ├── Component/
│   │   ├── AppErrorBoundary.jsx
│   │   ├── authSession.js
│   │   ├── Cines.jsx
│   │   ├── DetallePelicula.jsx
│   │   ├── Dulceria.jsx
│   │   ├── dulceriaFlowUtils.js
│   │   ├── filmateApi.js
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── IniciarSesion.jsx
│   │   ├── MenuPrincipal.jsx
│   │   ├── NotificacionesPage.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── peliculas.js
│   │   ├── ProtectedRoute.jsx
│   │   ├── purchaseHistory.js
│   │   ├── PwaInstallButton.jsx
│   │   ├── recommendationUtils.js
│   │   ├── Registro.jsx
│   │   ├── Social.jsx
│   │   ├── SocialEditarPerfil.jsx
│   │   ├── SocialFeed.jsx
│   │   ├── SocialPelicula.jsx
│   │   ├── SocialResena.jsx
│   │   ├── StarRatingDisplay.jsx
│   │   ├── SuggestedUsers.jsx
│   │   ├── Toast.jsx
│   │   └── TrendingMovies.jsx
│   ├── test/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── pwa.js
│   └── logo.svg
├── .env.example
├── .gitattributes
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── playwright.config.js
├── README.md
├── scripts/
├── sonar-project.properties
├── vite.config.js
└── dist/
```

## Rutas principales

| Ruta | Descripcion | Requiere autenticacion |
|---|---|---|
| `/` | Cartelera principal (Landing) | No |
| `/iniciar-sesion` | Inicio de sesion | No |
| `/registro` | Registro de usuario | No |
| `/menuPrincipal` | Cartelera principal | No |
| `/menuPrincipal/detallePelicula/:movieId?` | Detalle de pelicula | No |
| `/cines` | Seccion de cines | No |
| `/dulceria` | Seccion de dulceria | No |
| `/social` | Feed de actividad social | Si (usuario registrado) |
| `/social/perfil` | Perfil del usuario | Si (usuario registrado) |
| `/social/perfil/:profileUserId` | Perfil de otro usuario | Si (usuario registrado) |
| `/social/editarPerfil` | Editar perfil y biografia | Si (usuario registrado) |
| `/social/pelicula/:movieId` | Detalle de pelicula en contexto social | Si (usuario registrado) |
| `/social/notificaciones` | Pagina de notificaciones | Si (usuario registrado) |
| `/social/resena/:reviewId` | Resena individual | Si (usuario registrado) |
| `*` | Pagina 404 (Error personalizado) | No |

## Estrategia de ramas

Se usa una estrategia basada en ramas de trabajo y consolidacion:

- `main`: reservada exclusivamente para produccion.
- `develop`: linea base donde se integran las tareas del equipo.
- `feature/nombre-tarea`: ramas para desarrollar hitos o funcionalidades.
- `bugfix/nombre-error`: ramas para corregir fallos detectados en `develop`.

### Flujo recomendado

1. Crear una rama `feature/...` desde `develop`.
2. Desarrollar y probar la funcionalidad.
3. Abrir pull request hacia `develop`.
4. Validar y, cuando este estable, fusionar `develop` hacia `main`.

## Convenciones usadas

- Componentes de React organizados en `src/Component/`.
- Navegacion centralizada con `react-router-dom`.
- Estilos base con Tailwind CSS complementados con `App.css`.
- Utilidades modulares en archivos separados (`authSession.js`, `filmateApi.js`, `dulceriaFlowUtils.js`, `purchaseHistory.js`, `recommendationUtils.js`).
- Pruebas unitarias e integracion con Vitest + Testing Library; E2E con Playwright.
- Lazy loading con `React.lazy` + `Suspense` para mejorar rendimiento.
- Manejo de errores global con `AppErrorBoundary`.
- Proteccion de rutas con `ProtectedRoute` para secciones que requieren autenticacion.
- Imagenes y assets publicos dentro de `public/`. 

## Notas

- El proyecto usa rutas y componentes ya preparados para extender nuevas vistas.
- Si cambias nombres de imagenes en `public/`, recuerda actualizar sus referencias en los componentes.

