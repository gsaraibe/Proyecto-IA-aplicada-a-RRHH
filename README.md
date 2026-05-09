# TalentAI — IA aplicada a RRHH

Plataforma inteligente de gestión de Recursos Humanos con IA integrada.

---

## ¿Qué incluye?

- **Login y registro** de usuarios
- **Dashboard** con estadísticas en tiempo real
- **Gestión de empleados** — agregar, buscar, filtrar
- **Gestión de vacantes** — crear y administrar puestos
- **Pipeline de candidatos** — seguimiento de postulantes
- **Perfil de usuario** editable
- **Datos de ejemplo** precargados para probar todo

---

## Antes de empezar — instalá Docker Desktop

Docker Desktop es el programa que hace funcionar toda la aplicación. Solo hay que instalarlo una vez.

### ¿Cómo instalarlo?

1. Abrí tu navegador y entrá a: **https://www.docker.com/products/docker-desktop**
2. Hacé clic en **"Download for Windows"**
3. Abrí el archivo que descargaste y seguí los pasos de instalación
4. Reiniciá tu computadora cuando te lo pida
5. Buscá "Docker Desktop" en el menú Inicio y abrilo

> Sabés que está listo cuando ves un ícono de ballena (🐳) en la barra de tareas (abajo a la derecha) y **no se está moviendo**.

---

## ¿Cómo levantar la aplicación?

### Paso 1 — Abrí Docker Desktop

Buscalo en el menú Inicio y abrilo. Esperá que el ícono de la ballena deje de moverse.

### Paso 2 — Abrí PowerShell

Presioná las teclas `Windows + R` al mismo tiempo, escribí `powershell` y presioná Enter.

### Paso 3 — Entrá a la carpeta del proyecto

Copiá y pegá este comando en PowerShell y presioná Enter:

```powershell
cd $env:USERPROFILE\Proyecto-IA-aplicada-a-RRHH
```

### Paso 4 — Ejecutá el script de inicio

Copiá y pegá este comando y presioná Enter:

```powershell
.\start.ps1
```

> **La primera vez** tarda entre 5 y 10 minutos porque descarga todo lo necesario.
> **Las veces siguientes** tarda menos de 1 minuto.

### Paso 5 — Abrí la aplicación

Cuando veas en la ventana de PowerShell:

```
✅ MongoDB conectado
🚀 TalentAI Backend corriendo en puerto 5000
```

Abrí **Chrome** o **Edge** y entrá a:

```
http://localhost:3000
```

---

## Usuario de prueba

| Campo | Valor |
|-------|-------|
| Email | demo@talentai.com |
| Contraseña | Demo123! |

En la pantalla de login hay un botón **"Completar automáticamente"** que carga estos datos por vos.

---

## ¿Cómo cerrar la aplicación?

En la ventana de PowerShell donde corre la aplicación, presioná:

```
Ctrl + C
```

Los datos quedan guardados para la próxima vez.

---

## ¿Cómo volver a levantarla?

Exactamente igual que siempre:
1. Abrí Docker Desktop
2. Abrí PowerShell
3. Ejecutá `.\start.ps1`

---

## Si algo no funciona

**Error "Docker no está corriendo":**
→ Abrí Docker Desktop desde el menú Inicio y esperá que cargue

**La página no abre en el navegador:**
→ Esperá un poco más y probá de nuevo. La primera vez puede tardar más

**Error desconocido:**
→ Cerrá la ventana de PowerShell, volvé a abrirla y ejecutá `.\start.ps1` de nuevo

---

## Estructura del proyecto

```
Proyecto-IA-aplicada-a-RRHH/
├── frontend/           → Lo que ves en el navegador
├── backend/            → El servidor que procesa todo
├── docker-compose.yml  → Conecta todas las partes
├── start.ps1           → Script de inicio para Windows ← usá este
├── start.sh            → Script de inicio para Linux/Mac
└── README.md           → Este archivo
```

---

*Construido con Next.js · Node.js · MongoDB · Docker*
