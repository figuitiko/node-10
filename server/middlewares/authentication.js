const jwt = require('jsonwebtoken')

// checking token


let checkToken = (req, res, next) => {



    let token = req.get('token');
    jwt.verify(token, process.env.SECRET, (err, decode)=> {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decode.user;
        next();

    })

    

}

let checkRole = (req, res, next) => {

    let user = req.user;

    if(user.role !== 'ADMIN_ROLE'){
        return  res.status(400).json({
            ok: false,
            err:{
                msg: 'you are not and admin user'
            }
        })   
    }
    next();
}


module.exports ={
    checkToken,
    checkRole
}