// app/api/movies/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use the singleton PrismaClient instance

// GET method to fetch all movies
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
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
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Error fetching movies' }, { status: 500 });
  }
}

// POST method to create a new movie
export async function POST(request: Request) {
  try {
    // Read the request body as plain text and check if it's empty
    const bodyText = await request.text();
    console.log('Received request body:', bodyText);

    if (!bodyText) {
      console.error('Received empty request body');
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    // Parse the JSON safely
    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyText);
      console.log('Parsed request body:', parsedBody);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const { title, releaseDate, rating, genreName, directorName, actorNames } = parsedBody;

    // Validate required fields
    if (!title || !releaseDate || !genreName || !directorName || !Array.isArray(actorNames)) {
      console.error('Missing required fields or invalid data format:', parsedBody);
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

    // Create the movie
    const movie = await prisma.movie.create({
      data: {
        title,
        releaseDate: new Date(new Date(releaseDate).toISOString()),
        rating,
        genre: { connect: { id: genre.id } },
        director: { connect: { id: director.id } },
        actors: {
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

    // Ensure movie is not null before returning
    if (!movie) {
      console.error('Failed to create movie');
      return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
    }

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);

    let errorMessage: string;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = 'An unknown error occurred';
    }

    console.error('Error message:', errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}