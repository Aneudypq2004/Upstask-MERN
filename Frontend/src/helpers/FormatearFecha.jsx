const FormatearFecha = (fecha) => {
    const nuevaFecha = new Date(fecha?.split('T')[0]?.split('-'))


    const opciones = {
        weedkay :'long',
        month : "long",
        year: "numeric",
        day: "numeric"
    }

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
 
}

export default FormatearFecha