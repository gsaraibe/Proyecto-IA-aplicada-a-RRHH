# TalentStream AI — Plataforma de Recursos Humanos con Inteligencia Artificial

> Una herramienta moderna para gestionar postulantes, analizar CVs y administrar pruebas de selección de personal — todo en un solo lugar.

---

## ¿Qué es esto?

TalentStream AI es una aplicación web que podés abrir en tu navegador (como si fuera Gmail o Instagram, pero en tu propia computadora). Está pensada para equipos de Recursos Humanos que quieren:

- Ver y analizar los CVs de candidatos con puntaje automático
- Asignar y revisar pruebas psicotécnicas
- Tener un panel de control con estadísticas del proceso de selección

Todo funciona localmente — no necesitás internet ni contratar ningún servicio externo.

---

## Antes de empezar: ¿qué necesito instalar?

Solo necesitás **una sola herramienta**: **Docker Desktop**.

> Docker es como un "paquete todo incluido" que contiene todo lo que la app necesita para funcionar. No necesitás entender cómo funciona por dentro — solo instalarlo y abrirlo.

---

### ¿Cómo instalo Docker Desktop?

#### En Windows

1. Abrí tu navegador y andá a: **https://www.docker.com/products/docker-desktop**
2. Hacé clic en el botón azul que dice **"Download for Windows"**
3. Cuando termine de descargar, hacé doble clic en el archivo `.exe` que bajaste
4. Seguí los pasos del instalador (siempre clic en "Next" o "Aceptar")
5. Cuando termine, reiniciá la computadora
6. Después de reiniciar, buscá **Docker Desktop** en el menú de inicio y ábrilo
7. Esperá a que aparezca la ballena azul en la barra de tareas (abajo a la derecha) — eso significa que Docker está listo

> ⚠️ **Importante en Windows**: Docker Desktop puede pedirte que instales "WSL 2". Si aparece ese mensaje, hacé clic en el enlace que te da y seguí las instrucciones — es un paso normal.

#### En Mac

1. Abrí tu navegador y andá a: **https://www.docker.com/products/docker-desktop**
2. Hacé clic en el botón que dice **"Download for Mac"**
   - Si tu Mac tiene chip **M1, M2 o M3** (los más nuevos), elegí "Apple Silicon"
   - Si tu Mac es más viejo (anterior a 2021), elegí "Intel Chip"
   - ¿No sabés cuál tenés? Hacé clic en la manzana () arriba a la izquierda → "Acerca de este Mac" → si dice "Chip Apple M1/M2/M3" es Apple Silicon, si dice "Intel Core" es Intel
3. Abrí el archivo `.dmg` que bajaste y arrastrá Docker a la carpeta Aplicaciones
4. Abrí Docker desde Aplicaciones
5. Esperá a que aparezca la ballena en la barra de menú (arriba a la derecha) — eso significa que Docker está listo

---

## Cómo abrir la aplicación (paso a paso)

### Paso 1: Asegurate de que Docker esté abierto

- **Windows**: Buscá la ballena azul en la barra de tareas abajo a la derecha. Si no está, abrí "Docker Desktop" desde el menú de inicio.
- **Mac**: Buscá la ballena en la barra de menú arriba a la derecha. Si no está, abrí "Docker Desktop" desde Aplicaciones.

La ballena tiene que estar **quieta** (sin moverse), lo que indica que Docker está listo.

### Paso 2: Abrí una terminal (la "consola de comandos")

No te asustes, solo vamos a escribir un comando corto.

#### En Windows
1. Apretá las teclas **Windows + R** al mismo tiempo
2. Escribí `cmd` y apretá Enter
3. Se abre una ventana negra — eso es la terminal

#### En Mac
1. Apretá **Command + Espacio** al mismo tiempo para abrir Spotlight
2. Escribí `Terminal` y apretá Enter
3. Se abre una ventana — eso es la terminal

### Paso 3: Navegá a la carpeta del proyecto

En la terminal, escribí este comando y apretá Enter:

**En Windows:**
```
cd C:\ruta\donde\guardaste\el\proyecto\Proyecto-IA-aplicada-a-RRHH
```

**En Mac:**
```
cd /ruta/donde/guardaste/el/proyecto/Proyecto-IA-aplicada-a-RRHH
```

> 💡 **¿No sabés la ruta?** En Windows podés arrastrar la carpeta a la ventana negra y aparece sola. En Mac hacés lo mismo.

### Paso 4: Levantá la aplicación

Escribí este comando y apretá Enter:

```
docker compose up --build
```

**La primera vez tarda entre 3 y 8 minutos** — Docker está descargando todo lo necesario. Vas a ver mucho texto en pantalla: eso es normal. No cierres esa ventana.

Cuando veas algo parecido a esto, significa que está listo:

```
talentstream_backend   | TalentStream API corriendo en puerto 5000
talentstream_backend   | MongoDB conectado
talentstream_backend   | Datos de ejemplo cargados exitosamente.
```

### Paso 5: Abrí la aplicación en tu navegador

Abrí **Google Chrome**, **Firefox**, o el navegador que uses, y escribí en la barra de direcciones:

```
http://localhost:3000
```

¡Listo! La aplicación debería aparecer.

---

## Acceso demo (para probar sin crear cuenta)

Podés entrar directamente con estos datos de prueba:

| | |
|---|---|
| **Email** | demo@talentstream.ai |
| **Contraseña** | Demo1234 |

O hacé clic en el botón **"Usar cuenta demo"** que aparece en la pantalla de inicio de sesión.

---

## Cómo cerrar la aplicación

Cuando termines de usarla, volvé a la terminal (la ventana negra/blanca donde escribiste el comando) y apretá:

- **Windows y Mac**: las teclas `Ctrl + C` al mismo tiempo

Eso detiene la aplicación. Para cerrar también la terminal, simplemente cerrá la ventana.

---

## Cómo volver a abrir la aplicación (después de cerrarla)

La próxima vez que quieras usarla:

1. Asegurate de que Docker Desktop esté abierto (la ballena en la barra)
2. Abrí la terminal
3. Navegá a la carpeta del proyecto (igual que el Paso 3)
4. Escribí este comando (más rápido que la primera vez):

```
docker compose up
```

5. Esperá a ver el mensaje de que está listo
6. Abrí el navegador en `http://localhost:3000`

---

## ¿Qué tiene la aplicación?

### Pantallas disponibles

| Pantalla | Para qué sirve |
|---|---|
| **Login** | Iniciar sesión con tu cuenta |
| **Registro** | Crear una nueva cuenta |
| **Olvidé mi contraseña** | Recuperar acceso a tu cuenta |
| **Dashboard** | Ver todas las métricas y estadísticas |
| **Análisis de CVs** | Ver, filtrar y analizar los CVs de candidatos |
| **Pruebas de HR** | Ver y gestionar las pruebas psicotécnicas |
| **Configuración** | Ajustar preferencias de la plataforma |
| **Perfil** | Editar tu información personal |

### Datos de ejemplo incluidos

La aplicación viene con datos cargados para que puedas ver cómo funciona:
- 8 CVs de candidatos con análisis de IA
- 8 pruebas psicotécnicas con resultados
- 6 meses de métricas históricas
- 3 usuarios (1 administrador demo, 1 gerente, 1 reclutador)

---

## Solución de problemas frecuentes

### "La página no carga" o "No se puede acceder al sitio"

1. Verificá que Docker Desktop esté abierto (la ballena en la barra)
2. Verificá que hayas ejecutado `docker compose up` en la terminal
3. Esperá un par de minutos — la primera vez tarda más
4. Asegurate de escribir bien la dirección: `http://localhost:3000` (con el http, sin www)

### "Error" en la terminal al ejecutar docker compose up

- Asegurate de estar dentro de la carpeta correcta del proyecto
- Verificá que Docker Desktop esté completamente iniciado (la ballena quieta, sin girar)
- En Windows: verificá que Docker tenga permisos de administrador

### "Ya tengo la aplicación corriendo pero no funciona bien"

Intentá este comando para reiniciar todo desde cero:

```
docker compose down && docker compose up --build
```

### La aplicación corre lento

Es normal la primera vez. Una vez que los datos están cargados, todo funciona más rápido.

---

## Información técnica (para quien quiera saber más)

La aplicación está construida con:

- **Pantallas** (frontend): React + Vite — lo que ves en el navegador
- **Servidor** (backend): Node.js + Express — el que procesa los datos
- **Base de datos**: MongoDB — donde se guarda toda la información
- **Contenedor**: Docker — el que hace que todo funcione junto sin instalar nada extra

Todo corre en tu computadora. Ningún dato sale a internet.

### Puertos usados

| Servicio | Puerto |
|---|---|
| Aplicación web | 3000 |
| API (servidor) | 5000 |
| Base de datos | 27017 |

---

## Comandos útiles (para usuarios más avanzados)

```bash
# Levantar la aplicación (primera vez o después de cambios)
docker compose up --build

# Levantar la aplicación (uso normal)
docker compose up

# Levantar en segundo plano (sin ocupar la terminal)
docker compose up -d

# Ver qué está pasando mientras corre
docker compose logs -f

# Detener la aplicación
docker compose down

# Detener Y borrar todos los datos guardados (empezar de cero)
docker compose down -v

# Ver si los contenedores están corriendo
docker compose ps
```
