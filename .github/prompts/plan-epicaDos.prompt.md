# Plan: Implementación de Épica 2 - Administración de Usuarios

## Resumen Ejecutivo

Implementar un módulo de gestión de usuarios permitiendo a ADMINs visualizar un **listado paginado de 10 empleados por página** con la capacidad de **cambiar roles mediante una modal de confirmación**. Reutilizarás componentes existentes, mantendrás el patrón Atomic Design, y usarás DaisyUI para la modal.

---

## Estructura en 6 Fases

### Fase 1: Server Actions (`src/app/(app)/empleados/actions.ts`)

- **getUsers(page: number)**
  - Retorna usuarios paginados (10 por página)
  - Validar: solo ADMIN puede ejecutar
  - Retorna: `{ users: UserListItem[], total: number, pages: number, currentPage: number }`
  - Ordenar: Por `createdAt` descendente
- **changeUserRole(userId: string, newRole: Role)**
  - Cambiar rol de usuario
  - Validaciones:
    - Solo ADMIN puede ejecutar
    - No permitir cambiar el rol del usuario actual (logueado)
    - Usuario debe existir
  - Retorna: `{ success: boolean, error?: string, user?: UserListItem }`
  - Usar `prisma.user.update()`

### Fase 2: Componentes Nuevos

| Componente     | Ubicación                                         | Tipo     | Propósito                                  |
| -------------- | ------------------------------------------------- | -------- | ------------------------------------------ |
| `Select`       | `src/components/atoms/Select/index.tsx`           | Atom     | Input select genérico reutilizable         |
| `RoleSelector` | `src/components/molecules/RoleSelector/index.tsx` | Molecule | Select + modal de confirmación encapsulado |
| `UserTable`    | `src/components/organisms/UserTable/index.tsx`    | Organism | Tabla de usuarios con paginación           |
| `TableHeader`  | `src/components/atoms/Table/Header/index.tsx`     | Atom     | Header de tabla (opcional)                 |
| `TableRow`     | `src/components/atoms/Table/Row/index.tsx`        | Atom     | Row de tabla (opcional)                    |

#### 2.1 Atom: Select

- Props: `value: string, onChange: (value: string) => void, disabled?: boolean, options: { label: string; value: string }[]`
- Usar `<select>` HTML nativo con clases DaisyUI `.select`
- Clases: `select select-bordered`

#### 2.2 Molecule: RoleSelector

- Props:
  - `userId: string`
  - `currentRole: Role`
  - `onConfirm: (newRole: Role) => void`
  - `loading?: boolean`
- Comportamiento:
  - Renderiza Select con opciones: USER | ADMIN
  - Al cambiar, abre modal de confirmación (DaisyUI)
  - Modal pregunta: "¿Estás seguro de cambiar el rol a [newRole]?"
  - Botones: Confirmar | Cancelar
  - Si confirma → ejecuta `onConfirm(newRole)`
  - Si cancela → revertir select al valor anterior
  - Estado loading: deshabilita select

#### 2.3 Organism: UserTable

- Props:
  - `users: UserListItem[]`
  - `currentPage: number`
  - `totalPages: number`
  - `onPageChange: (page: number) => void`
  - `onRoleChange: (userId: string, newRole: Role) => void`
  - `loading?: boolean`
- Estructura:
  - Tabla HTML: `<table class="table table-zebra">` (DaisyUI)
  - Columnas: Nombre | Correo | Fecha Ingreso | Rol | Acciones
  - Cada fila con RoleSelector
  - Paginación: Botones "Anterior" y "Siguiente"
  - Mostrar: "Página X de Y | Total: Z empleados"
- Comportamiento:
  - RoleSelector en cada fila dispara `onRoleChange(userId, newRole)`
  - Paginación llama `onPageChange(page)`
  - Estado loading: deshabilita botones, selects, paginación

### Fase 3: Tipos TypeScript (`src/types/user.ts`)

```typescript
import { Role } from "@/generated/prisma/client";

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: Role;
  hireDate: Date;
  createdAt: Date;
}

export interface GetUsersResponse {
  users: UserListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface ChangeRoleResponse {
  success: boolean;
  error?: string;
  user?: UserListItem;
}
```

### Fase 4: Página `/empleados` (Doble Componente)

#### 4.1 Server Component (`src/app/(app)/empleados/page.tsx`)

- Lógica:
  1. Obtener sesión con `auth()`
  2. Validar que `user.role === "ADMIN"` (redirigir si no)
  3. Parsear `searchParams` para obtener `page` (default: 1)
  4. Ejecutar `getUsers(page)` del servidor
  5. Renderizar:
     - `<main class="p-8">`
     - Título: "Administración de Empleados"
     - Subtítulo: "Total de X empleados"
     - Componente `UserTableClient` con datos iniciales

#### 4.2 Client Component Wrapper (`src/app/(app)/empleados/client.tsx`)

- Props: `initialUsers: UserListItem[], initialPage: number, totalPages: number, total: number`
- Estado: `users, page, loading, error`
- Handlers:
  - `handlePageChange(newPage: number)`:
    - Llamar `router.push(?page=newPage)`
    - Esperar revalidación de servidor
  - `handleRoleChange(userId: string, newRole: Role)`:
    - Ejecutar Server Action `changeUserRole(userId, newRole)`
    - Si éxito: actualizar estado local + mostrar toast success
    - Si error: mostrar Alert con mensaje
    - Ejecutar `router.refresh()` para revalidar datos
- Manejo de errores:
  - Mostrar `<Alert variant="error">` si falla cambio de rol
  - Mantener tabla visible incluso con error

### Fase 5: Rutas y Layout

- **No requiere cambios** en `auth.config.ts` o `middleware.ts`
- **Sidebar ya apunta** a `/empleados` ✅ (confirmado en análisis)
- **Protección de ruta**:
  - Solo ADMIN puede acceder a `/empleados`
  - Si USER intenta acceder → redirigir a `/novedades` (en layout)

### Fase 6: Testing y Validación

#### 6.1 Test Funcional

- [ ] ADMIN accede a `/empleados` y ve listado de usuarios (máx 10 por página)
- [ ] Modal de confirmación aparece al cambiar rol
- [ ] Confirmar en modal → rol actualiza y persiste en BD
- [ ] Cancelar en modal → rol no cambia, select revierte
- [ ] Navegar entre páginas con paginación
- [ ] Si hay <10 usuarios, mostrar solo 1 página sin navegación extra
- [ ] USER intenta acceder a `/empleados` → redirigido a `/novedades`

#### 6.2 Validaciones en Server Actions

- [ ] No permitir cambiar el rol del usuario logueado (error claro)
- [ ] Solo ADMIN puede llamar `changeUserRole` (rechazar si no es ADMIN)
- [ ] Verificar que Prisma actualiza correctamente en BD
- [ ] Manejo de usuario inexistente (error: "Usuario no encontrado")

#### 6.3 UX/Visual

- [ ] Modal centrada y responsive
- [ ] Tabla legible en mobile (overflow horizontal si necesario)
- [ ] Loading states visibles (botones deshabilitados, spinner visual)
- [ ] Mensajes de error claros y en español
- [ ] Paginación deshabilitada si no hay más páginas
- [ ] Indicador visual de página actual

---

## Componentes Reutilizables

### ✅ Ya Existentes (Reutilizar Directamente)

- `Button` — Para paginación y botones de confirmación en modal
- `Alert` — Para mensajes de error en cambios de rol
- `Label` — Si hay labels en selects

### 🆕 Nuevos (Crear)

- `Select` — Input select genérico para roles
- `RoleSelector` — Molecule con lógica de modal integrada
- `UserTable` — Organism tabla + paginación

### 🎨 DaisyUI (No crear componentes, usar clases)

- `.table`, `.table-zebra` — Tabla
- `.modal`, `.modal-box`, `.modal-action` — Modal
- `.select`, `.select-bordered` — Select input
- `.btn`, `.btn-sm` — Botones (ya existente en Button)
- `.pagination`, `.join` — Paginación (opcional, usar botones simples)

---

## Decisiones Clave

| Decisión                   | Valor                       | Justificación                    |
| -------------------------- | --------------------------- | -------------------------------- |
| **Paginación**             | 10 usuarios/página          | Requerimiento exacto             |
| **Modal de confirmación**  | Sí, DaisyUI                 | Requerimiento + mejor UX         |
| **Sin búsqueda**           | Por ahora                   | Scope Épica 2 mínimo             |
| **Server/Client boundary** | Componente wrapper separado | Claridad y reutilización         |
| **Validación**             | En Server Actions           | Seguridad, no confiar en cliente |
| **Ordenamiento**           | Por `createdAt` DESC        | Usuarios más recientes primero   |

---

## Flujo de Datos

```
Page (Server Component)
  ├─ auth() → verificar ADMIN
  ├─ getUsers(page: 1) → Server Action
  └─ renderizar <UserTableClient users={...} page={1} totalPages={N} />

UserTableClient (Client Component)
  ├─ estado: page, users, loading, error
  │
  ├─ onChange role en RoleSelector
  │  └─ handleRoleChange(userId, newRole)
  │     ├─ changeUserRole(userId, newRole) → Server Action
  │     ├─ Si éxito:
  │     │  ├─ actualizar estado.users
  │     │  ├─ mostrar toast success
  │     │  └─ router.refresh() → revalidar
  │     └─ Si error: mostrar Alert
  │
  └─ onClick en paginación
     └─ handlePageChange(newPage)
        └─ router.push(?page=newPage)
           └─ servidor renderiza nueva página
```

---

## Archivos a Crear/Modificar

### Crear (Nuevos Archivos)

1. **`src/app/(app)/empleados/page.tsx`**
   - Server Component principal

2. **`src/app/(app)/empleados/client.tsx`**
   - Client Component wrapper

3. **`src/app/(app)/empleados/actions.ts`**
   - Server Actions: getUsers, changeUserRole

4. **`src/types/user.ts`**
   - Tipos: UserListItem, GetUsersResponse, ChangeRoleResponse

5. **`src/components/atoms/Select/index.tsx`**
   - Componente Select atom

6. **`src/components/molecules/RoleSelector/index.tsx`**
   - Componente RoleSelector molecule

7. **`src/components/organisms/UserTable/index.tsx`**
   - Componente UserTable organism

### Modificar (Archivos Existentes)

- **`src/components/organisms/Sidebar/index.tsx`**
  - ✅ Ya tiene referencia a `/empleados` (no requiere cambios)

- **`src/app/(app)/layout.tsx`**
  - ✅ Ya protege rutas (verificar que user está autenticado)
  - Considerar: agregar validación adicional si USER intenta acceder a `/empleados`

### Opcional (Refactorización Futura)

- `src/components/atoms/Table/Header/index.tsx` — Si se necesita modularizar más
- `src/components/atoms/Table/Row/index.tsx` — Si se necesita modularizar más

---

## Orden de Implementación

1. **Crear tipos** (`src/types/user.ts`) — Sin dependencias
2. **Crear Server Actions** (`src/app/(app)/empleados/actions.ts`) — Usa tipos + Prisma
3. **Crear Atom Select** (`src/components/atoms/Select/index.tsx`) — Sin dependencias
4. **Crear Molecule RoleSelector** (`src/components/molecules/RoleSelector/index.tsx`) — Usa Select + Alert (existente)
5. **Crear Organism UserTable** (`src/components/organisms/UserTable/index.tsx`) — Usa RoleSelector + Button (existente)
6. **Crear Client Component** (`src/app/(app)/empleados/client.tsx`) — Usa UserTable + Server Actions
7. **Crear Page Server Component** (`src/app/(app)/empleados/page.tsx`) — Usa Client Component + Server Actions
8. **Testing Manual** — Verificar flujo completo

---

## Consideraciones Futuras (No incluir en Épica 2)

1. **Toast Notifications**
   - Agregar librería `sonner` para feedback visual elegante en cambios de rol
   - Alternativa: Usar `<Alert>` existente (más simple, sin dependencias)

2. **DataTable Genérico**
   - Refactorizar `UserTable` a componente genérico para reutilizar en Épica 3 (Novedades/Vacaciones)
   - Esperar hasta implementar segunda tabla para identificar patrón

3. **Auditoría**
   - Campos `updatedBy` y `updatedAt` en modelo User si se requiere tracking
   - Agregar en migración Prisma si se decide implementar

4. **Búsqueda y Filtrado**
   - Agregar búsqueda por nombre/correo en Épica 2.2 (futuro refinamiento)

5. **Validaciones Adicionales**
   - Permitir solo cambiar roles de usuarios con `role !== ADMIN` (proteger superadmin)
   - Implementar si se requiere en futuro

---

## Validaciones Críticas en Server Actions

### getUsers

```typescript
// 1. Verificar que el usuario es ADMIN
if (!session?.user?.role || session.user.role !== "ADMIN") {
  throw new Error("No autorizado");
}

// 2. Validar página
const page = Math.max(1, page);

// 3. Calcular skip
const skip = (page - 1) * 10;
const pageSize = 10;

// 4. Obtener total de usuarios
const total = await prisma.user.count();
const pages = Math.ceil(total / pageSize);

// 5. Validar que página no excede límite
if (page > pages && pages > 0) {
  throw new Error("Página no válida");
}

// 6. Obtener usuarios
const users = await prisma.user.findMany({
  skip,
  take: pageSize,
  orderBy: { createdAt: "desc" },
});

return { users, total, pages, currentPage: page };
```

### changeUserRole

```typescript
// 1. Verificar que el usuario es ADMIN
if (!session?.user?.role || session.user.role !== "ADMIN") {
  throw new Error("No autorizado");
}

// 2. Validar que no cambie su propio rol
if (session.user.id === userId) {
  throw new Error("No puedes cambiar tu propio rol");
}

// 3. Validar que el nuevo rol es válido
if (!["USER", "ADMIN"].includes(newRole)) {
  throw new Error("Rol no válido");
}

// 4. Verificar que el usuario existe
const userExists = await prisma.user.findUnique({
  where: { id: userId },
});

if (!userExists) {
  throw new Error("Usuario no encontrado");
}

// 5. Actualizar rol
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { role: newRole },
});

return { success: true, user: updatedUser };
```

---

## Notas Técnicas

- **Session Management**: Usar `auth()` de NextAuth en Server Components, `useSession()` en Client si se necesita
- **Router Revalidation**: Usar `router.push()` para paginación, `router.refresh()` para revalidar datos
- **Type Safety**: Generar tipos Prisma automáticamente con `prisma generate`
- **Error Handling**: Pasar errores de Server Actions a Client via estado, mostrar con `<Alert>`
- **Loading States**: Usar parámetro `loading` en componentes para deshabilitar interacciones

---

## Criterios de Aceptación (HU 2.1)

- [ ] ADMIN ve un listado de usuarios con: Nombre, Correo, Fecha de Ingreso, Rol Actual
- [ ] Tabla muestra máximo 10 usuarios por página
- [ ] Existe control (selector/dropdown) en cada fila para cambiar rol
- [ ] Modal de confirmación aparece antes de cambiar rol
- [ ] Los cambios de rol persisten en la base de datos inmediatamente
- [ ] Usuario logueado no puede cambiar su propio rol
- [ ] Solo usuarios con rol ADMIN pueden acceder a esta vista
- [ ] Interfaz es responsive (mobile, tablet, desktop)

---

## Estimación de Tiempo

- **Fase 1-3 (Setup + Tipos)**: 30 min
- **Fase 2 (Componentes)**: 1-1.5 h
- **Fase 4 (Páginas)**: 1 h
- **Fase 6 (Testing)**: 30 min
- **Total**: ~3-3.5 h de desarrollo

---

**¡Listo para comenzar la implementación! 🚀**
