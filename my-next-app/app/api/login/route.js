import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function GET() {
    await connectDB();
    try {
        const users = await User.find(); // Fixed incorrect reference
        return NextResponse.json(users, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Error occurred" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { role, email, password } = body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
        }

        // Role-based login handling
        if (existingUser.role !== role) {
            return NextResponse.json({ message: `Unauthorized: Not a ${role}` }, { status: 403 });
        }

        // Prepare user data to be stored on the frontend
        const userData = {
            userId: existingUser._id,
            name: existingUser.name,
            role: existingUser.role,
            email: existingUser.email
        };

        // Successful login response
        const responsePayload = {
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`,
            userData
        };

        return NextResponse.json(responsePayload, { status: 200 });

    } catch (err) {
        console.error("Login Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const deletedUser = await User.findOneAndDelete({ email }); // Fixed incorrect reference
        if (deletedUser) {
            return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    } catch (err) {
        return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
    }
}
