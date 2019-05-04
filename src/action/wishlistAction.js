import * as wishlistService from '../service/wishlistService';
import { FAILED, GET_WISHLIST_BY_USER } from '../reducer/wishlistReducer';

export const getWishlistByUser = (userId) => {
    return (dispatch) => {
        wishlistService.getWishlistByUser(userId)
            .then((response) => {
                if (response.status === 200) {
                    dispatch({
                        type: GET_WISHLIST_BY_USER,
                        wishlist: response.data
                    });
                }
            })
            .catch((error) => {
                if (error) {
                    dispatch({
                        type: FAILED,
                        data: { error_msg: error.response.data.message }
                    });
                }
            });
    }
};