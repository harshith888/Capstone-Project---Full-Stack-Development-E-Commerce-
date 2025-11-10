import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{
    // Accept token either from cookie or Authorization header (Bearer)
    let token = null;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')){
        token = authHeader.split(' ')[1];
    }

    if(!token){
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default authUser;