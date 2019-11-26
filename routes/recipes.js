const router = require('express').Router();
const axios = require('axios');
const SavedRecipe = require("../models/SavedRecipe")

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

router.get('/', async (req, res, next) => {
    const includeCount = req.query.include.split(",").length;
    const maxIngr = req.query.strict === "on" ? includeCount : "100";

    const include = req.query.include.split(",").map(el => el.trim()).join("+");
    const exclude = req.query.exclude ? req.query.exclude.split(",").map(el => el.trim()).join("+") : "";

    try {
        const response = await axios.get(`https://api.edamam.com/search`, {
            params: {
                q: include,
                app_id: appId,
                to: 30,
                app_key: appKey,
                exclude: exclude,
                ingr: maxIngr
            }
        });

        const results = [];
        
        //! Removes weird Data in Results
        response.data.hits.forEach(hit => {
            if(hit.recipe.totalNutrients["SUGAR.added"]) {
                const addedSugar = hit.recipe.totalNutrients["SUGAR.added"];
                delete hit.recipe.totalNutrients["SUGAR.added"];
                hit.recipe.totalNutrients.addedSugar = addedSugar;
            }
            results.push(hit);
        });

        res.render("recipes", {recipes: results});
    } catch (error) {
        res.send(new Error(error))
    }
});

router.post('/:recipeID/save', async (req, res, next) => {
    console.log(req.url, req.body);
    console.log(JSON.parse(req));
    try {
        const recipe = await SavedRecipe.findOne({ recipeID: req.params.recipeID });
        if(recipe && recipe.authors.includes(req.user._id)) {
            const result = SavedRecipe.updateOne({ recipeID: req.params.recipeID },  { $pull: { authors: req.user._id }})
        } else {
            const newSavedRecipe = new SavedRecipe({
                recipeID: req.params.recipeID,
                data: JSON.parse(req.body),
            });

            await newSavedRecipe.authors.addToSet({_id: req.user._id});
            await newSavedRecipe.save();

            res.send({
                saved: true,
            });
        }
    } catch (error) {
        next(error);
    } 
});

module.exports = router;
