# CH Assist — Plataforma de RRHH asistida por IA

Aplicación web completa para gestión de recursos humanos con inteligencia artificial. Analizá CVs, generá planes de onboarding y tomá decisiones de selección basadas en datos.

---

## ¿Qué hace esta aplicación?

- **Dashboard de Candidatos** — Visualizá todos los análisis de CVs con métricas, scores y recomendaciones
- **Análisis de CVs con IA** — Subí CVs (PDF, Word, o ZIP con varios CVs) y obtené análisis objetivos generados por Claude AI
- **Plan de Onboarding** — Generá planes de 30 días personalizados para nuevos empleados con seguimiento de progreso
- **Exportación** — Descargá resultados en Excel o PDF

---

## ¿Qué necesitás antes de empezar?

Solo necesitás tener instalado **Docker Desktop**. Nada más.

- **Windows:** Descargá Docker Desktop en https://www.docker.com/products/docker-desktop/
- **Mac:** Descargá Docker Desktop en https://www.docker.com/products/docker-desktop/
- Después de instalarlo, abrilo y esperá a que diga "Docker Desktop is running"

---

## Cómo correr la aplicación

### En Windows

Abrí el **Símbolo del sistema** (buscá "cmd" en el menú inicio) y escribí estos comandos uno por uno:

```
cd %USERPROFILE%
git clone https://github.com/gsaraibe/Proyecto-IA-aplicada-a-RRHH.git
cd Proyecto-IA-aplicada-a-RRHH
docker compose up --build
```

### En Mac

Abrí la **Terminal** (buscá "Terminal" en Spotlight con Cmd+Espacio) y escribí:

```bash
cd ~
git clone https://github.com/gsaraibe/Proyecto-IA-aplicada-a-RRHH.git
cd Proyecto-IA-aplicada-a-RRHH
docker compose up --build
```

La primera vez tarda entre **5 y 10 minutos**. Las siguientes veces tarda 1-2 minutos.

Cuando veas este mensaje en la terminal, la app está lista:
```
CH Assist Backend corriendo en puerto 5000
```

### Abrir la aplicación en el navegador

Abrí Chrome, Firefox o Edge y escribí en la barra de dirección:

```
http://localhost:3000
```

---

## Datos de acceso para probar

| Campo | Valor |
|---|---|
| Email | demo@chassist.com |
| Contraseña | Demo123! |

La aplicación ya trae datos de ejemplo cargados automáticamente.

---

## Configurar la inteligencia artificial (IA)

Para usar las funciones de análisis de CVs y generación de planes de onboarding, necesitás una API Key de Anthropic (Claude).

### Cómo obtener la API Key:
1. Ingresá a **https://console.anthropic.com**
2. Creá una cuenta gratuita (o iniciá sesión)
3. Hacé clic en **"API Keys"** en el menú lateral
4. Hacé clic en **"Create Key"**
5. Copiá la clave que aparece

### Cómo configurarla en la app:
1. Iniciá sesión en CH Assist
2. En el menú lateral, hacé clic en **"Configuración"**
3. Pegá tu API Key en el campo correspondiente
4. Hacé clic en **"Guardar API Key"**

### Alternativa: configurar en el archivo .env
Si preferís configurarla antes de iniciar la app, editá el archivo `.env` que está en la carpeta del proyecto y completá:

```
API_KEY_IA=tu-clave-aqui
```

---

## Cómo apagar la aplicación

En la terminal donde está corriendo, presioná **Ctrl + C** (en Windows y Mac es igual).

### Cómo volver a encenderla la próxima vez

**Windows:**
```
cd %USERPROFILE%\Proyecto-IA-aplicada-a-RRHH
docker compose up
```

**Mac:**
```bash
cd ~/Proyecto-IA-aplicada-a-RRHH
docker compose up
```

---

## ¿Qué archivos acepta la aplicación?

Para los CVs:
- **PDF** (.pdf)
- **Word** (.docx)
- **ZIP** (.zip) — con múltiples CVs adentro

Para la descripción del puesto:
- **PDF** (.pdf)
- **Word** (.docx)
- O escribir directamente en el campo de texto

---

## Solución de problemas comunes

**"No configuration file provided" o "no such file or directory"**
Estás en la carpeta equivocada.
- Windows: escribí `cd %USERPROFILE%\Proyecto-IA-aplicada-a-RRHH`
- Mac: escribí `cd ~/Proyecto-IA-aplicada-a-RRHH`

**Error al analizar con IA: "No hay API Key configurada"**
Tenés que configurar tu API Key de Anthropic en la sección Configuración de la app.

**La app tarda mucho en cargar**
Es normal la primera vez. Esperá el mensaje de confirmación en la terminal.

**El navegador muestra error de conexión**
Esperá 1-2 minutos más. El backend todavía está iniciando.

**Errores al construir la primera vez**
Ejecutá este comando para limpiar Docker y volvé a intentar:
```
docker system prune -a
```
Cuando pregunte si estás seguro, escribí `y` y presioná Enter. Luego corré `docker compose up --build` de nuevo.

---

## Estructura del proyecto

```
Proyecto-IA-aplicada-a-RRHH/
├── backend/          ← API en Node.js + Express
│   └── src/
│       ├── models/   ← Modelos de MongoDB
│       ├── routes/   ← Endpoints de la API
│       └── seeds/    ← Datos de ejemplo
├── frontend/         ← Interfaz en Next.js + Tailwind
│   └── src/
│       └── app/      ← Páginas de la aplicación
├── docker-compose.yml
├── .env              ← Variables de entorno (crearlo si no existe)
└── README.md
```
