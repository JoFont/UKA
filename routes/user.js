const router = require('express').Router();
const routeGuard = require("../middleware/route-guard");


router.use(routeGuard());

router.get('/:id/profile', (req, res, next) => {
  res.render('user/profile');
});

router.get('/:id/complete-profile', (req, res, next) => {
  res.render('user/complete-profile');
});

router.get('/:id', (req, res, next) => {
  res.redirect(`/user/${req.user}/profile`);
});

module.exports = router;
