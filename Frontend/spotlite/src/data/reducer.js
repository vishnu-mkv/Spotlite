export const initialState = {
    user: null,
    accessToken: null,
    playlists: [],
    playing: false,
    currentlyPlaying: null,
    likedSongs: [],
    likedPlaylists: [],
}

const reducer = (state, action) => {
    console.log(action);

    switch(action.type) {
        case 'SET_USER':
            return {...state, user: action.user,};
        case 'SET_ACCESS_TOKEN':
            return {...state, accessToken: action.accessToken,};
        case 'SET_PLAYLISTS':
            return {...state, playlists: action.playlists,};
        case 'SET_LIKED_SONGS':
            return {...state, likedSongs: action.likedSongs};
        case 'SET_LIKED_PLAYLISTS':
            return {...state, likedPlaylists: action.likedPlaylists};
        default:
            return state;
    }
}

export default reducer;