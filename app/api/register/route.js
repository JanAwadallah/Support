import { connectMongoDB } from "@/app/lib/mongodb";
import User from "../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return NextResponse.json(
        {
          message: "User already exists, please use a diffrent email or login ",
        },
        { status: 400 }
      );
    }
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error occurred while registring" },
      { status: 500 }
    );
  }
}
