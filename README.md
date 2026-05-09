# TalentAI — IA aplicada a RRHH

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

## ¿Cómo levantarla?

### Paso 1 — Abrí una terminal

Presioná `Ctrl + Alt + T` en tu teclado. Se abre una ventana negra con texto: eso es la terminal.

### Paso 2 — Entrá a la carpeta del proyecto

Escribí este comando exacto y presioná Enter:

```
cd ~/Proyecto-IA-aplicada-a-RRHH
```

### Paso 3 — Ejecutá el script de inicio

Escribí este comando y presioná Enter:

```
./start.sh
```

> La primera vez tarda entre 5 y 10 minutos porque descarga todo lo necesario.
> Las veces siguientes tarda menos de 1 minuto.

### Paso 4 — Abrí la aplicación en tu navegador

Cuando veas en la terminal el mensaje:

```
✅ MongoDB conectado
🚀 TalentAI Backend corriendo en puerto 5000
```

Abrí tu navegador (Chrome, Firefox, etc.) y entrá a:

```
http://localhost:3000
```

---

## Usuario demo para probar

| Campo | Valor |
|-------|-------|
| Email | demo@talentai.com |
| Contraseña | Demo123! |

En la pantalla de login hay un botón **"Completar automáticamente"** que carga estos datos por vos.

---

## ¿Cómo cerrar la aplicación?

En la terminal donde está corriendo, presioná `Ctrl + C`. Los datos quedan guardados.

---

## ¿Cómo volver a levantarla la próxima vez?

Exactamente igual: abrí la terminal, entrá a la carpeta y ejecutá `./start.sh`.

---

## Si algo no funciona

1. Verificá que el puerto 3000 no esté siendo usado por otro programa
2. Intentá apagar y volver a levantar: en la terminal presioná `Ctrl + C`, luego volvé a ejecutar `./start.sh`
3. Si Docker da error, cerrá la terminal, abrí una nueva y volvé al Paso 2

---

## Estructura del proyecto (para curiosos)

```
Proyecto-IA-aplicada-a-RRHH/
├── backend/            → El "cerebro" que procesa los datos
├── frontend/           → Lo que ves en el navegador
├── docker-compose.yml  → El archivo que conecta todo
├── start.sh            → Script para levantar todo con un comando
└── README.md           → Este archivo
```

---

*Construido con Next.js · Node.js · MongoDB · Docker*
