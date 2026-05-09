# 🚀 TalentAI — IA aplicada a RRHH

Plataforma inteligente de gestión de Recursos Humanos con IA integrada.

---

## ¿Qué incluye esta aplicación?

- **Login y registro** de usuarios
- **Dashboard** con estadísticas en tiempo real
- **Gestión de empleados** (agregar, editar, buscar, filtrar)
- **Gestión de vacantes** (puestos de trabajo abiertos)
- **Pipeline de candidatos** (seguimiento de postulantes)
- **Perfil de usuario** editable
- **Datos de ejemplo** precargados para probar todo

---

## Requisitos previos

Necesitás tener **Docker Desktop** instalado en tu computadora.

> Si no lo tenés, descargalo desde: https://www.docker.com/products/docker-desktop

---

## ¿Cómo levantarlo por primera vez?

### Paso 1 — Abrí una terminal

**En Linux/Mac:** Buscá "Terminal" en tu computadora y abrila.

### Paso 2 — Entrá a la carpeta del proyecto

Escribí este comando exacto y presioná Enter:

```
cd ~/Proyecto-IA-aplicada-a-RRHH
```

### Paso 3 — Levantá la aplicación

Escribí este comando y presioná Enter:

```
docker compose up --build
```

> ⚠️ La primera vez tarda entre 3 y 8 minutos porque descarga los programas necesarios.
> Las veces siguientes tarda menos de 1 minuto.

### Paso 4 — Abrí la aplicación en tu navegador

Cuando veas en la terminal el mensaje `TalentAI corriendo en puerto 3000`, abrí tu navegador y andá a:

```
http://localhost:3000
```

---

## Usuario demo para probar

| Campo | Valor |
|-------|-------|
| Email | demo@talentai.com |
| Contraseña | Demo123! |

---

## ¿Cómo cerrar la aplicación?

En la terminal donde corre la aplicación, presioná:

```
Ctrl + C
```

Y luego escribí:

```
docker compose down
```

---

## ¿Cómo volver a levantarla después?

La próxima vez no hace falta el `--build`. Simplemente usá:

```
docker compose up
```

---

## Estructura del proyecto (para curiosos)

```
Proyecto-IA-aplicada-a-RRHH/
├── backend/        → El "cerebro" que procesa los datos
├── frontend/       → Lo que ves en el navegador
├── docker-compose.yml → El archivo que conecta todo
└── README.md       → Este archivo
```

---

## ¿Algo no funciona?

1. Asegurate de que Docker Desktop esté abierto y corriendo
2. Intentá apagar y volver a levantar: `docker compose down` y luego `docker compose up`
3. Si el puerto 3000 está ocupado, cerrá otros programas que lo usen

---

*Construido con Next.js · Node.js · MongoDB · Docker*
