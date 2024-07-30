## Cambios que aparecieron
- El package name del builder base hubo que cambiarlo
- Los commands desde Api Gateway siempre van a ser express porque ni se pueden integrar ni tienen sentidos las step function standard + api Gateway
- Nota: Una Sfn Express no puede llamar a otra Sfn de forma síncrona
- Nota: Tampoco deberían haber variables de entorno en el Domain que apunte a un recurso de infraestructura
- La entrada de las Sfn siempre tiene un body
- Luego de setear una env es necesario hacer yarn install