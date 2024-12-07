import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface MovieResult {
  id: bigint; 
  title: string;
  releaseDate: Date;
  rating: number | null;
  genre_name: string;
  director_name: string;
  actor_count: bigint;
}

export async function POST(request: Request) {
  try {
    const { genreId, directorId, actorId, startDate, endDate } = await request.json();

    const queryParams: any[] = [];
    let query = `
      SELECT m.*, 
        g.name AS genre_name, 
        d.name AS director_name, 
        COUNT(ma."actorId") AS actor_count
      FROM "Movie" m
      LEFT JOIN "Genre" g ON m."genreId" = g.id
      LEFT JOIN "Director" d ON m."directorId" = d.id
      LEFT JOIN "MovieActor" ma ON m.id = ma."movieId"
      WHERE 1=1
    `;

    if (genreId) {
      query += ` AND m."genreId" = $${queryParams.length + 1}`;
      queryParams.push(Number(genreId));
    }
    if (directorId) {
      query += ` AND m."directorId" = $${queryParams.length + 1}`;
      queryParams.push(Number(directorId));
    }
    if (actorId) {
      query += ` AND ma."actorId" = $${queryParams.length + 1}`;
      queryParams.push(Number(actorId));
    }
    if (startDate && endDate) {
      query += ` AND m."releaseDate" BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
      queryParams.push(new Date(startDate), new Date(endDate)); 
    }

    query += ' GROUP BY m.id, g.name, d.name';

    const rawMovies = await prisma.$queryRawUnsafe<MovieResult[]>(query, ...queryParams);

    const movies = rawMovies.map((movie) => ({
      ...movie,
      id: Number(movie.id), 
      actor_count: Number(movie.actor_count), 
    }));

    const statistics = {
      totalMovies: movies.length,
      averageRating: movies.length > 0
        ? movies.reduce((acc, m) => acc + (m.rating || 0), 0) / movies.length
        : 0,
    };

    return NextResponse.json({ movies, statistics });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching filtered movies:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}