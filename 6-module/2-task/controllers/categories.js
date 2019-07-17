const Categories = require('../models/Category');


module.exports.categoryList = async function categoryList(ctx, next) {
  let result = [];
  await Categories.find({})
      .exec()
      .then((categories) => {
        // console.log(categories);
        if (!categories) return [];
        result = categories.map((category) => {
          return {
            id: category._id,
            title: category.title,
            subcategories: [{
              id: category.subcategories[0]._id,
              title: category.subcategories[0].title,
            }],
          };
        });
      })
      .catch((error) => ctx.throw(404, 'wrong subcategory'));
  ctx.body = { categories: result };
};
