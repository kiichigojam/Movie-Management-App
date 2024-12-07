"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  rating: number | null;
  genre_name: string;
  director_name: string;
  actor_count: number;
}

export default function MovieFilterPage() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [directors, setDirectors] = useState<{ id: number; name: string }[]>([]);
  const [actors, setActors] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState({
    genreId: "",
    directorId: "",
    actorId: "",
    startDate: "",
    endDate: "",
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [statistics, setStatistics] = useState({
    totalMovies: 0,
    averageRating: 0,
  });

  // Fetch dropdown data for genres, directors, and actors
  useEffect(() => {
    async function fetchFilterData() {
      try {
        const [genresRes, directorsRes, actorsRes] = await Promise.all([
          fetch("/api/genre"),
          fetch("/api/directors"),
          fetch("/api/actors"),
        ]);
        setGenres(await genresRes.json());
        setDirectors(await directorsRes.json());
        setActors(await actorsRes.json());
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    }
    fetchFilterData();
  }, []);

  // Handle form submission
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data: {
        movies: Movie[];
        statistics: { totalMovies: number; averageRating: number };
      } = await res.json();

      setMovies(data.movies);
      setStatistics(data.statistics);
    } catch (error) {
      console.error("Error fetching filtered movies:", error);
    }
  };

  return (
    <div className="p-32">
      <h1 className="text-2xl font-bold mb-4">Filter Movies</h1>
      <form onSubmit={handleFilterSubmit} className="space-y-4">
        <label>
          Genre
          <select
            className="block w-full p-2 border rounded"
            value={filters.genreId}
            onChange={(e) => setFilters({ ...filters, genreId: e.target.value })}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Director
          <select
            className="block w-full p-2 border rounded"
            value={filters.directorId}
            onChange={(e) =>
              setFilters({ ...filters, directorId: e.target.value })
            }
          >
            <option value="">All Directors</option>
            {directors.map((director) => (
              <option key={director.id} value={director.id}>
                {director.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Actor
          <select
            className="block w-full p-2 border rounded"
            value={filters.actorId}
            onChange={(e) =>
              setFilters({ ...filters, actorId: e.target.value })
            }
          >
            <option value="">All Actors</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>
                {actor.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Start Date
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </label>

        <label>
          End Date
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </label>

        <Button type="submit" className="w-full bg-blue-600 text-white">
          Filter
        </Button>
      </form>

      <h2 className="text-xl font-bold mt-8">Results</h2>
      <ul className="space-y-2">
        {movies.map((movie) => (
          <li key={movie.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-bold">{movie.title}</h3>
            <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p>Genre: {movie.genre_name}</p>
            <p>Director: {movie.director_name}</p>
            <p>Number of Actors: {movie.actor_count}</p>
            <p>Rating: {movie.rating || "N/A"}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-8">Statistics</h2>
      <p>Total Movies: {statistics.totalMovies}</p>
      <p>Average Rating: {statistics.averageRating.toFixed(2)}</p>
    </div>
  );
}