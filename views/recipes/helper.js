const hbs = require('hbs');

hbs.registerHelper("getURL", function(data) {
  const id = data.uri.split('recipe_')[1];
  const dataStr = JSON.stringify(data);
  return `/${id}/${dataStr}/save`;
})