import asyncHandler from 'express-async-handler';
import products from '../data/products.js';
import Product from '../models/Product.js';

//@desc Fetch all products
//@route GET /api/products
//@access Public
export const getProducts = asyncHandler(async (req, res) => {
  // Make search term case insensitive and partial search
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const products = await Product.find({ ...keyword });
  res.json(products);
});

//@desc Fetch single products
//@route GET /api/products/:id
//@access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Delete a product
//@route DELETE /api/v1/products/:id
//@access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product Removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc Create a product
//@route POST /api/v1/products
//@access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpeg',
    brand: 'Sample brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a review for a product
// @route   POST /api/v1/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find((r) => {
      console.log(r.user);
      console.log(req.user._id);
      console.log(rating);
      console.log(Number(rating));
      return r.user.toString() === req.user._id.toString();
    });
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add review to product reviews array
    product.reviews.push(review);

    // Update product reviews count
    product.numReviews = product.reviews.length;

    // Update product rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review successfully added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
