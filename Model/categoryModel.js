import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    },
});

categorySchema.index({ name: 1 });

categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
