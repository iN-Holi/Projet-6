const User = require('../models/user');   // modele user (constante qui appelle le fichier user dans le dossier models)
const bcrypt = require('bcrypt');  // importe bcrypt (package de chiffrement bcrypt)
const jwt = require("jsonwebtoken"); // (package permettant de créer et vérifier les tokens d'authentification)

/* ici nous créons les middleware. 
Un middleware est un bloc de code qui traite les requêtes et réponses de votre application. Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler, le cas échéant. (req, res, next) La méthode next permet à chaque middleware de passer l'exécution au middleware suivant. */

exports.signup = (req, res, next) => { 
    bcrypt.hash(req.body.password, 10) // hasher le mdp, on appel la fontion bcrypt.hash, on lui passe le mdp du corps de la requete passer par le frontend, le salt c combien de fois on execute le l'algo de hashage plus on fait  de tour plus sa met de temps methode asynchrone donc then catch (crée un hash crypté du mdp user pour les enregistrer de manière sécurisée dans la bdd. Le 10 : demande« saler » le mdp 10 fois. (+ valeur élevée, + longue exécution, hachage + sécurisé))
      .then(hash => { // recupere le hash de mdp (on recupere le hash du mdp)
        const signupUser = new User({ // enregistrer ds un nouvo user qu on va enrregistrer ds la bdd (on crée le nouvel utilisateur avec le model mongoose)
          email: req.body.email, // (on récupère l'adresse de cet utilisateur)
          password: hash // enregistre le hash (on enregistre le hachage du mdp afin de ne pas stocker le mdp en clair)
        });
        signupUser.save()  // (on sauvegarde l'utilisateur crée)
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error })); // 500 erreur serveur
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // filtre avec un champ email  (on recherche dans la bdd l'email de l'utilisateur)
        .then(user => { 
            if (!user) { // verifie si elle est null l'utilisateur n'existe pas ds la bdd
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); // (si on le trouve pas, on renvoie une erreur) SA  PEUT ETRE UNE FUITE DE DONNEES, doit etre flou pour ne pas dire que l'utilisateur n'est pas enregistrer, ne pas pouvoir verifier si l'utlisateur est inscrit chez nous donc on rajoute mdp incorrecte
            } //else{
            bcrypt.compare(req.body.password, user.password) // compare le mdp de la bdd et celui transmis 1er ce ki est rentrer par le client, apres ce qu il y a ds le bdd (sinon on compare les hachage de mdp grâce à bcrypt)
                .then(valid => {
                    if (!valid) { // si il s'agit de false
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // (si le mdp ne correspond pas, on renvoie une erreur)
                    } // else {
                    res.status(200).json({ // (sinon on retourne un objet avec les info necessaires à l'authentification de requetes emises à l'utilisateur) retourne code 200 avec un objet qui contient les infos necessaires a l'auth des requete qui seront emise par le client  
                        userId: user._id, // l'id d'utilisateur
                        token: jwt.sign( // fontion sign de jsonwebtoken (puis la fonction sign par jsonwebtoken)
                           { userId: user._id }, // 1er argument (1er argument : l'id de l'utilisateur pour verifier que c'est bien cet user)
                           'RANDOM_TOKEN_SECRET', // 2eme argument la cle secrete de l'encodage normalement c une chaine bcp plus longue et aleatoire pour securiser l'encodage (2e argument : clé d'encodage du token (a changer lors de la mise en prod))
                           { expiresIn: '24h' }  // 3eme argument de config appliquer une expiration pour le token (3e argument : temps d'expiration du token)
                        )   
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // 500 error server
 };