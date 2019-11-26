// window.addEventListener('load', () => {
//   console.log('Ironmaker app started successfully!');
// }, false);

document.addEventListener('click', e => {
    console.log('HELLO!');
    if (e.target.classList.includes('recipe-bookmark')) {
        const uri = e.target.dataset.recipeUri;
        const data = e.target.dataset.recipeData;
        axios.post(`/recipes/${uri}/save`, { data })
    }
})