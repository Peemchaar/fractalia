<h1>Suite</h1>

# Comienzo

## Preparación entorno local

- Descarga el proyecto del repositorio
- Instalar desde cero los paquetes necesarios con los siguientes comandos desde la ventana cmd del VSCode
  ```js
  rm -r -fo node_modules
  del package-lock.json
  npm cache clean --force
  npm i -f
  npm audit fix
  npm audit
  ```
## Arrancar app localmente
- Ejecutar
  `ng server -o`

## Generar una build localmente para publicar manualmente a un servidor
Consultar los comandos en _package.json_, aun así los comandos son:
- DEV
  ```
  npm run build-dev
  npm run build-dev-v2
  ```
- DEMO
  ```
  npm run build-demo
  ```
- PRO
  ```
  npm run build-production
  ```
