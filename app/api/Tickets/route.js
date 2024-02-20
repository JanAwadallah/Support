import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (session) {
    try {
      if (session.user.role === "admin") {
        const tickets = await Ticket.find();
        return NextResponse.json({ tickets }, { status: 200 });
      } else {
        const email = req.nextUrl.searchParams.get("usremail");

        const tickets = await Ticket.find({ userEmail: email });
        return NextResponse.json({ tickets }, { status: 200 });
      }
    } catch (err) {
      console.log(err);
      return NextResponse.json({ message: "Error", err }, { status: 500 });
    }
  } else {
    return NextResponse.json(
      { message: "Error: Not Authorized" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const ticketData = body.formData;

    await Ticket.create(ticketData);

    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
