import jwt from "jsonwebtoken"


export const generateTokenAndSetCookie = (res, userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript (prevents client-side scripts from accessing it).

        
        secure: process.env.NODE_ENV === "production",  // Ensures the cookie is sent only over HTTPS if the app is in production.

        sameSite: "strict", // Ensures the cookie is sent only if the request comes from the same origin (prevents CSRF attacks).

        maxAge: 7*24*60*60*1000, // Sets the cookie expiration time (7 days in milliseconds).
    });

    return token;
}
