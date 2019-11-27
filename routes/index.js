const router = require('express').Router();


router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/test", (req, res, next) => {
  res.render("user/complete-profile");
});

module.exports = router;
