# Finto

App móvil de finanzas personales para registrar ingresos y gastos, clasificarlos por categoría y ver resúmenes semanales y mensuales con gráficas.

## Funciones

- Registro con verificación de correo, inicio de sesión y recuperación de contraseña por código
- Ingresos y gastos con categoría, nota, fecha y factura (pendiente / realizada)
- Registrar varios movimientos a la vez
- Resúmenes semanales y mensuales: balance, comparación con el periodo anterior, gráfica de barras y de dona por categoría
- Perfil: cambiar contraseña, restablecer datos, cerrar sesión y eliminar cuenta

## Estructura

```
finto/
├── App.js, src/   App móvil (Expo / React Native)
└── server/        API (Node.js, Express, MongoDB)
```

## Cómo correrlo

Requisitos: Node.js y la app Expo Go (o un simulador).

1. Instalar dependencias

   ```bash
   npm install
   npm run server:install
   ```

2. Configurar la API: copiar `server/.env.example` como `server/.env` y llenar los valores (MongoDB, JWT y correo).

3. Arrancar (en dos terminales)

   ```bash
   npm run server   # API en el puerto 4000
   npm start        # App con Expo
   ```

El celular y la computadora deben estar en la misma red Wi-Fi; la app encuentra la API automáticamente. Para una API publicada, definir `EXPO_PUBLIC_API_URL`.
