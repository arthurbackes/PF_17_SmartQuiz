Lancer le terminal et écrire les différentes commandes

npm install // installer toutes les dépendances pour faire fonctionner le projet, le fichier node_modules va s’installer  crée un fichier .env et lancer une base de donnés sur mangodb, le plus simple et d’ouvrir un cluster et d’y récupéré un lien.

Crée une égalité MONGO_URI

Voici un example :

MONGO_URI=mongodb+srv://<Pseudo>:<MOTDEPASSE>@cluster0.rpixx.mongodb.net/
 Remplacer Pseudo et MOTDEPASSE par ceux donner par mangodb

On doit également ajouter dans le fichier .env "SESSION_SECRET=MOTDEPASSE", ce mot de passe que vous choissisez est celui de la création de session

Vous pouvez maintenant lancer le projet avec la commande : npm run start  (cette commande permet de lancer tout le projet (base de données + express + tailwindcss)

Le port sera donné dans le terminal. Ainsi qu’un message disant que la base de donné est bien connecter. Si ce n’est pas le cas, c’est probablement un problème avec le .env

Lancer localhost:PORT
