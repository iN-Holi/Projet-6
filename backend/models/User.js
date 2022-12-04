const mongoose = require('mongoose');  // importe mongoose
const uniqueValidator = require('mongoose-unique-validator');  // rajoute le validator comme plugin a notre schema

const userSchema = mongoose.Schema({ //creation du schema
  email: { type: String, required: true, unique: true }, // unique permet d'eviter de se connecter avec plusieurs fois avec la meme adresse mail
  password: { type: String, required: true } // string chaine de caractere
});

userSchema.plugin(uniqueValidator); // on l'applique au schema avant d'en faire un modele on ne pourra pas avoir plusieurs utilisateur avec la meme adresse mail

module.exports = mongoose.model('User', userSchema); // exporter le modele