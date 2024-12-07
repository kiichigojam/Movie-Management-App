"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Define the Movie interface to specify the expected structure
interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  rating: number | null;
  genre: { name: string };
  director: { name: string };
  actors: { actor: { name: string } }[];
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]); // Type movies as an array of Movie

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/movies");
        const data = (await res.json()) as Movie[]; 
        console.log("Fetched movies data:", data); // Check if data is an array
        setMovies(Array.isArray(data) ? data : []); // Set only if data is an array
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]); // Fallback to an empty array on error
      }
    }
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      await fetch(`/api/movies/${id}`, { method: "DELETE" });
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Movies</h1>
      <div className="flex justify-end">
        <Link href="/movies/new">
          <Button>Create New Movie</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <Card key={movie.id} className="space-y-4 p-4">
            <div>
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">
                Release Date:{" "}
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label>Rating</Label>
              <p>{movie.rating !== null ? movie.rating : "N/A"}</p>
            </div>
            <div>
              <Label>Genre</Label>
              <p>{movie.genre?.name || "N/A"}</p>
            </div>
            <div>
              <Label>Director</Label>
              <p>{movie.director?.name || "N/A"}</p>
            </div>
            <div>
              <Label>Actors</Label>
              <p>
                {movie.actors && movie.actors.length > 0
                  ? movie.actors.map((a) => a.actor.name).join(", ")
                  : "N/A"}
              </p>
            </div>
            <div className="flex justify-between space-x-2">
              <Link href={`/movies/${movie.id}/edit`}>
                <Button>Edit</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => handleDelete(movie.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}