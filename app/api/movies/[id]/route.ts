// app/api/movies/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

// GET method to fetch a single movie
export async function GET(
  request: Request,
  { params } : { params: Promise<{ id : string }> }
) {
  const movieId = Number((await params).id);

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genre: true,
        director: true,
        actors: {
          include: {
            actor: true,
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Error fetching movie' }, { status: 500 });
  }
}

// PUT method to update a movie
export async function PUT(
  request: Request,
  { params } : { params: Promise<{ id : string }> }
) {
  const movieId = Number((await params).id);

  try {
    // Parse the request body
    const {
      title,
      releaseDate,
      rating,
      genreName,
      directorName,
      actorNames,
    } = await request.json();

    // Validate required fields
    if (
      !title ||
      !releaseDate ||
      !genreName ||
      !directorName ||
      !Array.isArray(actorNames)
    ) {
      console.error('Missing required fields or invalid data format');
      return NextResponse.json(
        { error: 'Missing required fields or invalid data format' },
        { status: 400 }
      );
    }

    // Upsert genre
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    // Upsert director
    const director = await prisma.director.upsert({
      where: { name: directorName },
      update: {},
      create: { name: directorName },
    });

    // Upsert actors and collect their IDs
    const actorIds = [];
    for (const name of actorNames) {
      const actor = await prisma.actor.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      actorIds.push(actor.id);
    }

    // Update the movie
    const movie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title,
        releaseDate: new Date(releaseDate),
        rating,
        genre: { connect: { id: genre.id } },
        director: { connect: { id: director.id } },
        actors: {
          deleteMany: {}, // Remove existing actor relations
          create: actorIds.map((actorId) => ({
            actor: { connect: { id: actorId } },
          })),
        },
      },
      include: {
        genre: true,
        director: true,
        actors: {
          include: {
            actor: true,
          },
        },
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error updating movie:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error updating movie';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params } : { params: Promise<{ id : string }> }
) {
  const movieId = parseInt((await params).id, 10);

  if (isNaN(movieId)) {
    return NextResponse.json(
      { error: 'Invalid movie ID provided' },
      { status: 400 }
    );
  }

  try {
    // Delete dependent records from MovieActor
    await prisma.movieActor.deleteMany({
      where: { movieId },
    });

    // Delete the movie record
    await prisma.movie.delete({
      where: { id: movieId },
    });

    // Return success response
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('Error deleting movie:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Error deleting movie';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}