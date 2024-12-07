"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card"; 
import { Label } from "@/components/ui/label"; 
import { Prisma } from "@prisma/client";

interface MovieFormProps {
  movie?: Prisma.MovieGetPayload<{
    include: {
      genre: true;
      director: true;
      actors: {
        include: {
          actor: true;
        };
      };
    };
  }>;
}

export default function MovieForm({ movie }: MovieFormProps) {
  const [title, setTitle] = useState(movie?.title || "");
  const [releaseDate, setReleaseDate] = useState(
    movie?.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : ""
  );
  const [rating, setRating] = useState(movie?.rating?.toString() || "");
  const [genreName, setGenreName] = useState(movie?.genre?.name || "");
  const [directorName, setDirectorName] = useState(movie?.director?.name || "");
  const [actorNames, setActorNames] = useState(
    movie?.actors?.map((a) => a.actor?.name).join(", ") || ""
  );

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const movieData = {
      title: title.trim(),
      releaseDate,
      rating: rating ? parseFloat(rating) : null,
      genreName: genreName.trim(),
      directorName: directorName.trim(),
      actorNames: actorNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name),
    };

    try {
      const url = movie ? `/api/movies/${movie.id}` : "/api/movies";
      const method = movie ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      router.push("/movies");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-32 max-w-2xl mx-auto mt-10 shadow-lg space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <Label htmlFor="title" className="mb-2 block">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter movie title"
          />
        </div>

        <div>
          <Label htmlFor="releaseDate" className="mb-2 block">
            Release Date
          </Label>
          <Input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="rating" className="mb-2 block">
            Rating
          </Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter movie rating (optional)"
          />
        </div>

        <div>
          <Label htmlFor="genreName" className="mb-2 block">
            Genre Name
          </Label>
          <Input
            id="genreName"
            type="text"
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
            placeholder="Enter genre name"
          />
        </div>

        <div>
          <Label htmlFor="directorName" className="mb-2 block">
            Director Name
          </Label>
          <Input
            id="directorName"
            type="text"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            placeholder="Enter director name"
          />
        </div>

        <div>
          <Label htmlFor="actorNames" className="mb-2 block">
            Actor Names (comma-separated)
          </Label>
          <Input
            id="actorNames"
            type="text"
            value={actorNames}
            onChange={(e) => setActorNames(e.target.value)}
            placeholder="Enter actor names separated by commas"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Submitting..." : movie ? "Update Movie" : "Create Movie"}
        </Button>
      </form>
    </Card>
  );
}