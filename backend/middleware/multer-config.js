const multer = require('multer'); /* package permettant de gérer les fichiers entrants */
const fs = require('fs'); /* package qui fournit des fonctionnalités très utiles pour accéder et interagir avec le système de fichiers */

const MIME_TYPES = { /* dictionnaire des extensions de fichiers entrants */
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

module.exports = multer({ storage }).single('image'); /* export la méthode multer à laquelle on passe notre objet storage avec la méthode single (unique) avec 'image' pour expliquer qu'il s'agit de fichiers image uniquement */
