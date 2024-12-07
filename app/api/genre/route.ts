import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests (fetch all genres)
export async function GET() {
  try {
    const genres = await prisma.genre.findMany();
    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching genres' },
      { status: 500 }
    );
  }
}

// Handle POST requests (create or retrieve a genre)
export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    // Check if the genre already exists
    let genre = await prisma.genre.findUnique({
      where: { name },
    });

    // If not, create a new genre
    if (!genre) {
      genre = await prisma.genre.create({
        data: { name },
      });
    }

    return NextResponse.json(genre);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating or retrieving genre' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests (delete a genre by ID)
export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Genre ID is required for deletion' },
        { status: 400 }
      );
    }

    const deletedGenre = await prisma.genre.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedGenre);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting genre' },
      { status: 500 }
    );
  }
}