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
        // res.send(response.data);
        res.render("recipes", {recipes: response.data.hits});
    } catch (error) {
        res.send(new Error(error))
    }
});

router.post('/:id/:data/save', (req, res, next) => {
    res.send({ id, data });
})

module.exports = router;
