// eslint-disable-next-line import/no-import-module-exports
import 'dotenv/config';

const initialize = async (req, res) => {
  res.status(200).send('<a href="/auth/google">Authenticate with Google</a>');
};
const googleFailure = async (req, res) => {
  res.send('Something went wrong');
};
const googleProtected = async (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<h2>You have sucessful logged in</h2></h2><button onclick="logout()">Logout</button>
<script>
  function logout() {
    fetch('/logout', { method: 'GET' })
      .then(response => {
        if (response.redirected) {
          window.location.href = '/';
        }
      })
      .catch(error => console.error(error));
  }
</script>
</body>
</html>`);
};

const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

module.exports = {
  initialize,
  googleFailure,
  googleProtected,
  logout,
};
