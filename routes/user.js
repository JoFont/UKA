const router = require('express').Router();
const routeGuard = require("./../middleware/route-guard");


// Complete Profile
router.get('/:id/complete-profile', (req, res, next) => {
  if(req.user._id === req.params.id) {
    res.render('user/complete-profile');
  } else {
    next(new Error("Oops!"));
  }
});

router.get("/:id/profiile-is-complete", (req, res, next) => {
  res.redirect("/");
});

// Routeguard
router.use(routeGuard);

router.get('/:id/profile', (req, res, next) => {
  res.render('user/profile');
});

router.get('/:id', (req, res, next) => {
  res.redirect(`/user/${req.user}/profile`);
});


module.exports = router;
