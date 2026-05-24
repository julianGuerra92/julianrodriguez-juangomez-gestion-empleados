# Plan: Épica 5 - Dashboard y Seguimiento

**TL;DR:** Desarrollar un dashboard administrativo con gráficas interactivas de horas extras (BarChart mensual) e incapacidades (PieChart de proporción) usando `recharts`. Los ADMINs filtrarán por empleado/fechas para analizar patrones. Se crearán 3 componentes organisms gráficas + 1 molecule de filtros + 2 Server Actions + tipos dashboard.

---

## 📐 Steps (Agrupado en 4 Fases)

### **Fase 1: Infraestructura (Types + Server Actions)**
1. `src/types/dashboard.ts` — Nuevos tipos:
   - `DashboardStats` (totalHorasExtras, totalDiasIncapacidad, comparativaHorasVsIncapacidad[], yearsRange)
   - `DashboardFilter` (employeeId?, startDate?, endDate?)
   - `HorasExtrasByMonth` (mes, año, horas)
   - `IncapacidadPorTipo` (tipo, dias, porcentaje)

2. `src/actions/dashboard.ts` — 3 Server Actions con validación ADMIN:
   - `getDashboardStats(filter?)` — Calcula totales y comparativas
   - `getHorasExtrasByMonth(filter?)` — Datos para BarChart (últimos 12 meses)
   - `getIncapacidadDistribution(filter?)` — Datos para PieChart (Horas vs Incapacidades)

### **Fase 2: Molecules (Filtros)**
3. `src/components/molecules/DashboardFilter/index.tsx` — Client Component:
   - Selector de empleado (reutilizando lógica de EmployeeSelector)
   - Inputs fecha inicio/fin con validaciones
   - Botón "Aplicar filtro" + resetear

### **Fase 3: Organisms (Gráficas)**
4. `src/components/organisms/BarChartHorasExtras/index.tsx` — Usa `recharts` BarChart:
   - Eje X: meses (últimos 12), Eje Y: horas
   - Responsive con containerProps
   - Props: data[], title, filtroAplicado

5. `src/components/organisms/PieChartIncapacidades/index.tsx` — Usa `recharts` PieChart:
   - Muestra proporción Horas Extras vs Incapacidades
   - Leyenda con porcentajes
   - Props: data[{ name, value }], title, filtroAplicado

6. `src/components/organisms/DashboardStatsCard/index.tsx` — Card métrica reutilizable:
   - Muestra label, valor, ícono, cambio % vs período anterior
   - Reutilizable para otras métricas futuras

### **Fase 4: Página Dashboard (Server + Wrapper)**
7. `src/app/(app)/dashboard/page.tsx` — Actualizar (Server Component):
   - Carga inicial: `getHorasExtrasByMonth()`, `getIncapacidadDistribution()`, `getDashboardStats()`
   - Valida rol ADMIN (redirige USER a /novedades)
   - Pasa datos a dashboard-wrapper

8. `src/app/(app)/dashboard/dashboard-wrapper.tsx` — Crear (Client Component):
   - Maneja estado de filtros
   - Llama Server Actions al cambiar filtro
   - Renderiza: 3 StatsCards + DashboardFilter + BarChart + PieChart
   - Estados de carga/error

---

## 📁 Relevant files

**Ya existentes (reutilizar):**
- Atoms: `Button`, `Select`, `Input`, `Label`, `Alert`
- Molecules: `EmployeeSelector`, `FormField`
- `src/lib/prisma.ts`, `src/auth.ts`, `src/constants/roles.ts`

**A crear:**
- `src/types/dashboard.ts`
- `src/actions/dashboard.ts`
- `src/components/molecules/DashboardFilter/index.tsx`
- `src/components/organisms/BarChartHorasExtras/index.tsx`
- `src/components/organisms/PieChartIncapacidades/index.tsx`
- `src/components/organisms/DashboardStatsCard/index.tsx`
- `src/app/(app)/dashboard/dashboard-wrapper.tsx`

**A actualizar:**
- `src/app/(app)/dashboard/page.tsx`

---

## ✅ Verification

**Unitarios (lógica Server Actions):**
- `getDashboardStats()` retorna sumas correctas
- `getHorasExtrasByMonth()` agrupa correctamente por mes/año
- `getIncapacidadDistribution()` calcula porcentajes correctos

**Funcionales (E2E):**
- Solo ADMINs acceden a /dashboard (USERs redirigen)
- BarChart muestra últimos 12 meses con datos correctos
- PieChart muestra proporción acertada
- Filtro por empleado actualiza ambas gráficas
- Filtro de rango de fechas actualiza ambas gráficas
- Datos vacíos → mensaje "Sin datos"
- Responsive en móvil

**Validaciones:**
- Fecha fin ≥ fecha inicio (frontend + servidor)
- Empleado seleccionado existe en BD
- Estados de carga indicados correctamente

---

## 🎯 Decisions

| Decisión | Justificación |
|---|---|
| **Recharts** | Más ligero que Chart.js, mejor con Tailwind, SVG nativo |
| **BarChart mensual** | Tendencia clara de horas/mes |
| **PieChart proporción** | Snapshot útil para decisiones rápidas |
| **Server Actions** | Lógica en servidor, datos precargados en SSR |
| **Filtro opcional** | Vista general por defecto, opción de profundizar |
| **12 meses default** | Visualiza tendencia anual completa |

---

## 🔮 Further Considerations

1. **LineChart de trending?**
   - Alternativa: Agregar gráfica de líneas con trend mes a mes
   - **Recomendación**: Diferir al MVP+1 si requieren análisis profundo

2. **Exportar datos (PDF/CSV)?**
   - Alternativa: Botón de descarga con datos del período filtrado
   - **Recomendación**: Fuera de scope actual, diferir

3. **Mostrar % cambio vs período anterior?**
   - Alternativa: En DashboardStatsCard agregar indicador "↑ 15%" vs mes anterior
   - **Recomendación**: Incluir en esta épica (simple de implementar en `getDashboardStats`)

---

## Notes for Refinement

- [ ] Confirmar periodicidad de análisis: ¿últimos 12 meses siempre o seleccionable?
- [ ] ¿Incluir % de cambio vs período anterior en DashboardStatsCard?
- [ ] ¿Mostrar "Sin datos" o gráfica vacía cuando no hay registros para el filtro?
- [ ] ¿Guardar preferencia de filtro en sesión/localStorage del usuario?
- [ ] ¿Agregar botón de "Refrescar datos" manual o solo automático al cambiar filtro?
