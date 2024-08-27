import { Product } from '../models/product.model.js';
import { asyncHandler, ApiError, ApiResponse } from '../utlis/index.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utlis/cloudinary.js';

export const registerProduct = asyncHandler(async (req, res) => {
    const { name, description, category, price, stock } = req.body;

    if (
        [name, description, category, price, stock].some(
            field => field?.trim() === ''
        )
    ) {
        throw new ApiError(400, 'Missing necessary fields');
    }

    const productData = {
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
    };

    if (req.files?.productImage?.[0]?.path) {
        const productImagePath = req.files.productImage[0].path;
        const response = await uploadOnCloudinary(productImagePath);
        productData.imageUrl = response.url;
    }

    const product = new Product(productData);
    await product.save();

    const createdProduct = await Product.findById(product._id);
    if (!createdProduct) {
        throw new ApiError(500, 'Error creating product');
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdProduct, 'Product created successfully')
        );
});

export const listProduct = asyncHandler(async (req, res) => {
    const { sort, filter, page = 1, per_page = 10 } = req.query;

    const filterObj = {};
    if (filter) {
        for (let key in filter) {
            filterObj[key] = filter[key];
        }
    }

    const sortObj = {};
    if (sort) {
        const [field, order] = sort.split('_');
        sortObj[field] = order === 'asc' ? 1 : -1;
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(per_page, 10);

    const products = await Product.find(filterObj)
        .sort(sortObj)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

    return res
        .status(200)
        .json(new ApiResponse(200, products, 'Products fetched successfully'));
});

export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    return res
        .status(200)
        .json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

export const updateProductImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const productImageLocalPath = req.files?.productImage?.[0]?.path;
    if (!productImageLocalPath) {
        throw new ApiError(400, 'Product image requried');
    }

    const product = await Product.findById(id);

    const uploadedImage = await uploadOnCloudinary(productImageLocalPath);
    if (!uploadedImage) {
        throw new ApiError(500, "Error updating image");
    }

    await deleteOnCloudinary(product.imageUrl)
    product.imageUrl = uploadedImage.url;

    return res
        .send(200)
        .json(new ApiResponse(200, {}, 'Product Image updated successfully'));
});
