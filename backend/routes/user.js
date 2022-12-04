const express = require('express'); // importer express  (constante qui appelle express)
const router = express.Router(); // la fonction creer un nouvo objet router (utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés)

const userCtrl = require('../controllers/user'); // controleur pour associer les fonction au differentes routes (constante qui appelle le fichier user dans le dossier controllers)

router.post('/signup', userCtrl.signup); // 1er route methode sign up (route qui appelle en méthode POST le middleware "signup" du fichier user dans dossier controllers et l'envoie sur /signup)
router.post('/login', userCtrl.login); // 2eme route methode login (route qui appelle en méthode POST le middleware "login" du fichier user dans dossier controllers et l'envoie sur /signup)

module.exports = router; // exporter le router (export des routes)