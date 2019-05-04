const INITIAL_STATE = {
    wishlist: [],
    error_msg: ""
}

export const FAILED = 'FAILED';
export const GET_WISHLIST_BY_USER = 'GET_WISHLIST_BY_USER';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_WISHLIST_BY_USER: {
            return Object.assign({}, state, { wishlist: action.wishlist })
        }
        case FAILED: {
            return Object.assign({}, state, { error_msg: action.error_msg });
        }
        default:
            return state;
    }
}