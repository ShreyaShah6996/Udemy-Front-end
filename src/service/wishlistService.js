import BaseService from './baseService';

export function getWishlistByUser(userId) {
    return BaseService.get('/cart/user/wishlist/' + userId);
}