import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'

const registrar = async (req, res) => {

    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
        const error = new Error('El usuario ya existe')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()
        res.json({ usuarioAlmacenado })
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email })
    console.log(usuario)
    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }
    if (!usuario.confirmado) {
        const error = new Error('Usuario no confirmado')
        return res.status(403).json({ msg: error.message })
    }
    if(await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error('Contraseña incorrecta')
        return res.status(401).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error('Token inválido')
        return res.status(403).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    console.log('entrando a la func')
    const {email} = req.body
    const usuario = await Usuario.findOne({ email })
    console.log(usuario)
    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        res.json({ msg: 'Se ha enviado un correo para restablecer la contraseña' })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params
    const tokenValido = await Usuario.findOne({ token })
    if(!tokenValido) {
        const error = new Error('Token inválido')
        return res.status(404).json({ msg: error.message })
    } else {
        res.json({ msg: 'Token válido' })
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    const usuario = await Usuario.findOne({ token })
    if(usuario) {
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({ msg: 'Contraseña actualizada con exito' })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('Token inválido')
        return res.status(404).json({ msg: error.message})
    }
}

const perfil = async (req, res) => {
    const {usuario} = req
    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}