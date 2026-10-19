# AdoptMe: Programación Backend III

Proyecto del curso Programación Backend III (diplomatura, Coderhouse), basado en el proyecto AdoptMe que da el curso.

## Pre-entrega N°1: Mocking

Se agrega el router `mocks.router.js` en la ruta base `/api/mocks`, con un módulo de mocking que genera usuarios y mascotas con [Faker](https://fakerjs.dev/).

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/mocks/mockingpets` | Genera mascotas de prueba (100 por defecto, `?quantity=N` para otra cantidad). Se movió a este router. |
| GET | `/api/mocks/mockingusers` | Genera 50 usuarios de prueba (`?quantity=N` para otra cantidad). |
| POST | `/api/mocks/generateData` | Genera e **inserta en la base de datos** la cantidad indicada en `users` y `pets`. |

`/mockingpets` y `/mockingusers` solo devuelven los datos generados, sin guardarlos. `/generateData` es el único que los inserta en la base.

### Módulo de mocking (`src/utils/mocking.js`)

- `generateUsers(n)` genera `n` usuarios con:
  - `password`: la contraseña `coder123` encriptada con bcrypt.
  - `role`: `user` o `admin` al azar.
  - `pets`: un array vacío.
- `generatePets(n)` genera `n` mascotas sin adoptar (`adopted: false`).

Los documentos tienen el mismo formato que devuelve Mongo (`_id`, campos del modelo y `__v`). Por ejemplo, un usuario generado:

```json
{
  "_id": "6ad69a9a4abecd65e3eda40f",
  "first_name": "Carlota",
  "last_name": "Galván Alvarado",
  "email": "carlota_galvanalvarado78@hotmail.com",
  "password": "$2b$10$5fHjuqN65v.zb9TIoHP/TOY3gqmM4vGHtyfeS750PjHv8.QKFrno.",
  "role": "user",
  "pets": [],
  "__v": 0
}
```

### Estructura agregada

```
src/
├── controllers/mocks.controller.js   # lógica de los 3 endpoints
├── routes/mocks.router.js            # router /api/mocks
└── utils/mocking.js                  # módulo de mocking (Faker + bcrypt)
```

Además, se agregó `createMany` al `GenericRepository` y `saveMany` (`insertMany`) a los DAO para insertar en lote.

## Instalación

Requisitos: Node.js 18 o superior y una base MongoDB (local o Atlas).

```bash
npm install
cp .env.example .env   # completar MONGO_URL
npm start              # o npm run dev
```

Variables de entorno (`.env`):

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (por defecto `8080`). |
| `MONGO_URL` | URL de conexión a MongoDB. |

## Cómo probarlo

```bash
# 100 mascotas de prueba (o ?quantity=10)
curl http://localhost:8080/api/mocks/mockingpets

# 50 usuarios de prueba
curl http://localhost:8080/api/mocks/mockingusers

# Generar e insertar 10 usuarios y 25 mascotas
curl -X POST http://localhost:8080/api/mocks/generateData \
  -H "Content-Type: application/json" \
  -d '{"users": 10, "pets": 25}'
# {"status":"success","message":"10 users and 25 pets inserted","payload":{"users":10,"pets":25}}

# Comprobar los registros insertados con los GET de users y pets
curl http://localhost:8080/api/users
curl http://localhost:8080/api/pets
```

`/generateData` también acepta los parámetros por query (`?users=10&pets=25`). Cada cantidad debe ser un entero entre 0 y 10000, y al menos una tiene que ser mayor a 0; si no, responde `400`.

Los usuarios insertados pueden iniciar sesión con su email y la contraseña `coder123` en `POST /api/sessions/login`.
