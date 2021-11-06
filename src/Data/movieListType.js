const moviesListTypes = {
    mostPopular: {
        type: "mostPopular",
        query:{
            limit: 16,
            sort_by: 'like_count',
            minimum_rating: 0,
            genre: '',
        }
    },
    topRated: {
        type: "topRated",
        query:{
            limit: 20,
            sort_by: 'rating',
            minimum_rating: 0,
            genre: '',
        }
    },
    recentlyAdded: {
        type: "recentlyAdded",
        query:{
            limit: 15,
            sort_by: 'date_added',
            minimum_rating: 0,
            genre:""
        }
    },
    comedy: {
        type: "comedy",
        query: {
            limit: 15,
            genre: 'Comedy',
            sort_by: "like_count",
            minimum_rating: 0,
        }
    },
    romance: {
        type: "romance",
        query:{
            limit: 15,
            genre: 'Romance',
            sort_by: "download_count",
            minimum_rating: 0,
        }
    },
    fantasy: {
        type: "fantasy",
        query:{
            limit: 15,
            genre: 'fantasy',
            sort_by: "year",
            minimum_rating: 7
        }
},
    drama: {
        type: "drama",
        query:{
            limit: 15,
            genre: 'Drama',
            sort_by: "year",
            minimum_rating: 7
        }
    },
    horror: {
        type: "horror",
        query:{
            limit: 15,
            genre: 'Horror',
            sort_by: "download_count",
            minimum_rating: 0,
        }
    },
    musical: {
        type: "musical",
        query:{
            limit: 15,
            genre: 'Musical',
            sort_by: "download_count",
            minimum_rating: 0,
        }
    }
}

export default moviesListTypes;