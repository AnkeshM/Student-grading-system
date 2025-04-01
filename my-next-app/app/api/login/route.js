import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user"; // Updated import to match schema
import bcrypt from "bcryptjs";

export async function GET() {
    await connectDB();
    try {
        const users = await user.find();
        return NextResponse.json(users, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "error occurred" }, { status: 500 });
    }
}

// export async function POST(req) {
//     try {
//         await connectDB();

//         const body = await req.json();
//         const { role, email, password } = body;

//         const existingUser = await user.findOne({ email });
//         if (existingUser) {

//             const cmp = await bcrypt.compare(password, existingUser.password);
//             console.log(cmp);

//             if (cmp && existingUser.role === role && role === "student") {
//                 return NextResponse.json({
//                     message: "Student Login successful.",
//                     isStudent: true
//                 },{ status: 200 })
//             }

//             if (cmp && existingUser.role === role && role === "faculty") {
//                 return NextResponse.json({
//                     message: "Faculty Login successful.",
//                     isFaculty: true
//                 },{ status: 200 })
//             }


//             return NextResponse.json({ message: "Wrong password" }, { status: 201 });
//         }

//         return NextResponse.json({ message: "Not found" }, { status: 400 });
//     } catch (err) {
//         return NextResponse.json({ err: "Server error" }, { status: 500 });
//     }
// }

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

        // Successful login response
        const responsePayload = {
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`,
            isStudent: role === "student",
            isFaculty: role === "faculty",
            isAdmin: role === "admin"
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
        
        const { email } = await req.json(); // Extract email from request body
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const deletedUser = await user.findOneAndDelete({ email });
        if (deletedUser) {
            return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    } catch (err) {
        return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
    }
}