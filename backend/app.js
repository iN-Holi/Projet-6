const express = require("express"); // installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement) l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler.(req, res, next) 
const mongoose = require("mongoose"); // Mongoose facilite les interactions avec la bdd MongoDB. Il nous permet de valider le format des données ; de gérer les relations entre les documents ; de communiquer directement avec la bdd pour la lecture et l'écriture des documents 
const path = require("path"); // path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires 
const app = express(); // constante qui appelle express 

const userRoutes = require("./routes/user"); // constante qui appelle le fichier user dans le dossier routes 
const saucesRoutes = require("./routes/sauces"); // constante qui appelle le fichier sauces dans le dossier routes 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Cross-Origin-Resource-Policy", '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect(`mongodb+srv://test:test1234@cluster0.tjtyife.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !")); // permet de connecter l'API à la bdd 


app.use(express.json()); // intercepte les requetes qui contiennent du json et le met a dispo sur l'objet sur l'ojet requete ds req.body 

app.use("/images", express.static(path.join(__dirname, "images"))); // indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images 
app.use("/api/auth", userRoutes); // "/route attendu par le front-end", userRoutes 
app.use("/api", saucesRoutes); // "/route attendu par le front-end", saucesRoutes 

module.exports = app; // export app pour y accéder depuis d'autres fichiers de notre projet 