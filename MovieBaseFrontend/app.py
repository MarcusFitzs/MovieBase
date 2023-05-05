import os

import numpy as np
import pandas as pd
from flask import Flask, request
from flask_cors import CORS
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from joblib import Parallel, delayed
import joblib

import json

app = Flask(__name__)
CORS(app)

@app.route('/similar', methods=['POST'])
def similar():

    # Load CSV
    movie_titles_df = pd.read_csv('title_merge_ratings_500000.csv')

    # Drop unnecessary columns
    movie_titles_df = movie_titles_df.drop(['Unnamed: 0', 'titleType', 'startYear', 'runtimeMinutes', 'averageRating', 'numVotes', "Action", "Adult", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "Game-Show", "History", "Horror", "Music", "Musical", "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi", "Short", "Sport", "Talk-Show", "Thriller", "War", 'Western'], axis=1)

    # Storing the variable taken from front end
    titleID = request.form["tconst"]  
    
    # Using TfidfVectorizer to transform text to feature vectors
    tfidfvectorizer = TfidfVectorizer(analyzer='word', stop_words='english')

    tfidf_wm = tfidfvectorizer.fit_transform(movie_titles_df['genres'])

    # Using Cosine Similarity to calculate similarity between movies based on the genres they have in common
    cosine_sim = cosine_similarity(tfidf_wm, tfidf_wm)

    ## Building a 1-dimensional array from the movie titles
    titles = movie_titles_df['tconst']
    indices = pd.Series(movie_titles_df.index, index=movie_titles_df['tconst'])

    ## Function that retrieves the top recommendations based on the cosine similarity to the movie ID (tconst) entered when fucntion called
    def recommend_from(id):
        idx = indices[id]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:21]
        movie_indices = [i[0] for i in sim_scores]
        return titles.iloc[movie_indices]

    # Storing the generated recommendations
    recommendations = recommend_from(titleID).head(10)

    output = recommendations.to_json()


    return output

@app.route('/rate', methods=['POST'])
def rate():

    refined_dataset = pd.read_csv('IMDbRefined2.csv')

    refined_dataset = refined_dataset.drop('Unnamed: 0', axis=1)

    print("request.form[tconst] = ", request.form["tconst"])
    print("request.form[this_user_id] = ", request.form["this_user_id"])
    print("request.form[primaryTitle] = ", request.form["primaryTitle"])
    print("int(request.form[rating]) = ", int(request.form["rating"]))
    
    newTitleID = request.form["tconst"]   
    newUserID = request.form["this_user_id"]
    newPrimaryTitle = request.form["primaryTitle"]
    newRating = int(request.form["rating"])
    row = [newTitleID, newUserID, newPrimaryTitle, newRating]

    refined_dataset.loc[len(refined_dataset)] = row

    refined_dataset.to_csv('IMDbRefined2.csv')

    return row


@app.route('/upload', methods=['POST'])
def upload():

    # Load model
    knn_model = joblib.load('IMDbModel.h5')

    # Load csv(s)
    refined_dataset = pd.read_csv('IMDbRefined2.csv')

    # Drop unnecessary column
    refined_dataset = refined_dataset.drop('Unnamed: 0', axis=1)

    # # Manual creation of new row to be added
    # newTitleID = "tt8946378"    
    # newUserID = "641c87d06a97e629837fc079"
    # newPrimaryTitle = "Knives Out"
    # newRating = "8.0"
    # row = [newTitleID, newUserID, newPrimaryTitle, newRating]

    # # Adding the manually created row
    # refined_dataset.loc[len(refined_dataset)] = row

    movieUser_df = refined_dataset.pivot_table(
        index='userID',
            columns='titleID',
                ## Replacing all movies users haven't rated with a rating of 0
                values='rating').fillna(0)

    # Create list of movies from columns in movieUser_df and make into scipy sparse matrix
    movie_list = movieUser_df.columns
    movieUser_scipy_df = csr_matrix(movieUser_df.values)

    # Fit the model to the scipy sparce matrix dataframe
    knn_model.fit(movieUser_scipy_df)

    # Creating empty arrays that will hold the data
    simUsers = []
    userDistances = []
    highestMovies = []
    recommendedMovies = []

    # Find most similar users to target user
    def similar_users(user, n = 5):
        # Convert values to numpy array and pass through model and output values for user and distance
        knn_input = np.asarray([movieUser_df.values[user-1]])
        distances, indices = knn_model.kneighbors(knn_input, n_neighbors=n+1)
        
        for i in range(1,len(distances[0])):
            # Passing the data to empty arrays
            simUsers.append(indices[0][i]+1)
            userDistances.append(distances[0][i])
        return indices.flatten()[1:] + 1, distances.flatten()[1:]

    # Function that outputs the top n movies based on ratings of similar users from the mean rating list
    def recommend_movies(n):
        n = min(len(mean_ratings_list),n)
        recommendedMovies.append(list(movie_list[np.argsort(mean_ratings_list)[::-1][:n]]))
        return recommendedMovies

    # Variables taken from front end form
    target_user_id = request.form["target_user_id"]
    target_user = np.where(movieUser_df.index == target_user_id)[0][0]
    no_of_highest = int(request.form["no_of_highest"])
    no_of_similar_users = int(request.form["no_of_similar_users"])
    no_of_movies = int(request.form["no_of_movies"])+1

    
    highestMovies.append(list(refined_dataset[refined_dataset['userID'] == target_user_id].sort_values('rating', ascending=False)['titleID'])[:no_of_highest])

    # Calling the similar_user function, providing the target user to check and how many similar users to find (5)
    # Passing similar users to similar_user_list and similar user's distances from the target user to ditance_list
    similar_user_list, distance_list = similar_users(target_user, no_of_similar_users)
    
    # Adding weights to similar user's ratings depending on their distance from the target user
    weighted_list = distance_list/np.sum(distance_list)

    # Storing all of the ratings submitted by the users determined as most similar
    similar_user_ratings = movieUser_df.values[similar_user_list]

    # Adding a column vector, increasing dimensions of weighted_list by adding axis of movies from movies_list
    weighted_list = weighted_list[:,np.newaxis] + np.zeros(len(movie_list))

    # Adding the weights to user ratings and creating a new list of mean, weighted ratings
    ratings_matrix = weighted_list*similar_user_ratings
    mean_ratings_list = ratings_matrix.sum(axis =0)

    # Call recommend_movies function and pass amount of movies to recommend
    recommend_movies(no_of_movies)


    # Store arrays in a dictionary to transform into JSON
    dict1 = {'Users_Top_Movies': highestMovies, 'Similar_Users': simUsers, 'Sim_User_distances': userDistances, 'Recommendations': recommendedMovies}

    # Convert any instances of np.int64 variables to int to get around python/JSON bug
    def convert(o):
        if isinstance(o, np.int64): return int(o)  
        raise TypeError

    # Convert dictionary to JSON and send to front end
    return json.dumps({'data': dict1}, default=convert)

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)