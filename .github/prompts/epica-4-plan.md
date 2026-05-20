# Plan: Implementación de Épica 4 - Gestión de Vacaciones

 Implementar un sistema completo de solicitud, revisión y control de vacaciones. Los usuarios pueden consultar su saldo de días disponibles, ver su historial de solicitudes y crear nuevas peticiones mediante un modal. Los ADMINs acceden a una pantalla dedicada para aprobar o rechazar solicitudes pendientes. Reutilizar patrones de Épicas 1–3.

---

## 🎯 Decisiones Confirmadas

| Aspecto | Decisión |
|---|---|
| Interfaz de solicitud | Modal emergente (consistente con NovedadModal) |
| Cálculo de días disponibles | 15 días por año laborado desde `startDate`, menos días ya aprobados/disfrutados |
| Días a validar | Días hábiles (lunes a viernes, sin feriados) |
| Estado inicial de solicitud | `PENDIENTE` siempre |
| Permisos ADMIN | Pantalla separada con todas las solicitudes pendientes |
| Edición/Eliminación (USER) | Solo solicitudes en estado `PENDIENTE` pueden cancelarse |
| Visibilidad USER | Solo su propio historial y saldo |
| Visibilidad ADMIN | Todas las solicitudes pendientes de todos los empleados |

---

### Fase 1: Infraestructura
Crear tipos, interfaces y Server Actions base. Sin esto, nada del UI compila.

- `src/types/vacacion.ts` — Interfaces: `VacacionListItem`, `CreateVacacionPayload`, `GetVacacionesResponse`, `SaldoVacaciones`
- `src/actions/vacaciones.ts` — 5 Server Actions:
  - `getSaldoVacaciones(userId?)` — calcula días disponibles según `startDate` y aprobaciones previas
  - `getVacaciones(page, userId?, filterByStatus?)` — historial paginado con auth + authorization
  - `createVacacion(startDate, endDate)` — valida saldo, crea solicitud en estado `PENDIENTE`
  - `updateVacacionStatus(id, status)` — solo ADMIN; cambia a `APROBADA` o `RECHAZADA`
  - `deleteVacacion(id)` — solo propietario y solo si está `PENDIENTE`

### Fase 2: Componentes UI (Paralelizable después de Fase 1)

- `src/components/molecules/VacacionFormFields/` — Formulario con `startDate` y `endDate`; muestra días hábiles calculados en tiempo real y alerta si supera el saldo
- `src/components/molecules/SaldoVacacionesCard/` — Tarjeta/badge que muestra días disponibles, usados y totales del usuario
- `src/components/molecules/StatusBadge/` — Badge visual de estado (`PENDIENTE` / `APROBADA` / `RECHAZADA`) con colores DaisyUI

### Fase 3: Componentes Complejos (Después de Fase 2)

- `src/components/organisms/VacacionModal/` — Modal que integra `VacacionFormFields` + botones + alerts de error/éxito
- `src/components/organisms/VacacionTable/` — Tabla paginada del historial del usuario (columnas: Fecha Inicio, Fecha Fin, Días, Estado, Acciones)
- `src/components/organisms/SolicitudesPendientesTable/` — Tabla ADMIN con todas las solicitudes pendientes (columnas: Empleado, Fecha Inicio, Fecha Fin, Días, Saldo Disponible, Acciones)

### Fase 4: Integración Pages + Wrappers (Después de Fases 2–3)

**Ruta del usuario (`/vacaciones`):**
- `src/app/(app)/vacaciones/page.tsx` — Server Component: obtiene sesión, llama `getSaldoVacaciones` y `getVacaciones(page: 1)`, renderiza wrapper
- `src/app/(app)/vacaciones/vacaciones-wrapper.tsx` — Client Component: estado local, manejo de modal, acciones de crear/cancelar, actualización de tabla

**Ruta del ADMIN (`/vacaciones/admin`):**
- `src/app/(app)/vacaciones/admin/page.tsx` — Server Component: valida rol ADMIN, llama `getVacaciones(page: 1, filterByStatus: 'PENDIENTE')`, renderiza wrapper
- `src/app/(app)/vacaciones/admin/solicitudes-wrapper.tsx` — Client Component: manejo de aprobación/rechazo, actualización optimista de tabla

### Fase 5: Refinamiento (Opcional)

- Filtro por estado en la tabla del usuario
- Filtro por empleado en la pantalla ADMIN
- Cálculo de feriados nacionales para días hábiles
- Exportación de historial a CSV
- Optimizaciones de performance (revalidación selectiva)

---

## 📂 Estructura de Archivos a Crear

```
src/
├── actions/
│   └── vacaciones.ts                          [10-12 KB]
├── components/
│   ├── molecules/
│   │   ├── VacacionFormFields/index.tsx
│   │   ├── SaldoVacacionesCard/index.tsx
│   │   └── StatusBadge/index.tsx
│   └── organisms/
│       ├── VacacionModal/index.tsx
│       ├── VacacionTable/index.tsx
│       └── SolicitudesPendientesTable/index.tsx
├── types/
│   └── vacacion.ts                            [4-6 KB]
└── app/(app)/vacaciones/
    ├── page.tsx                               [Implementar]
    ├── vacaciones-wrapper.tsx                 [Crear]
    └── admin/
        ├── page.tsx                           [Implementar]
        └── solicitudes-wrapper.tsx            [Crear]
```

**Total de archivos nuevos:** 6 componentes + 1 actions + 1 types + 4 pages/wrappers = **12 archivos**

---

## 🔄 Reutilización Máxima

| Patrón | De Épica anterior | Aplicación en Épica 4 |
|---|---|---|
| Server Actions | `novedades.ts` / `empleados.ts` | Estructura auth → validation → BD |
| Client Wrapper | `NovedadesWrapper` / `UserTableWrapper` | `useActionState` + estado local + re-fetch |
| Modal Pattern | `NovedadModal` | `VacacionModal` con misma estructura |
| Tabla paginada | `NovedadTable` / `UserTable` | `VacacionTable` + `SolicitudesPendientesTable` |
| Átomos | `Button`, `Input`, `Alert`, `Select`, `Label` | Reutilizar directamente sin modificación |
| Badge de estado | Nuevo | `StatusBadge` reutilizable en ambas tablas |

---

## ✅ Validaciones Implementadas

### Server-side
- ✅ Autenticación (`session.user.id`)
- ✅ Autorización (propietario o ADMIN según acción)
- ✅ `startDate` < `endDate`
- ✅ Días hábiles solicitados ≤ saldo disponible del usuario
- ✅ No solapar con solicitudes aprobadas existentes
- ✅ Solo ADMIN puede llamar `updateVacacionStatus`
- ✅ Solo se puede eliminar si el estado es `PENDIENTE`

### Client-side
- ✅ Campos de fecha obligatorios
- ✅ Cálculo en tiempo real de días hábiles al cambiar fechas
- ✅ Advertencia visual si los días solicitados superan el saldo
- ✅ Botón "Guardar" deshabilitado si la validación de saldo falla
- ✅ Confirmación antes de cancelar o rechazar una solicitud

---

## 🔍 Verificación Final

| Paso | Verificar |
|---|---|
| Fase 1 | TypeScript compila; Prisma schema tiene modelo `Vacacion` con campo `status` |
| Fase 1 | `getSaldoVacaciones` retorna cálculo correcto según `startDate` del usuario |
| Fases 2–3 | Componentes renderizan sin errores |
| Fase 4 | USER ve su saldo y puede crear solicitud ✅ |
| Fase 4 | Solicitud con días > saldo es bloqueada con mensaje de error ✅ |
| Fase 4 | USER puede cancelar solicitud en estado `PENDIENTE` ✅ |
| Fase 4 | ADMIN ve todas las solicitudes pendientes en `/vacaciones/admin` ✅ |
| Fase 4 | ADMIN aprueba → estado cambia, saldo del empleado se descuenta ✅ |
| Fase 4 | ADMIN rechaza → estado cambia, saldo no se modifica ✅ |
| Fase 4 | USER sin rol ADMIN no puede acceder a `/vacaciones/admin` ✅ |

---

## 📌 Notas Importantes

- **Cálculo de días hábiles:** Usar `date-fns` (ya en dependencies) con `differenceInBusinessDays` para excluir fines de semana
- **Cálculo de saldo:** `(años laborados × 15) - días de solicitudes APROBADAS`; los años se calculan desde `user.startDate` hasta hoy con `differenceInYears`
- **Paginación:** Mantener `PAGE_SIZE = 10` (consistencia con Épicas anteriores)
- **Icons:** Lucide React — `CalendarDays` para vacaciones, `CheckCircle` / `XCircle` para aprobar/rechazar, `Clock` para pendiente
- **Responsive:** Tabla con `overflow-x-auto` en móvil; `SaldoVacacionesCard` con layout flex adaptable
- **Accesibilidad:** Modal con `role="dialog"`, botones de acción con `aria-label` descriptivos
- **Prisma schema:** Verificar que el modelo `Vacacion` incluya `status` como enum (`PENDIENTE`, `APROBADA`, `RECHAZADA`) y relación con `User`

---

## 📝 Detalles de Tipos (`src/types/vacacion.ts`)

```typescript
import { VacacionStatus } from "@/generated/prisma/client";

export interface SaldoVacaciones {
  diasTotales: number;       // años laborados × 15
  diasUsados: number;        // días de solicitudes APROBADAS
  diasDisponibles: number;   // diasTotales - diasUsados
}

export interface VacacionListItem {
  id: string;
  startDate: Date;
  endDate: Date;
  diasSolicitados: number;   // días hábiles calculados
  status: VacacionStatus;
  createdAt: Date;
  userId: string;
  userName: string;          // para la vista ADMIN
}

export interface CreateVacacionPayload {
  startDate: Date;
  endDate: Date;
}

export interface GetVacacionesResponse {
  vacaciones: VacacionListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface CreateVacacionResponse {
  success: boolean;
  error?: string;
  vacacion?: VacacionListItem;
}

export interface UpdateVacacionStatusResponse {
  success: boolean;
  error?: string;
  vacacion?: VacacionListItem;
}

export interface DeleteVacacionResponse {
  success: boolean;
  error?: string;
}
```

---

## 📝 Estructura de Server Actions (`src/actions/vacaciones.ts`)

```typescript
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { VacacionStatus } from "@/generated/prisma/client";
import { ROLES } from "@/constants/roles";
import { differenceInBusinessDays, differenceInYears } from "date-fns";
import type { ... } from "@/types/vacacion";

const PAGE_SIZE = 10;

// getSaldoVacaciones(userId?) → SaldoVacaciones
//   - Si userId proporcionado, solo ADMIN puede consultarlo
//   - Calcula años desde user.startDate
//   - Suma días de solicitudes con status APROBADA

// getVacaciones(page, userId?, filterByStatus?) → GetVacacionesResponse
//   - USER: filtra por su propio ID
//   - ADMIN: puede ver todas, con filtros opcionales

// createVacacion(startDate, endDate) → CreateVacacionResponse
//   - Valida saldo disponible con differenceInBusinessDays
//   - Verifica no solapamiento con solicitudes aprobadas
//   - Crea con status PENDIENTE

// updateVacacionStatus(id, status) → UpdateVacacionStatusResponse
//   - Solo ADMIN
//   - Si APROBADA: verifica saldo antes de confirmar

// deleteVacacion(id) → DeleteVacacionResponse
//   - Solo propietario o ADMIN
//   - Solo si status === PENDIENTE
```

---

## 🎨 Estructura de Componentes

### `SaldoVacacionesCard` (Molecule)
- **Props:** `saldo: SaldoVacaciones`
- **Comportamiento:** Tarjeta con 3 métricas: Días Totales, Días Usados, Días Disponibles. Color verde si hay saldo, amarillo si es bajo, rojo si es 0.
- **Reutilización:** Aparece tanto en `/vacaciones` (datos propios) como en `SolicitudesPendientesTable` (por fila de empleado)

### `VacacionFormFields` (Molecule)
- **Props:** `onSubmit`, `saldoDisponible`, `loading?`
- **Campos:** `startDate` (date input), `endDate` (date input)
- **Comportamiento:** Calcula y muestra días hábiles en tiempo real al cambiar fechas. Muestra alerta si supera saldo. Deshabilita envío si no hay saldo suficiente.

### `StatusBadge` (Molecule)
- **Props:** `status: VacacionStatus`
- **Comportamiento:** Badge DaisyUI con color semántico: `warning` → PENDIENTE, `success` → APROBADA, `error` → RECHAZADA
- **Reutilización:** Usado en `VacacionTable` y `SolicitudesPendientesTable`

### `VacacionModal` (Organism)
- **Props:** `isOpen`, `onClose`, `onSubmit`, `saldoDisponible`, `loading?`
- **Integra:** `VacacionFormFields` + botones Guardar/Cancelar + Alert de error

### `VacacionTable` (Organism)
- **Props:** `vacaciones`, `currentPage`, `totalPages`, `onPageChange`, `onDelete`, `loading?`
- **Columnas:** Fecha Inicio, Fecha Fin, Días Hábiles, Estado (`StatusBadge`), Acciones
- **Acciones:** Cancelar (solo si `PENDIENTE`)

### `SolicitudesPendientesTable` (Organism)
- **Props:** `solicitudes`, `currentPage`, `totalPages`, `onPageChange`, `onApprove`, `onReject`, `loading?`
- **Columnas:** Empleado, Fecha Inicio, Fecha Fin, Días, Saldo Disponible, Acciones
- **Acciones:** Aprobar (`CheckCircle`, verde), Rechazar (`XCircle`, rojo)

---

## 📄 Estructura de Pages + Wrappers

### `/vacaciones/page.tsx` (Server Component)
```typescript
// Obtener sesión y validar autenticación
// Llamar getSaldoVacaciones() para el usuario actual
// Llamar getVacaciones(page: 1) para el usuario actual
// Pasar datos a VacacionesWrapper
export default async function VacacionesPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [saldo, initialData] = await Promise.all([
    getSaldoVacaciones(),
    getVacaciones(1),
  ]);

  return <VacacionesWrapper saldo={saldo} initialVacaciones={initialData} />;
}
```

### `/vacaciones/vacaciones-wrapper.tsx` (Client Component)
```typescript
// useState para: modal abierto, vacaciones, página, loading
// useActionState para createVacacion y deleteVacacion
// Funciones: handlePageChange, handleOpenModal, handleDelete
// Render: SaldoVacacionesCard, botón "+ Solicitar Vacaciones",
//         VacacionTable, VacacionModal
```

### `/vacaciones/admin/page.tsx` (Server Component)
```typescript
// Validar sesión y rol ADMIN → redirect si no cumple
// Llamar getVacaciones(page: 1, filterByStatus: 'PENDIENTE')
// Pasar datos a SolicitudesWrapper
```

### `/vacaciones/admin/solicitudes-wrapper.tsx` (Client Component)
```typescript
// useState para: solicitudes, página, loading por fila
// useActionState para updateVacacionStatus
// Funciones: handleApprove(id), handleReject(id), handlePageChange
// Render: título "Solicitudes Pendientes", SolicitudesPendientesTable
```

---

## 🧪 Flujos de Usuario

### Consultar Saldo y Historial (USER)
1. Usuario navega a `/vacaciones`
2. Ve `SaldoVacacionesCard` con días disponibles, usados y totales
3. Ve tabla con historial de solicitudes y sus estados
4. Puede cancelar solicitudes en estado `PENDIENTE`

### Crear Solicitud de Vacaciones (USER)
1. Click en "+ Solicitar Vacaciones"
2. Modal abre con campos `Fecha de Inicio` y `Fecha de Fin`
3. Al seleccionar fechas, el sistema muestra los días hábiles calculados
4. Si los días superan el saldo → alerta visible, botón "Guardar" deshabilitado
5. Si el saldo es suficiente → click "Guardar" → Server Action
6. Modal cierra, tabla actualiza, `SaldoVacacionesCard` actualiza, Alert success
7. Si error de servidor → Alert error, modal permanece abierto

### Aprobar / Rechazar Solicitud (ADMIN)
1. ADMIN navega a `/vacaciones/admin`
2. Ve tabla con todas las solicitudes en estado `PENDIENTE`
3. Cada fila muestra el saldo disponible del empleado
4. Click "Aprobar" → confirmación → Server Action → estado cambia a `APROBADA`, saldo se descuenta
5. Click "Rechazar" → confirmación → Server Action → estado cambia a `RECHAZADA`, saldo no cambia
6. Fila desaparece de la tabla de pendientes, Alert success

---

## 📋 Pasos de Implementación (Orden Recomendado)

1. ✏️ **Prisma Schema** — Verificar/agregar modelo `Vacacion` con enum `VacacionStatus`
2. ✏️ **Tipos** → `src/types/vacacion.ts`
3. ⚙️ **Server Actions** → `src/actions/vacaciones.ts`
4. 🎨 **Molecules** → `SaldoVacacionesCard`, `VacacionFormFields`, `StatusBadge` (paralelizable)
5. 🎭 **Organisms** → `VacacionModal`, `VacacionTable`, `SolicitudesPendientesTable` (requiere molecules)
6. 📄 **Page USER** → `/vacaciones/page.tsx` + `vacaciones-wrapper.tsx`
7. 📄 **Page ADMIN** → `/vacaciones/admin/page.tsx` + `solicitudes-wrapper.tsx`

Los pasos 4–7 pueden paralelizarse entre sí después de terminar tipos y actions.

---

## ✨ Beneficios del Plan

- ✅ **Máxima reutilización:** Patrones probados de Épicas 1–3
- ✅ **Separación de responsabilidades:** Ruta USER y ruta ADMIN completamente independientes
- ✅ **Cálculo automático:** Saldo siempre derivado de datos reales, nunca almacenado manualmente
- ✅ **Modularidad:** `StatusBadge` y `SaldoVacacionesCard` reutilizables en futuras épicas
- ✅ **Seguridad:** Autorización validada en Server Actions, no solo en UI
- ✅ **Escalabilidad:** Fácil agregar feriados, notificaciones o exportación después
