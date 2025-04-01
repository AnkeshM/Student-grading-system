import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/user"; // Use User schema

// export async function POST(req) {
//     try 
//     {
//         await connectDB();

//         const body = await req.json();
//         const { role, name, gender, batch = "", semester = "", email, password } = body;
//         if (role === "student")
//         {  
//             const existingUser = await student.findOne({ email });
//             if (existingUser) {
//                 return NextResponse.json({ error: "User already exists" }, { status: 400 });
//             }
    
//             const hashedPassword = await bcrypt.hash(password, 10);
    
//             const newUser = new student({
//                 role,
//                 name,
//                 gender,
//                 batch,
//                 semester,
//                 email,
//                 password: hashedPassword,
//             });
//             await newUser.save();
//         }
        
//         else if (role === "faculty")
//         {
//             const existingUser = await faculty.findOne({ email });
//             if (existingUser) {
//                 return NextResponse.json({ error: "User already exists" }, { status: 400 });
//             }
    
//             const hashedPassword = await bcrypt.hash(password, 10);
    
//             const newUser = new faculty({
//                 role,
//                 name,
//                 gender,
//                 email,
//                 password: hashedPassword,
//             });
//             await newUser.save();
//         }


//         return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
//     } 
//     catch (err) 
//     {
//         return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
//     }
// }

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { role, name, gender, batch, semester, department, email, password } = body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Define new user object based on role
        const newUserData = {
            role,
            name,
            gender,
            email,
            password: hashedPassword
        };

        if (role === "student") {
            if (!batch || !semester) {
                return NextResponse.json({ error: "Batch and semester are required for students" }, { status: 400 });
            }
            newUserData.batch = batch;
            newUserData.semester = semester;
        } else if (role === "faculty") {
            if (!department) {
                return NextResponse.json({ error: "Department is required for faculty" }, { status: 400 });
            }
            newUserData.department = department;
        }

        // Save user to database
        const newUser = new User(newUserData);
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (err) {
        console.error("Registration Error:", err);
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
}