const router = require('express').Router();
const axios = require('axios');

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

router.get('/', async (req, res, next) => {
    const include = req.query.include;
    const q = include.split(",").join("+");

    const exclude = req.query.exclude ? req.query.exclude : "";

    try {
        const response = await axios.get(`https://api.edamam.com/search`, {
            params: {
                q: q,
                app_id: appId,
                app_key: appKey,
                exclude: exclude
            }
        });
        // res.send(response.data);
        res.render("recipes", {recipes: response.data});
    } catch {

    }

    res.render('recipes', { name: 'James Dean' });
});

module.exports = router;