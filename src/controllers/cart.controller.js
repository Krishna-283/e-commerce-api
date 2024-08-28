import { asyncHandler, ApiResponse, ApiError } from '../utlis/index.js';
import { Cart, Product } from '../models/index.js';

export const addItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user?._id;

    if (!productId) {
        throw new ApiError(400, 'ProductId is required');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    const cart = await Cart.findOne({ userId });

    if (cart) {
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += parseInt(quantity, 10);
        } else {
            cart.items.push({
                productId: product._id,
                quantity: parseInt(quantity, 10),
            });
        }
        await cart.save();
    } else {
        const newCart = new Cart({
            userId,
            items: [
                {
                    productId: product._id,
                    quantity: parseInt(quantity, 10),
                },
            ],
        });

        await newCart.save();
    }

    const updatedCart = await Cart.findOne({ userId });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCart, 'Item added to cart'));
});

export const deleteItemById = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    if (!itemId) {
        throw new ApiError(400, 'Item id required');
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter(item => !item._id.equals(itemId));
    await cart.save();

    const updatedCart = await Cart.findOne({ userId });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCart, 'Item deleted successfully'));
});

export const updateCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!itemId || !quantity) {
        throw new ApiError(400, 'Item id and quantity is required');
    }

    if (isNaN(quantity) || quantity < 1) {
        throw new ApiError(400, 'Invalid quantity');
    }

    const userId = req.user?._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => item._id == itemId);
    if (itemIndex === -1) {
        throw new ApiError(404, 'Item not found in the cart');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCart, 'Cart successfully updated'));
});

export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

export const deleteCart = asyncHandler(async (req, res) => {
    const isDeleted = await Cart.findOneAndDelete({ userId });
    console.log(isDeleted);
    if (!isDeleted) {
        throw new ApiError(500, 'Error deleting cart');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Cart deleted successfully'));
});
