            ===================== Guide d’installation et de lancement du projet ==============================

Étape 1 : Placez-vous dans le dossier où vous souhaitez cloner le projet. Faites un clic droit, ouvrez Git Bash, puis exécutez la commande suivante :
git clone https://github.com/malick521/RIMCore.git

Étape 2 : Une fois le clonage terminé, ouvrez le projet dans Visual Studio Code :
code .

Étape 3 : Dans le terminal de VS Code, accédez au dossier frontend et installez les dépendances :
cd frontend
npm install

Étape 4 : Toujours dans le dossier frontend, lancez le serveur de développement :
npm run dev

Étape 5 : Ouvrez un nouveau terminal dans VS Code, accédez au dossier backend et démarrez le serveur PHP :
cd backend
php -S localhost:8000

Étape 6 : Vérifiez que la base de données partagée a bien été importée et que XAMPP ou WAMP est démarré.

Étape 7 : Ouvrez votre navigateur et accédez à l’adresse suivante :
http://localhost:3000
