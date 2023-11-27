import {
  createProfile,
  findAllActiveProfiles,
  findOneProfileByEmail,
  removeProfileByEmail,
} from "@/app/_services/ProfileService";
import type {
  ProfileInsertParam,
  Profile,
} from "@/app/_services/ProfileService";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = await req.nextUrl.searchParams;
  if (params.size === 0) {
    const profileList: Profile[] = await findAllActiveProfiles(false);
    return NextResponse.json(profileList);
  }

  const email = params.get("email");
  if (!email || email === "")
    return NextResponse.json({ error: "No email value." }, { status: 400 });

  const profile = await findOneProfileByEmail(email);
  if (!profile)
    return NextResponse.json(
      { error: `Not found ${email} profile.` },
      { status: 404 }
    );

  return NextResponse.json(profile);
};

export const POST = async (req: NextRequest) => {
  const reqData: ProfileInsertParam = await req.json();
  const created = await createProfile(reqData);
  if ("status" in created)
    return NextResponse.json(created, { status: created.status });

  return NextResponse.json(created);
};

export const DELETE = async (req: NextRequest) => {
  const emailParam = await req.nextUrl.searchParams.get("email");
  if (!emailParam || emailParam === "")
    return NextResponse.json({ error: "No email value." }, { status: 400 });

  const physicalRemove = await req.nextUrl.searchParams.get("physicalRemove");

  const isPhysicalRemove = physicalRemove === "true" ? true : false;
  console.log(isPhysicalRemove);
  const removedProfile = await removeProfileByEmail(
    emailParam,
    isPhysicalRemove
  );
  if ("status" in removedProfile)
    return NextResponse.json(
      { error: removedProfile },
      { status: removedProfile.status }
    );
  console.log(removedProfile);
  return new Response(null, { status: 204 });
};
