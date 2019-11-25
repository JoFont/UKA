const router = require('express').Router();
const axios = require('axios');

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

router.get('/', async (req, res, next) => {
    const includeCount = req.query.include.split(",");
    const maxIngr = req.params.strict === "on" ? includeCount.length : "";

    console.log(maxIngr);

    const include = req.query.include.split(",").join("+");
    const exclude = req.query.exclude ? req.query.exclude.split(",").join("+") : "";

    try {
        const response = await axios.get(`https://api.edamam.com/search`, {
            params: {
                q: include,
                app_id: appId,
                app_key: appKey,
                exclude: exclude,
                // ingr: maxIngr
            }
        });
        res.render("recipes", {recipes: response.data.hits});
    } catch (error) {
        res.send(new Error(error))
    }
});

module.exports = router;