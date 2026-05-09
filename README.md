# TalentAI — Gestión de Recursos Humanos

Aplicación web completa para gestionar empleados, puestos de trabajo y candidatos. Incluye dashboard, autenticación y datos de ejemplo listos para usar.

---

## ¿Qué necesitás antes de empezar?

Solo necesitás tener instalado **Docker Desktop**. Nada más.

- **Descargar Docker Desktop para Windows:** https://www.docker.com/products/docker-desktop/
- Después de instalarlo, abrilo y esperá a que diga "Docker Desktop is running"

---

## Cómo correr la aplicación (Windows)

### Paso 1 — Limpiar Docker (solo la primera vez)

Abrí el **Símbolo del sistema** (buscá "cmd" en el menú inicio) y escribí:

```
docker system prune -a
```

Cuando pregunte si estás seguro, escribí `y` y presioná Enter.

### Paso 2 — Descargar el proyecto

En la misma ventana, escribí estos comandos uno por uno:

```
cd %USERPROFILE%
git clone https://github.com/gsaraibe/Proyecto-IA-aplicada-a-RRHH.git
cd Proyecto-IA-aplicada-a-RRHH
```

### Paso 3 — Iniciar la aplicación

```
docker compose up --build
```

La primera vez tarda entre **5 y 10 minutos**. Las veces siguientes tarda 1-2 minutos.

Cuando veas este mensaje la app está lista:
```
TalentAI Backend corriendo en puerto 5000
```

### Paso 4 — Abrir en el navegador

Abrí Chrome o Edge y escribí:

```
http://localhost:3000
```

---

## Datos de acceso para probar

| Campo | Valor |
|---|---|
| Email | demo@talentai.com |
| Contraseña | Demo123! |

---

## Cómo apagar la aplicación

En la terminal donde está corriendo, presioná **Ctrl + C**.

Para volver a encenderla la próxima vez:

```
cd %USERPROFILE%\Proyecto-IA-aplicada-a-RRHH
docker compose up
```

---

## ¿Qué tiene la aplicación?

- **Dashboard** con resumen de empleados, puestos y candidatos
- **Empleados** con búsqueda y filtros
- **Puestos de trabajo** con gestión de vacantes
- **Candidatos** con seguimiento del proceso de selección
- **Perfil de usuario**
- **Login / Registro / Recuperar contraseña**

---

## Solución de problemas

**"No configuration file provided"**
Estás en la carpeta equivocada. Escribí `cd %USERPROFILE%\Proyecto-IA-aplicada-a-RRHH` y volvé a intentar.

**"exec format error" o errores al construir**
Ejecutá `docker system prune -a` y volvé a correr `docker compose up --build`.

**La app tarda mucho**
Es normal la primera vez. Esperá el mensaje de confirmación en la terminal.

**El navegador muestra error**
Esperá un minuto más. La aplicación todavía está iniciando.
