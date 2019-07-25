const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const result = [];

  await Products.find(
    { $text: { $search : ctx.request.query.query } },
    { score: { $meta: 'textScore' } },
  ).sort({ score: { $meta: 'textScore' } })
    .then(async (searchResult) => {
    await searchResult.map((product) => {
      result.push({
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description
      });
    });
  });
  ctx.body = {products: result};
};
