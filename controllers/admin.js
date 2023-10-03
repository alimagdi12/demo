const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    userName:req.session.userName
  });
};

exports.postAddProduct = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const englishName = req.body.englishName;
  const birthDate = req.body.birthDate;
  const passportNumber = req.body.passportNumber;
  const issueDate = req.body.issueDate;
  const nationality = req.body.nationality;
  const age = req.body.age;
  const gender = req.body.gender;
  const product = new Product({
    firstName,
    lastName,
    englishName,
    birthDate,
    passportNumber,
    issueDate,
    nationality,
    age,
    gender,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        userName:req.session.userName
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const updatedFirstName = req.body.firstName;
  const updatedLastName = req.body.lastName;
  const updatedEnglishName = req.body.englishName;
  const updatedBirthDate = req.body.birthDate;
  const updatedPassportNumber = req.body.passportNumber;
  const updatedIssueDate = req.body.issueDate;
  const updatedNationality = req.body.nationality;
  const updatedAge = req.body.age;
  const updatedGender = req.body.gender;
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.firstName = updatedFirstName;
      product.lastName = updatedLastName;
      product.englishName = updatedEnglishName;
      product.birthDate = updatedBirthDate;
      product.passportNumber = updatedPassportNumber;
      product.issueDate = updatedIssueDate;
      product.nationality = updatedNationality;
      product.age = updatedAge;
      product.gender = updatedGender;
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        userName:req.session.userName
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
