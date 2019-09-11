# webfauna-app-basic
Ce projet contient une version allégée de l'application de saisie de données webfauna d'info fauna (Centre suisse de cartographie de la faune).

L'application webfauna est disponible sur iOS (https://apps.apple.com/ch/app/webfauna/id882688741?l=fr) et android (https://play.google.com/store/apps/details?id=ch.leafit.webfauna&hl=fr_CH).

Le code est mis à disposition gratuitement sous licence MIT. Vous pouvez faire plus ou moins ce que vous voulez avec.

La mise à disposition et la documentation du code est en cours (septembre 2019). Jusqu'à que ce soit complet, il est possible que le code ne fonctionne pas correctement.

L'application utilise une API pour intéragir avec notre serveur de données. Ces accés ne sont pas publics et nécessitent un compte (https://webfauna.cscf.ch). L'API sera sommairement décrite pour permettre la mise en place d'une structure similaire.  

Pour créer une version utilisable sur un téléphone (par exemple android) :
```
npm install
ionic cordova run android --prod
```
A noter que pour que tout fonctionne, vous devez installer un environnement android / iOS sur votre ordinateur. Vous trouverez d'innombrables ressources dans ce sens sur Internet.

## API
La description pour les accès à l'API sont disponibles à l'adresse https://webfauna-api.cscf.ch/swagger/index.html#/.
