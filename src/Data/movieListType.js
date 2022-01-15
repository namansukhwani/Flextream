const moviesListTypes = {
    mostPopular: {
        type: "mostPopular",
        query:{
            limit: 16,
            sort_by: 'like_count',
            minimum_rating: 0,
            genre: '',
        },
        title:"Most Popular Movies"
    },
    topRated: {
        type: "topRated",
        query:{
            limit: 20,
            sort_by: 'rating',
            minimum_rating: 0,
            genre: '',
        },
        title:"Top Rated Movies"
    },
    recentlyAdded: {
        type: "recentlyAdded",
        query:{
            limit: 15,
            sort_by: 'date_added',
            minimum_rating: 0,
            genre:""
        },
        title:'Recently Added'
    },
    comedy: {
        type: "comedy",
        query: {
            limit: 15,
            genre: 'Comedy',
            sort_by: "like_count",
            minimum_rating: 0,
        },
        title:"Popular in Comedy"
    },
    romance: {
        type: "romance",
        query:{
            limit: 15,
            genre: 'Romance',
            sort_by: "download_count",
            minimum_rating: 0,
        },
        title:"Popular in Romance"
    },
    fantasy: {
        type: "fantasy",
        query:{
            limit: 15,
            genre: 'fantasy',
            sort_by: "year",
            minimum_rating: 7
        },
        title:"Trending in Fantasy"
},
    drama: {
        type: "drama",
        query:{
            limit: 15,
            genre: 'Drama',
            sort_by: "year",
            minimum_rating: 7
        },
        title:'Treanding in Drama'
    },
    horror: {
        type: "horror",
        query:{
            limit: 15,
            genre: 'Horror',
            sort_by: "download_count",
            minimum_rating: 0,
        },
        title:"Popular in Horror"
    },
    musical: {
        type: "musical",
        query:{
            limit: 15,
            genre: 'Musical',
            sort_by: "download_count",
            minimum_rating: 0,
        },
        title:"Popular in Musical"
    }
}

export default moviesListTypes;