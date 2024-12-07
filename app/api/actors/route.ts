import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests (fetch all actors)
export async function GET() {
  try {
    const actors = await prisma.actor.findMany();
    return NextResponse.json(actors);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching actors' },
      { status: 500 }
    );
  }
}

// Handle POST requests (create or retrieve an actor)
export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    // Check if the actor already exists
    let actor = await prisma.actor.findUnique({
      where: { name },
    });

    // If not, create a new actor
    if (!actor) {
      actor = await prisma.actor.create({
        data: { name },
      });
    }

    return NextResponse.json(actor);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating or retrieving actor' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests (delete an actor by ID)
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); 
    if (!id) {
      return NextResponse.json(
        { error: 'Actor ID is required for deletion' },
        { status: 400 }
      );
    }

    // Delete the actor by ID
    const deletedActor = await prisma.actor.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedActor);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting actor' },
      { status: 500 }
    );
  }
}