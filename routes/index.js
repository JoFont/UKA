const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/test", (req, res, next) => {
  res.render("auth/verify-email");
});

module.exports = router;
