-- CreateIndex
CREATE INDEX "Actor_id_idx" ON "Actor"("id");

-- CreateIndex
CREATE INDEX "Director_id_idx" ON "Director"("id");

-- CreateIndex
CREATE INDEX "Genre_id_idx" ON "Genre"("id");

-- CreateIndex
CREATE INDEX "Movie_genreId_idx" ON "Movie"("genreId");

-- CreateIndex
CREATE INDEX "Movie_directorId_idx" ON "Movie"("directorId");

-- CreateIndex
CREATE INDEX "Movie_releaseDate_idx" ON "Movie"("releaseDate");

-- CreateIndex
CREATE INDEX "MovieActor_movieId_idx" ON "MovieActor"("movieId");

-- CreateIndex
CREATE INDEX "MovieActor_actorId_idx" ON "MovieActor"("actorId");

-- CreateIndex
CREATE INDEX "MovieActor_movieId_actorId_idx" ON "MovieActor"("movieId", "actorId");
