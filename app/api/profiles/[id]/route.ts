import {
  findOneProfileById,
  removeProfileByEmail,
} from "@/app/_services/ProfileService";
import { isNumeric } from "@/app/_utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  if (!isNumeric(params.id))
    return NextResponse.json(
      { error: `Invalid param(id:${params.id})` },
      { status: 400 }
    );
  const prof = await findOneProfileById(parseInt(params.id));
  if ("status" in prof)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json(prof);
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  if (!isNumeric(params.id))
    return NextResponse.json(
      { error: `Invalid param(id:${params.id})` },
      { status: 400 }
    );

  const prof = await findOneProfileById(parseInt(params.id));
  if ("status" in prof)
    return NextResponse.json({ error: prof.error }, { status: prof.status });

  const removed = await removeProfileByEmail(prof.email);

  console.log(removed);
  return new Response(null, { status: 204 });
};
