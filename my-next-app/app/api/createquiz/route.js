import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST() {
    await connectDB();
    try{
        const body = await req.json();
        const { id, question, options, correctOption } = body;
    }
    catch(error){

    }
}