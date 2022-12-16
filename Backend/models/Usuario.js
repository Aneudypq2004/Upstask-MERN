import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        trim: true

    },

    confirmado: {
        type: Boolean,
        default: false

    },

    token: {
        type: String

    },

},

    {
        timestamps: true,
    }

);

usuarioSchema.pre('save', async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
   return await bcrypt.compare(passwordFormulario, this.password)

}

const Usuario = mongoose.model("Usuario", usuarioSchema);


export default Usuario