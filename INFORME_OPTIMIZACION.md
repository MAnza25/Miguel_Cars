# Informe de Optimización y Rendimiento
## Miguel Cars — Sistema de Gestión de Taller Mecánico
**Grupo CR | Ingeniería de Software | Junio 2026**

---

## 1. Descripción del Proyecto

Miguel Cars es un sistema web full-stack para la gestión de un taller mecánico. Permite administrar clientes, vehículos, órdenes de servicio, citas, facturación y usuarios con control de roles.

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 + Axios + Recharts |
| Backend | Spring Boot 4 + Java 21 + Spring Data JPA |
| Base de datos | PostgreSQL 18 |
| Comunicación | API REST (JSON) |

---

## 2. Arquitectura del Proyecto

```
Miguel_Cars/
├── frontend-miguelcars/          ← Interfaz de usuario
│   └── src/
│       ├── api/                  ← Axios centralizado (services)
│       ├── components/common/    ← Componentes reutilizables
│       ├── components/layout/    ← Layout y Sidebar
│       └── pages/                ← 8 páginas CRUD
│
└── backend-miguelcars/           ← API REST Spring Boot
    └── src/main/java/
        ├── controller/           ← Maneja peticiones HTTP
        ├── service/              ← Lógica de negocio
        ├── repository/           ← Acceso a datos (JPA)
        └── modelo/               ← Entidades de BD
```

**Flujo de comunicación:**

```
React (Axios) → GET/POST/PUT/DELETE → Spring Boot Controller
                                              ↓
                                       Service (lógica)
                                              ↓
                                    Repository (JPA/Hibernate)
                                              ↓
                                         PostgreSQL
```

---

## 3. Buenas Prácticas Implementadas ✅

### 3.1 Arquitectura por capas
Se respeta la separación estricta Controller → Service → Repository → Model, tal como lo recomienda el patrón MVC con Spring Boot. Ningún controller accede directamente al repositorio.

### 3.2 Comunicación con Axios centralizado
```javascript
// src/api/axios.js
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
```
Un único punto de configuración. Si cambia el servidor, se modifica en un solo lugar.

### 3.3 Anotaciones REST correctas
```java
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    @GetMapping        // GET    /api/clientes
    @PostMapping       // POST   /api/clientes
    @PutMapping("/{id}")  // PUT /api/clientes/{id}
    @DeleteMapping("/{id}")  // DELETE /api/clientes/{id}
}
```

### 3.4 Corrección de referencias circulares JSON
Problema detectado: `OrdenServicio` → `DetalleOrden` → `OrdenServicio` (bucle infinito).

Solución aplicada con `@JsonIgnore` y `@JsonIgnoreProperties`:
```java
@JsonIgnore
@ManyToOne
@JoinColumn(name = "id_orden")
private OrdenServicio ordenServicio;  // En DetalleOrden.java
```

### 3.5 Valores por defecto al crear registros
Bug corregido: los clientes se guardaban con `activo = null` (mostrado como Inactivo).
```java
// ClienteService.java
public Cliente guardar(Cliente cliente) {
    if (cliente.getId() == null && cliente.getActivo() == null) {
        cliente.setActivo(true);  // Siempre activo al crear
    }
    cliente.setActualizadoEn(OffsetDateTime.now());
    return clienteRepository.save(cliente);
}
```
El mismo patrón se aplicó a `VehiculoService` y `UsuarioService`.

### 3.6 CORS configurado correctamente
```java
// CorsConfig.java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
```

---

## 4. Optimización de Base de Datos

### 4.1 Índices SQL para consultas frecuentes

Según las mejores prácticas de optimización de consultas, se deben crear índices en las columnas utilizadas frecuentemente en cláusulas `WHERE`, `ORDER BY` y `GROUP BY`.

**Problema sin índices:** cada consulta hace un *full table scan* (revisa toda la tabla).

**Solución:** índices estratégicos en columnas de búsqueda frecuente.

```sql
-- Historial vehicular: buscar órdenes por placa
CREATE INDEX idx_ordenes_placa     ON miguel_cars.orden_servicio(placa);

-- Filtrar órdenes por estado (PENDIENTE, EN_PROCESO...)
CREATE INDEX idx_ordenes_estado    ON miguel_cars.orden_servicio(estado);

-- Órdenes de un cliente específico
CREATE INDEX idx_ordenes_cliente   ON miguel_cars.orden_servicio(id_cliente);

-- Ordenar por fecha de ingreso (historial cronológico)
CREATE INDEX idx_ordenes_fecha     ON miguel_cars.orden_servicio(fecha_ingreso DESC);

-- Agenda del día: filtrar citas por fecha
CREATE INDEX idx_citas_fecha       ON miguel_cars.citas(fecha);

-- Filtrar citas por estado
CREATE INDEX idx_citas_estado      ON miguel_cars.citas(estado);

-- Todos los vehículos de un cliente
CREATE INDEX idx_vehiculos_cliente ON miguel_cars.vehiculos(id_cliente);

-- Búsqueda de cliente por cédula
CREATE INDEX idx_clientes_cedula   ON miguel_cars.clientes(cedula);

-- Detalles de una orden específica
CREATE INDEX idx_detalle_orden     ON miguel_cars.detalle_orden(id_orden);

-- Factura asociada a una orden
CREATE INDEX idx_factura_orden     ON miguel_cars.factura(id_orden);
```

**Impacto esperado:** consultas que antes revisaban toda la tabla ahora usan el índice directamente, reduciendo el tiempo de respuesta de O(n) a O(log n).

### 4.2 Números de orden generados automáticamente
```java
// OrdenServicioService.java
private String generarNumeroOrden() {
    int anio = Year.now().getValue();
    long total = ordenServicioRepository.count() + 1;
    return String.format("ORD-%d-%04d", anio, total);
    // Resultado: ORD-2026-0001
}
```

---

## 5. Optimización del Backend

### 5.1 Paginación de resultados

**Problema:** sin paginación, una petición `GET /api/clientes` retorna TODOS los registros de la tabla. A medida que la BD crece, esto consume más memoria y aumenta el tiempo de respuesta.

**Solución:** paginación con `Pageable` de Spring Data JPA.

```java
// ClienteService.java
public Page<Cliente> listarPaginado(Pageable pageable) {
    return clienteRepository.findAll(pageable);
}

// ClienteController.java
@GetMapping
public Object listar(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false, defaultValue = "10") Integer size) {

    if (page != null) {
        // GET /api/clientes?page=0&size=10
        return clienteService.listarPaginado(PageRequest.of(page, size, Sort.by("nombre")));
    }
    // GET /api/clientes → lista completa (compatible con frontend actual)
    return clienteService.listar();
}
```

**Respuesta paginada:**
```json
{
  "content": [...],
  "totalElements": 150,
  "totalPages": 15,
  "number": 0,
  "size": 10
}
```

### 5.2 Configuración `open-in-view=false`

```properties
# application.properties
spring.jpa.open-in-view=false
```

**Por qué:** por defecto Spring Boot mantiene la sesión de Hibernate abierta durante todo el ciclo HTTP (incluyendo la fase de serialización JSON). Esto puede provocar consultas lazy inesperadas que no se ven en los logs pero consumen recursos.

**Con `false`:** la sesión se cierra al salir del Service, forzando que todas las consultas necesarias se hagan explícitamente.

### 5.3 Pool de conexiones HikariCP optimizado

HikariCP es el pool de conexiones incluido en Spring Boot. Evita abrir y cerrar una conexión a PostgreSQL en cada petición HTTP.

```properties
# Máximo 10 conexiones simultáneas abiertas
spring.datasource.hikari.maximum-pool-size=10
# Mínimo 3 conexiones siempre disponibles
spring.datasource.hikari.minimum-idle=3
# Esperar máximo 20s para obtener una conexión
spring.datasource.hikari.connection-timeout=20000
# Cerrar conexiones inactivas después de 5 minutos
spring.datasource.hikari.idle-timeout=300000
```

---

## 6. Optimización del Frontend

### 6.1 Lazy Loading — Code Splitting

**Problema:** Vite generaba un único archivo JavaScript de **721 KB** que incluía todas las páginas y librerías (incluyendo Recharts con sus gráficas). El usuario que solo necesitaba ver clientes descargaba innecesariamente el código de las gráficas del dashboard.

**Solución:** `React.lazy()` + `Suspense`

```jsx
// App.jsx — ANTES
import Dashboard    from './pages/Dashboard';
import ClientesPage from './pages/clientes/ClientesPage';
// ... todas las páginas cargadas siempre

// App.jsx — DESPUÉS
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const ClientesPage = lazy(() => import('./pages/clientes/ClientesPage'));
// ... cada página se carga solo cuando se visita

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route index element={<Dashboard />} />
    ...
  </Routes>
</Suspense>
```

**Resultado medido después del build:**

| Archivo | Tamaño | Descripción |
|---|---|---|
| `index.js` (antes) | 721 KB | Bundle único |
| `index.js` (después) | 238 KB | React + Router + layout |
| `Dashboard.js` | 404 KB | Recharts — solo al visitar /dashboard |
| `OrdenesPage.js` | 13 KB | Solo al visitar /ordenes |
| `ClientesPage.js` | 2 KB | Solo al visitar /clientes |
| `axios.js` | 42 KB | Cargado una vez |

**Reducción del bundle inicial: 721 KB → 238 KB (-67%)**

Un usuario que entra a `/clientes` nunca descarga los 404 KB de Recharts.

### 6.2 Componentes reutilizables

Se implementaron componentes genéricos que eliminan duplicación de código:

- `Table.jsx` — tabla configurable con columnas dinámicas y acciones
- `Modal.jsx` — drawer lateral con animación desde la derecha
- `FormField.jsx` — campo de formulario con soporte para input, select y textarea
- `Spinner.jsx` — indicador de carga centralizado
- `PageHeader.jsx` — cabecera de página con botón de acción

### 6.3 Proxy Vite para evitar CORS en desarrollo

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```
Las peticiones van a `/api/clientes` (ruta relativa), Vite las redirige al backend en desarrollo. En producción se apunta directamente al servidor.

---

## 7. Mejoras Futuras — Cacheo con Redis

Aunque no está implementado actualmente, Redis es la siguiente mejora recomendada para reducir la carga sobre PostgreSQL en endpoints que retornan datos que no cambian frecuentemente (catálogos, roles, etc.).

### Flujo con Redis:
```
Usuario → GET /api/clientes
              ↓
        ¿Existe en caché Redis?
         /              \
        SÍ               NO
        ↓                ↓
   Retornar          Consultar PostgreSQL
   desde Redis       → Guardar en Redis
   (~1ms)            → Retornar respuesta
```

### Implementación en Spring Boot:
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```properties
# application.properties
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.type=redis
```

```java
@Service
public class ClienteService {
    @Cacheable("clientes")  // Guarda en Redis automáticamente
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @CacheEvict("clientes") // Limpia el caché al modificar
    public Cliente guardar(Cliente cliente) { ... }
}
```

**Beneficios:**
- Reducción del tiempo de respuesta de ~50ms (BD) a ~1ms (caché)
- Menor carga sobre PostgreSQL
- Escalabilidad horizontal

---

## 8. Resumen de Optimizaciones Aplicadas

| # | Optimización | Problema que resuelve | Resultado |
|---|---|---|---|
| 1 | Índices SQL (10 índices) | Full table scan en búsquedas | O(n) → O(log n) |
| 2 | Paginación con Pageable | Retorno de todos los registros | Carga controlada por página |
| 3 | `open-in-view=false` | Consultas lazy innecesarias | Menos queries no deseadas |
| 4 | HikariCP configurado | Conexiones sin gestión de pool | Pool de 10 conexiones optimizado |
| 5 | Lazy Loading React | Bundle de 721 KB | Bundle inicial 238 KB (-67%) |
| 6 | `@JsonIgnore` en ciclos | Error 500 por referencias circulares | APIs estables y funcionales |
| 7 | `activo=true` por defecto | Registros creados como Inactivos | Bug corregido en 3 services |
| 8 | Componentes reutilizables | Duplicación de código en páginas | 5 componentes compartidos |

---

## 9. Herramientas de Build y Configuración

| Herramienta | Rol | Equivalente en el documento |
|---|---|---|
| Vite 8 | Bundler + dev server + code splitting | Webpack / Parcel |
| Maven (mvnw) | Gestión de dependencias Java | pom.xml |
| HikariCP | Pool de conexiones BD | Configuración de servidor |
| `EXPLAIN` (PostgreSQL) | Analizar planes de ejecución | EXPLAIN / profiling tools |

---

*Documento generado para la asignatura Ingeniería de Software — Grupo CR — Universidad de Pamplona*
*Miguel Cars © 2026*
