import Jwt  from "jsonwebtoken"

export default function generarJWT(id){

    return Jwt.sign({id}, process.env.PASS_JWT, {
        expiresIn: '15d'
    });

}