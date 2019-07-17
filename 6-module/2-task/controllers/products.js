const Products = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subCategoryName = ctx.request.query.subcategory;
  // console.log(subCategoryName);
  let result = [];
  await Products.find({
    subcategory: subCategoryName,
  }).then((productsList) => {
    if (!productsList) console.log(false);
    result = productsList.map((product) => {
      return {
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description,
      };
    });
  }).catch((error) => {
    result = [];
  });

  ctx.body = { products: result };
};

module.exports.productList = async function productList(ctx, next) {
  console.log(ctx.request.query);
  ctx.body = { products: [] };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  const result = {};

  if (!mongoose.Types.ObjectId.isValid(productId)) ctx.throw(400, 'incorrect id');

  await Products.findOne({
    _id: productId,
  }).then((product) => {
    result.id = product._id;
    result.title = product.title;
    result.images = product.images;
    result.category = product.category;
    result.subcategory = product.subcategory;
    result.price = product.price;
    result.desciption = product.description;
  }).catch((error) => {
    ctx.throw(404, `Error code ${error.code}`);
  });
  ctx.body = { product: result };
};

