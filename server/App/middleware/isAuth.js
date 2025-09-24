import  jwt  from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = await req.cookies.token
        
        if(!token){
            return res.status(400).json({message:"token does not found"});
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(verifyToken)

        req.userId = verifyToken.userId;

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"isAuth error"})
    }
}
export default isAuth