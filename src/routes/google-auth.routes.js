import express from 'express';
import passport from 'passport';
import session from 'express-session';
import googleAuth from '../controllers/google-auth-controller';
import googleFailure from '../controllers/google-auth-controller';
import googleProtected from '../controllers/google-auth-controller';
import 'dotenv/config';
// eslint-disable-next-line import/no-duplicates
import logout from '../controllers/google-auth-controller';

const router = express.Router();

const isLoggedIn = ({ user }, res, next) =>
  user ? next() : res.sendStatus(401);
router.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get('/', googleAuth.initialize);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);
router.get('/auth/failure', googleFailure.googleFailure);
router.get('/protected', isLoggedIn, googleProtected.googleProtected);
router.get('/logout', logout.logout);
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication with Google
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Initialize authentication
 *     tags: [Authentication]
 *     description: Redirects the user to the Google authentication page
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google authentication flow
 *     tags: [Authentication]
 *     description: Redirects the user to the Google authentication page
 *     responses:
 *       302:
 *         description: Found
 */
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Handle Google authentication callback
 *     tags: [Authentication]
 *     description: |
 *       Handles the Google authentication callback and redirects the user
 *       to either the protected page on success or the failure page on failure.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The authorization code returned by Google
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: Handle Google authentication failure
 *     tags: [Authentication]
 *     description: Renders an error page when Google authentication fails
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected page
 *     tags: [Authentication]
 *     description: Renders the protected page if the user is authenticated
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     session:
 *       type: apiKey
 *       name: sessionid
 *       in: cookie
 */

/**
 * @swagger
 * /:
 *   get:
 *     security: []
 *     summary: Check API status
 *     tags: [Health Check]
 *     description: Returns the API status
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (req, res) => {
  res.send('API is running!');
});

export default router;
