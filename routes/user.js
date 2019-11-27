const router = require('express').Router();
const routeGuard = require("./../middleware/route-guard");
const fileUploader = require("../config/file-upload");
const User = require("../models/User");

// Complete Profile
// FIXME: ZÉ, AJUDA, NÃO TENHO REQ.USER NO SITIO CERTO
router.get('/:id/complete-profile', (req, res, next) => {
  console.log(req.session.user, req.params.id);
  if(req.user._id === req.params.id) {
    res.render('user/complete-profile');
  } else {
    next(new Error("Oops!"));
  }
});

router.post("/:id/profile-is-complete", fileUploader.single('uploaded-file'), async (req, res, next) => {
  const photoUrl = req.file.url;
  const result = await User.findOneAndUpdate({_id: req.params.id}, {
    displayName: req.body.displayName,
    photoUrl
  });
  
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
