# Plan: Implementación de Épica 3 - Gestión de Novedades

**TL;DR:** Implementar un sistema completo de registro y visualización de Novedades (Horas Extras e Incapacidades) mediante modal reutilizable, tabla paginada y Server Actions. ADMINs pueden crear para otros empleados. Permitir edición/eliminación. Reutilizar patrones de Épicas 1-2.

---

## 🎯 Decisiones Confirmadas

| Aspecto | Decisión |
|--------|----------|
| **Interfaz** | Modal emergente (consistente con RoleSelector) |
| **Permisos ADMINs** | Pueden crear para sí mismos y otros empleados |
| **Edición/Eliminación** | ✅ Ambas permitidas |
| **Límites** | Sin restricciones específicas de horas |
| **Visibilidad** | USER: solo su historial \| ADMIN: su historial + filtro por empleado |

---

## 📁 5 Fases (Secuencial con Paralelismo)

### **Fase 1: Infraestructura** *(Bloqueante)*
Crear tipos e interfaces + Server Actions base. Sin esto, nada del UI compila.

1. `src/types/novedad.ts` — Interfaces: NovedadListItem, CreateNovedadPayload, GetNovedadesResponse
2. `src/actions/novedades.ts` — 4 Server Actions:
   - `getNovedades(page, userId?, filterByType?)` - con auth + authorization
   - `createNovedad(...)` - validar datos, crear registro
   - `updateNovedad(...)` - solo propietario/ADMIN
   - `deleteNovedad(...)` - solo propietario/ADMIN

---

### **Fase 2: Componentes UI** *(Parallelizable después de Fase 1)*

3. `src/components/molecules/NovedadTypeSelector/` — Select de tipo con patrón RoleSelector
4. `src/components/molecules/NovedadFormFields/` — Formulario dinámico que muestra campos según tipo (HORA_EXTRA: horas \| INCAPACIDAD: endDate)
5. `src/components/molecules/EmployeeSelector/` — Select de empleados (solo visible/habilitado para ADMINs)

---

### **Fase 3: Componentes Complejos** *(Después de Fase 2)*

6. `src/components/organisms/NovedadModal/` — Modal que integra FormFields + botones + alerts
7. `src/components/organisms/NovedadTable/` — Tabla paginada (columnas: Fecha, Tipo, Duración/Fechas, Motivo, Acciones)

---

### **Fase 4: Integración Page + Wrapper** *(Después de Fases 2-3)*

8. `src/app/(app)/novedades/page.tsx` — Server Component: fetch datos iniciales, renderizar wrapper
9. `src/app/(app)/novedades/novedades-wrapper.tsx` — Client Component: estado local, manejo de modal, Server Actions

---

### **Fase 5: Refinamiento (Opcional)**
- Filtro de empleado para ADMINs en la UI
- Validaciones adicionales en cliente
- Optimizaciones de performance

---

## 📂 Estructura de Archivos a Crear

```
src/
├── actions/
│   └── novedades.ts                    [8-10 KB]
├── components/
│   ├── molecules/
│   │   ├── NovedadTypeSelector/index.tsx
│   │   ├── NovedadFormFields/index.tsx
│   │   └── EmployeeSelector/index.tsx
│   └── organisms/
│       ├── NovedadModal/index.tsx
│       └── NovedadTable/index.tsx
├── types/
│   └── novedad.ts                      [3-5 KB]
└── app/(app)/novedades/
    ├── page.tsx                        [Implementar]
    └── novedades-wrapper.tsx           [Crear]
```

**Total de archivos nuevos:** 9 componentes + 2 actions + 1 types = **12 archivos**

---

## 🔄 Reutilización Máxima

| Patrón | De Épica 2 | Aplicación |
|--------|-----------|-----------|
| **Server Actions** | `empleados.ts` | Estructura auth → validation → BD |
| **Client Wrapper** | `UserTableWrapper` | useActionState + router.push + state management |
| **Modal Pattern** | `RoleSelector` | Modal abierto/cerrado + onConfirm callback |
| **Tabla** | `UserTable` | Columnas dinámicas, paginación, acciones |
| **Componentes Atom** | Button, Input, Alert, Select, Label | Reutilizar directamente |

---

## ✅ Validaciones Implementadas

### Server-side
- ✅ Autenticación (session.user.id)
- ✅ Autorización (propietario o ADMIN)
- ✅ Datos válidos (startDate ≤ endDate, hours > 0, type válido)
- ✅ Unicidad/Integridad (usuario existe)

### Client-side
- ✅ Campos obligatorios
- ✅ Formatos de fecha
- ✅ Feedback visual en formulario

---

## 🔍 Verificación Final

| Paso | Verificar |
|------|-----------|
| **Fase 1** | TypeScript compila; schema Prisma actualizado |
| **Fases 2-3** | Componentes renderizan sin errores |
| **Fase 4** | USER crea novedad para sí mismo ✅ |
| **Fase 4** | ADMIN crea para otro empleado ✅ |
| **Fase 4** | Historial se carga y pagina correctamente ✅ |
| **Fase 4** | Editar + Eliminar funcionan con confirmación ✅ |
| **Fase 4** | Filtro ADMIN para empleado funciona ✅ |

---

## 📌 Notas Importantes

1. **Dates**: Usa `date-fns` (ya en dependencies) para formatting y validaciones
2. **Paginación**: Mantén PAGE_SIZE = 10 (consistencia)
3. **Icons**: Lucide React para iconos de tipos (⏱ HORA_EXTRA, 🏥 INCAPACIDAD)
4. **Responsive**: DaisyUI maneja mobile; tabla con scroll-x en móvil
5. **Accesibilidad**: Modal con role="dialog", buttons con aria-labels

---

## 📋 Pasos de Implementación (Orden Recomendado)

1. ✏️ **Tipos** → `src/types/novedad.ts`
2. ⚙️ **Server Actions** → `src/actions/novedades.ts`
3. 🎨 **Molecules** → TypeSelector, FormFields, EmployeeSelector (parallelizable)
4. 🎭 **Modal** → NovedadModal (requiere molecules)
5. 📊 **Tabla** → NovedadTable
6. 📄 **Page** → `/novedades/page.tsx`
7. 🔌 **Wrapper** → `/novedades/novedades-wrapper.tsx`

*Las acciones 3-7 pueden paralelizarse después de terminar tipos y actions.*

---

## 🧪 Flujos de Usuario

### Crear Novedad (USER)
1. Click en "+ Crear Novedad"
2. Modal abre con EmployeeSelector deshabilitado (su propio ID)
3. Selecciona tipo (HORA_EXTRA \| INCAPACIDAD)
4. Completa formulario dinámico
5. Click "Guardar" → Server Action
6. Modal cierra, tabla actualiza, show Alert success
7. Si error → Alert error, modal permanece abierto

### Crear Novedad (ADMIN para Otro Empleado)
1. Igual a arriba, pero:
2. EmployeeSelector habilitado
3. Selecciona empleado objetivo
4. Resto idéntico

### Editar Novedad
1. Click en ícono "Editar" en tabla
2. Modal abre con datos rellenos
3. Modifica campos
4. Click "Actualizar" → Server Action
5. Tabla actualiza, Alert success

### Eliminar Novedad
1. Click en ícono "Eliminar" en tabla
2. Modal de confirmación simple (Alert con botones)
3. Si confirma → Server Action
4. Tabla actualiza, Alert success

---

## 📝 Detalles de Tipos (src/types/novedad.ts)

```typescript
import { NovedadType } from "@/generated/prisma/client";

export interface NovedadListItem {
  id: string;
  type: NovedadType;
  startDate: Date;
  endDate: Date | null;
  hours: number | null;
  reason: string;
  createdAt: Date;
  userId: string;
  userName: string; // nombre del usuario que registró
}

export interface CreateNovedadPayload {
  type: NovedadType;
  startDate: Date;
  endDate?: Date;
  hours?: number;
  reason: string;
  targetUserId?: string; // para crear en nombre de otro (solo ADMIN)
}

export interface UpdateNovedadPayload {
  id: string;
  type: NovedadType;
  startDate: Date;
  endDate?: Date;
  hours?: number;
  reason: string;
}

export interface GetNovedadesResponse {
  novedades: NovedadListItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface CreateNovedadResponse {
  success: boolean;
  error?: string;
  novedad?: NovedadListItem;
}

export interface UpdateNovedadResponse {
  success: boolean;
  error?: string;
  novedad?: NovedadListItem;
}

export interface DeleteNovedadResponse {
  success: boolean;
  error?: string;
}
```

---

## 📝 Estructura de Server Actions (src/actions/novedades.ts)

```typescript
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NovedadType } from "@/generated/prisma/client";
import { ROLES } from "@/constants/roles";
import type {
  NovedadListItem,
  GetNovedadesResponse,
  CreateNovedadResponse,
  UpdateNovedadResponse,
  DeleteNovedadResponse,
} from "@/types/novedad";

const PAGE_SIZE = 10;

// getNovedades(page, userId?, filterByType?)
// createNovedad(type, startDate, endDate?, hours?, reason, targetUserId?)
// updateNovedad(id, type, startDate, endDate?, hours?, reason)
// deleteNovedad(id)
```

---

## 🎨 Estructura de Componentes

### NovedadTypeSelector (Molecule)
- Props: `currentType`, `onTypeChange`, `disabled?`
- Comportamiento: Select simple que emite el tipo seleccionado
- Reutilización: Patrón RoleSelector (sin modal, solo select)

### NovedadFormFields (Molecule)
- Props: `type`, `onSubmit`, `initialData?`, `loading?`
- Campos dinámicos según `type`:
  - HORA_EXTRA: startDate, hours, reason
  - INCAPACIDAD: startDate, endDate, reason
- Validación en cliente
- Botones: Guardar, Cancelar

### EmployeeSelector (Molecule)
- Props: `onEmployeeSelect`, `currentEmployeeId`, `disabled?`
- Visible solo para ADMINs
- Carga empleados de Server Action o props

### NovedadModal (Organism)
- Props: `isOpen`, `onClose`, `onSubmit`, `initialData?`, `targetUserId?`
- Integra: NovedadFormFields, EmployeeSelector (condicional)
- Botones: Guardar (loading), Cancelar
- Alerts: error, success

### NovedadTable (Organism)
- Props: `novedades`, `currentPage`, `totalPages`, `onPageChange`, `onEdit`, `onDelete`, `loading?`
- Columnas: Fecha Inicio, Tipo, Duración/Fechas, Motivo, Acciones
- Acciones: Editar (ícono), Eliminar (ícono)
- Paginación: Anterior/Siguiente

---

## 📄 Estructura de Page + Wrapper

### page.tsx (Server Component)
```typescript
// Obtener sesión y validar rol
// Determinar qué datos mostrar (USER: suyo | ADMIN: suyo)
// Llamar getNovedades(page: 1)
// Pasar datos a NovedadesWrapper + initial data

export default async function NovedadesPage({ searchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  
  const initialData = await getNovedades(page);
  return <NovedadesWrapper initialNovedades={initialData.novedades} ... />;
}
```

### novedades-wrapper.tsx (Client Component)
```typescript
// useActionState para Server Actions
// useState para: modal abierto, novedades, página, novedad en edición
// Funciones: handlePageChange, handleCreateOpen, handleEdit, handleDelete
// Render: Botón "+ Crear", Filtro (ADMIN), NovedadTable, NovedadModal
```

---

## ✨ Beneficios del Plan

1. ✅ **Máxima reutilización**: Patrones probados de Épica 2
2. ✅ **Modularidad**: Cada componente tiene responsabilidad única
3. ✅ **Testabilidad**: Server Actions desacopladas de UI
4. ✅ **Escalabilidad**: Fácil agregar filtros, exportación, etc. después
5. ✅ **Accesibilidad**: DaisyUI + semántica HTML
6. ✅ **Performance**: Server-side rendering + incremental updates

---

## 🚀 Próximos Pasos

1. Revisar plan con usuario
2. Proceder con Fase 1 (Tipos + Actions)
3. Feedback en paralelismo Fase 2-3
4. Testing e integración Fase 4
5. Refinamiento Fase 5 (si es necesario)
