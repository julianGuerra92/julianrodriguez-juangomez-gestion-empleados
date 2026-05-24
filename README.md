# 📋 Sistema de Gestión de Empleados

Una aplicación web moderna para la gestión integral de empleados, incluyendo administración de usuarios, control de horas extras, incapacidades y solicitudes de vacaciones.

## 🚀 Acceso a la Aplicación

**URL de Despliegue (Vercel):**
- 🔗 [https://julianrodriguez-juangomez-gestion-empleados.vercel.app/](https://julianrodriguez-juangomez-gestion-empleados.vercel.app/)

**Repositorio:**
- 📦 [https://github.com/julianGuerra92/julianrodriguez-juangomez-gestion-empleados](https://github.com/julianGuerra92/julianrodriguez-juangomez-gestion-empleados)

---

## 👥 Integrantes del Equipo

| Nombre | Rol |
|--------|-----|
| **Julián Andrés Rodríguez Guerra** | Desarrollador Full Stack |
| **Juan Carlos Gómez Jaramillo** | Desarrollador Full Stack |

---

## 🔐 Credenciales de Prueba

### Usuario Administrador
```
Email: admin@empresa.com
Contraseña: Admin123!
```
**Acceso a:** Dashboard, Gestión de Usuarios, Aprobación de Vacaciones, Novedades, Reportes

### Usuario Empleado
```
Email: empleado@empresa.com
Contraseña: User123!
```
**Acceso a:** Mis Vacaciones, Mis Novedades, Solicitud de Vacaciones

---

## ✨ Características Principales

### Épica 1: Acceso y Seguridad
- ✅ Landing Page responsiva
- ✅ Autenticación segura con NextAuth.js
- ✅ Navegación basada en roles (ADMIN/USER)
- ✅ Sidebar colapsable y adaptable

### Épica 2: Administración de Usuarios
- ✅ Listado de usuarios registrados
- ✅ Gestión de roles (USER/ADMIN)
- ✅ Información de empleados con fechas de ingreso
- ✅ Cambio de roles en tiempo real

### Épica 3: Gestión de Novedades
- ✅ Registro de horas extras
- ✅ Registro de incapacidades
- ✅ Modal para crear nuevas novedades
- ✅ Historial de novedades por empleado
- ✅ Tabla paginada

### Épica 4: Gestión de Vacaciones
- ✅ Cálculo automático de días disponibles (15 días/año)
- ✅ Solicitud de vacaciones mediante modal
- ✅ Historial de solicitudes
- ✅ Panel de aprobación/rechazo para administradores
- ✅ Validación de días hábiles

### Épica 5: Dashboard y Seguimiento
- ✅ Gráficas de horas extras por mes
- ✅ Proporción de incapacidades vs horas extras
- ✅ Filtros por empleado o vista general
- ✅ Reportes analíticos

---

## 🏗️ Estructura del Proyecto

```
julianrodriguez-juangomez-gestion-empleados/
├── src/
│   ├── app/                          # Rutas y páginas de la aplicación
│   │   ├── (auth)/                   # Rutas de autenticación
│   │   │   └── login/
│   │   ├── (app)/                    # Rutas protegidas
│   │   │   ├── dashboard/            # Dashboard de administrador
│   │   │   ├── empleados/            # Gestión de usuarios
│   │   │   ├── novedades/            # Registro de novedades
│   │   │   ├── vacaciones/           # Gestión de vacaciones
│   │   │   └── admin/
│   │   ├── api/
│   │   │   └── auth/                 # Rutas de autenticación
│   │   ├── layout.tsx                # Layout principal
│   │   ├── page.tsx                  # Landing Page
│   │   └── globals.css               # Estilos globales
│   │
│   ├── components/                   # Componentes React reutilizables
│   │   ├── atoms/                    # Componentes básicos (Button, Input, Label, etc.)
│   │   ├── molecules/                # Componentes compuestos (FormField, NavLink, etc.)
│   │   └── organisms/                # Componentes complejos (Sidebar, Tables, Forms, etc.)
│   │
│   ├── actions/                      # Server Actions de Next.js
│   │   ├── dashboard.ts              # Lógica de dashboard
│   │   ├── empleados.ts              # Gestión de usuarios
│   │   ├── login.ts                  # Autenticación
│   │   ├── novedades.ts              # Gestión de novedades
│   │   └── vacaciones.ts             # Gestión de vacaciones
│   │
│   ├── lib/                          # Utilidades y funciones auxiliares
│   │   └── prisma.ts                 # Cliente de Prisma
│   │
│   ├── types/                        # Tipos TypeScript
│   │   ├── dashboard.ts
│   │   ├── novedad.ts
│   │   ├── vacation.ts
│   │   ├── user.ts
│   │   └── next-auth.d.ts
│   │
│   ├── constants/                    # Constantes de la aplicación
│   │   └── roles.ts
│   │
│   ├── auth.config.ts                # Configuración de autenticación
│   ├── auth.ts                       # Configuración de NextAuth
│   ├── middleware.ts                 # Middleware para proteger rutas
│   └── proxy.ts                      # Configuración de proxies
│
├── prisma/
│   ├── schema.prisma                 # Esquema de base de datos
│   └── seed.ts                       # Script para popular la BD
│
├── public/                           # Archivos estáticos
├── next.config.ts                    # Configuración de Next.js
├── tsconfig.json                     # Configuración de TypeScript
├── tailwind.config.ts                # Configuración de Tailwind CSS
├── postcss.config.mjs                # Configuración de PostCSS
├── eslint.config.mjs                 # Configuración de ESLint
└── package.json                      # Dependencias del proyecto
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - [Next.js 15](https://nextjs.org/) - Framework React
  - [React 19](https://react.dev/) - Librería UI
  - [TypeScript](https://www.typescriptlang.org/) - Tipado estático
  - [Tailwind CSS](https://tailwindcss.com/) - Estilos CSS
  - [shadcn/ui](https://ui.shadcn.com/) - Componentes UI

- **Backend:**
  - [Next.js Server Actions](https://nextjs.org/docs/app/building-application/data-fetching/server-actions-and-mutations) - Lógica del servidor
  - [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) - Protección de rutas

- **Base de Datos & ORM:**
  - [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional
  - [Prisma](https://www.prisma.io/) - ORM con tipado fuerte
  - [Supabase](https://supabase.com/) - Hosting de PostgreSQL

- **Autenticación:**
  - [NextAuth.js v5 (Auth.js)](https://authjs.dev/) - Autenticación segura
  - [@auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma) - Adaptador Prisma

- **Utilidades:**
  - [date-fns](https://date-fns.org/) - Manipulación de fechas
  - [ESLint](https://eslint.org/) - Linter de código

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18.17 o superior
- npm, yarn, pnpm o bun

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/julianGuerra92/julianrodriguez-juangomez-gestion-empleados.git
cd julianrodriguez-juangomez-gestion-empleados
```

2. **Instalar dependencias:**
```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env.local` en la raíz del proyecto:
```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

4. **Configurar la base de datos:**
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Desarrollo

Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver la aplicación.

### Build para Producción

```bash
npm run build
npm run start
```

---

## 📊 Modelo de Datos

El proyecto utiliza Prisma para la gestión de la base de datos con los siguientes modelos principales:

- **User**: Información de empleados y administradores
- **Novedad**: Registro de horas extras e incapacidades
- **Vacation**: Solicitudes de vacaciones y su estado
- **Account**: Cuentas vinculadas (NextAuth)
- **Session**: Sesiones de usuario activas (NextAuth)

---

## 🔒 Seguridad

- Autenticación con NextAuth.js usando protección CSRF
- Middleware para proteger rutas según roles
- Server Actions con validación en servidor
- Variables de entorno sensibles protegidas
- Contraseñas hasheadas en base de datos

---

## 📚 Documentación Adicional

Para más detalles sobre Next.js y sus características:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Documentación de NextAuth.js](https://authjs.dev/)

---

## 📝 Licencia

Este proyecto fue desarrollado como parte de un proyecto académico.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abre primero un issue para discutir los cambios propuestos.

---

**Última actualización:** Mayo 2026
