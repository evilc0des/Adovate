const firebaseAdmin = require('firebase-admin');

module.exports = async (req, res, next) => {
  const idToken = req.headers.authorization.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).send('Authorization token missing');
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken;  // Attach user info to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).send('Unauthorized');
  }
};
