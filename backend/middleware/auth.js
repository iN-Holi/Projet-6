const jwt = require('jsonwebtoken'); // importe jasonwebtoken (package permettant de créer et vérifier les tokens d'authentification)
 
module.exports = (req, res, next) => { // exporte une fonction qui sera notre middleware (on exporte une function qui sera le middleware)
   try { // recupere le token
       const token = req.headers.authorization.split(' ')[1]; // recupere le header et le split donc diviser la chaine de caractere en un tableau, ('') signifie autour de l'espace entre le mot cle bearer et le token (ds la console partie network), [1] signifie le 2eme element donc le token qu on veut recup (on sépare avec un espace le token du headers authorization, du bearer. Et on récupère le token qui est en 2eme) 
       const decodedToken = jwt.verify(token, `${process.env.KEY}`); // on doit le decoder avec la methode verify de jwt, nous lui passons le token recup et la cle secrete), en cas d'error pour decoder le token on se trouvera ds le catch (on vérifie que le token de l'utilisateur est bien le même que la clé (avec la méthode verify))
       const userId = decodedToken.userId; // recup le userid, on va ds le token decoder (on récupère le user id du token décodé)
       req.auth = { // rajouter cette valeur a l'objet request qui va etre transmis aux route qui vont etre appeler par la suite
           userId: userId // avec le champ userid
       };  // on le rajoute à l'objet request afin que les routes puissent l'exploiter
       next();
    } catch(error) {
        res.status(401).json({ error }); // res.status(401).json({ error: new Error('Invalid request!') })
    }
};