// app/movies/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MovieForm from '@/app/_components/MovieForm';

export default function EditMoviePage() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie');
        }
        const data = await response.json();
        console.log('Fetched movie:', data); // Debugging
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="pt-16">
      <h1>Edit Movie</h1>
      <MovieForm movie={movie} />
    </div>
  );
}