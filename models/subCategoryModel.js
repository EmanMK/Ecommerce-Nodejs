const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'subCategory must be unique'],
      minLength: [2, 'Too short subCategory'],
      maxLength: [32, 'Too long subCategory'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must be belong to main Category'],
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/subcategories/${doc.image}`;
    doc.image = imageUrl;
  }
};
subCategorySchema.post('init', (doc) => {
  setImageUrl(doc);
});
subCategorySchema.post('save', (doc) => {
  setImageUrl(doc);
});

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;
