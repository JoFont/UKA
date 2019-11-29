'use strict'

const router = require('express').Router();
const axios = require('axios');
const SavedRecipe = require("../models/SavedRecipe");
const Comment = require("../models/PublicComment");
const PrivateNote = require("../models/PrivateNote");

const appId = process.env.EDAMAM_APP_ID;
const appKey = process.env.EDAMAM_APP_KEY;

router.get('/', async (req, res, next) => {
    // console.log(req.query);
    const includeCount = req.query.include.split(",").length;
    
    // Max ingredients
    let max;
    if (req.query.maxI) {
        max = `req.query.max`;
    } else {
        max = "100";
    }
    const maxIngr = req.query.strict === "on" ? includeCount : max;

    const include = req.query.include.split(",").map(el => el.trim()).join("+");
    const exclude = req.query.exclude ? req.query.exclude.split(",").map(el => el.trim()).join("+") : "";

    // Cuisine Type
    let cuisineTypeReq = [];
    switch (typeof req.query.cuisineType) {
      case 'string':
        cuisineTypeReq.push(req.query.cuisineType);
        break;
      case 'object':
        cuisineTypeReq = req.query.cuisineType;
        break;
    }

    // Dietary restrictions
    let restrictions = [];
    switch (typeof req.query.restrictions) {
    case 'string':
      restrictions.push(req.query.restrictions);
      break;
    case 'object':
      restrictions = req.query.restrictions;
      break;
    }

    // console.log('Includes: ', req.query.include);
    
    try {
        const response = await axios.get(`https://api.edamam.com/search`, {
            params: {
              q: include,
              app_id: appId,
              to: 30,
              app_key: appKey,
              exclude: exclude,
              ingr: maxIngr,
              cuisineType: cuisineTypeReq,
              health: restrictions
            }
        });

        const results = [];
        
        //! Formats Data
        // This checkes if there are saved results in the DB

        // TODO: ADD AMOUNT OF SAVES
        // const savedRecipes = req.user ? await SavedRecipe.find({ "authors": { "$in": [req.user._id] } }) : [];

        const savedRecipes = await SavedRecipe.find();

        response.data.hits.forEach(hit => {
            hit.recipe.count = 0;
            
            if(hit.recipe.totalNutrients["SUGAR.added"]) {
                const addedSugar = hit.recipe.totalNutrients["SUGAR.added"];
                delete hit.recipe.totalNutrients["SUGAR.added"];
                hit.recipe.totalNutrients.addedSugar = addedSugar;
            }

            // This Iterates over The saved items and adds state to response
            if(savedRecipes.length) {
                savedRecipes.forEach(item => {
                    // console.log(item);
                    if(req.user) {
                        if(hit.recipe.uri.split("recipe_")[1] === item.recipeID && item.authors.includes(req.user._id)) {
                            hit.recipe.isSaved = true;
                        }

                        if(hit.recipe.uri.split("recipe_")[1] === item.recipeID) {
                            hit.recipe.count = item.count;
                        }
                    } else if(hit.recipe.uri.split("recipe_")[1] === item.recipeID) {
                        hit.recipe.count = item.count
                    }
                    
                });
            } else {
                hit.recipe.isSaved = false;
            }

            results.push(hit);
        });

        res.render("recipes", {recipes: results, includes: req.query.include});
    } catch (error) {
        res.send(new Error(error))
    }
});

router.get('/:recipeID', async (req, res, next) => {
  // const recipe = await (req.params.recipeID);
//   console.dir('Req body: ', req.body.data);
    // const cenas = await JSON.parse(req.body.data);
    
    // console.log(data);
    const url = `https://api.edamam.com/search?app_id=592e2c63&app_key=44387e1901b8028e1c591ac1dd9da636&r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_${req.params.recipeID}`;

    const response = await axios.get(url);
    const data = response.data[0];

    // Remove empty fields
    // Portions 
    if (data.yield === 0) {
        delete data.yield;
    }
    // Time
    if (data.totalTime === 0) {
        delete data.totalTime;
    }

    let comments = await Comment.find({ recipe: req.params.recipeID }).populate("author");

    let notes = [];

    if(req.user) {
        notes = await PrivateNote.find({ recipe: req.params.recipeID, author: req.user._id }).populate("author");
        if(notes === null) notes = [];
    } 

    if(comments === null) {
        comments = []
    }
    let isSaved = false;
    isSaved = await SavedRecipe.findOne({ recipeID: req.params.recipeID, authors : { $in: req.user._id }})

    data.isSaved = isSaved;
    res.render('recipe-single', { recipe: data, comments: comments, notes: notes});
});

router.post('/:recipeID/save', async (req, res, next) => {
    try {
        const recipe = await SavedRecipe.findOne({ recipeID: req.params.recipeID });

        if(recipe && recipe.authors.includes(req.user._id)) {
            const result = await SavedRecipe.updateOne({ recipeID: req.params.recipeID }, { $pull: { authors: req.user._id }, $inc: { count: -1}});
            if(result) res.send({ status: 200, saved: false });
        } else if (recipe && !recipe.authors.includes(req.user._id)) {
            const result = await SavedRecipe.updateOne({ recipeID: req.params.recipeID },  { $push: { authors: req.user._id }, $inc: { count: 1}});
            if(result) res.send({ status: 200, saved: true });
        } else {
            const newSavedRecipe = new SavedRecipe({
                recipeID: req.params.recipeID,
                data: JSON.parse(req.body.data),
                count: 1
            });

            await newSavedRecipe.authors.addToSet({_id: req.user._id});
            await newSavedRecipe.save();

            res.send({ status: 200, saved: true });
        }
    } catch (error) {
        next(error);
    } 
});


router.post('/:recipeID/comment/new', async (req, res, next) => {
    try {
        const comment = await Comment.create({
            author: req.user._id,
            recipe: req.params.recipeID,
            body: req.body.data.body
        })

        const newComment = await Comment.findOne({ _id: comment._id}).populate("author");

        res.send({
            status: 200,
            newComment
        });
        
    } catch (error) {
        next(error);
    } 
});

router.post('/:recipeID/private-note/new', async (req, res, next) => {
    try {
        const note = await PrivateNote.create({
            author: req.user._id,
            recipe: req.params.recipeID,
            body: req.body.data.body
        })

        const newNote = await PrivateNote.findOne({ _id: note._id}).populate("author");

        res.send({
            status: 200,
            newNote
        });
        
    } catch (error) {
        next(error);
    } 
});

module.exports = router;
