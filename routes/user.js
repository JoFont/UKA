const router = require('express').Router();
const routeGuard = require("./../middleware/route-guard");


router.get('/:id/profile', routeGuard, (req, res, next) => {
  // router.use(routeGuard());
  res.render('user/profile');
});

router.get('/:id/complete-profile', (req, res, next) => {
  res.render('user/complete-profile');
});

router.get('/:id', (req, res, next) => {
  res.redirect(`/user/${req.user}/profile`);
});

module.exports = router;
