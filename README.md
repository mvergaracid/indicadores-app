### IndicadoresApp

Esta App (Angular 17) permite consultar los indicadores económicos de acuerdo a los siguientes rangos de fecha:

### Forma de Uso:

1. Construir imagen docker:
   docker build -t indicadores-app .

2. Ejecutar:

   docker-compose up

En el archivo docker-compose.yml, debes cambiar la API_KEY, que la puedes obtener desde la CMF API

Una vez que el container se encuentre corriendo, ve a la dirección:

http://localhost:4000

, para acceder a la aplicación

### Para correr los test unitarios:

npm run test

Eso es todo!

Si tienes comentarios, escribeme a: mvergaracid@gmail.com o llámame al +56 9 2608 0216
