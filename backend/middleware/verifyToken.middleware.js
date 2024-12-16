import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        res.status(401).json({success: false, message: "Un-authorized- no token provided"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            res.status(401).json({success: false, message: "Unauthorized- invalid token"})
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("Error in verifyTooken ",error);
        res.status(500).json({success: false, message: "Server error"})
        
    }
}