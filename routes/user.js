const router = require('express').Router();
const routeGuard = require("./../middleware/route-guard");
const fileUploader = require("../config/file-upload");
const User = require("../models/User");
const SavedRecipe = require("../models/SavedRecipe");

// Complete Profile
router.get('/:id/complete-profile', (req, res, next) => {
  if(req.user._id == req.params.id) {
    res.render('user/complete-profile');
  } else {
    next(new Error("Oops! Se há odido algo, macho!"));
  }
});

router.post("/:id/profile-is-complete", fileUploader.single('uploaded-file'), async (req, res, next) => {
  if(req.file) {
    const splitPhotoUrl = req.file.url.split("upload");
    // Cropping the image on URL
    const photoUrl =  `${splitPhotoUrl[0]}upload/w_500,h_500,c_crop${splitPhotoUrl[1]}`;
    const result = await User.findOneAndUpdate({_id: req.params.id}, {
      displayName: req.body.displayName,
      photoUrl
    });
  } else {
    const result = await User.findOneAndUpdate({_id: req.params.id}, {
      displayName: req.body.displayName
    });
  }
  
  res.redirect("/");
});


// Routeguard
router.use(routeGuard);

router.get('/:id/profile', async (req, res, next) => {
  const savedRecipes = await SavedRecipe.find({ "authors": { "$in": [req.user._id] } });
  res.render('user/profile', {
    savedRecipes
  });
});

router.get('/:id', (req, res, next) => {
  res.redirect(`/user/${req.user}/profile`);
});


module.exports = router;
