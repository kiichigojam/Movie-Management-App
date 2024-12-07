import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests (fetch all directors)
export async function GET() {
  try {
    const directors = await prisma.director.findMany();
    return NextResponse.json(directors);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching directors' },
      { status: 500 }
    );
  }
}

// Handle POST requests (create or retrieve a director)
export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    // Check if the director already exists
    let director = await prisma.director.findUnique({
      where: { name },
    });

    // If not, create a new director
    if (!director) {
      director = await prisma.director.create({
        data: { name },
      });
    }

    return NextResponse.json(director);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating or retrieving director' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests (delete a director by ID)
export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Director ID is required for deletion' },
        { status: 400 }
      );
    }

    const deletedDirector = await prisma.director.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedDirector);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting director' },
      { status: 500 }
    );
  }
}