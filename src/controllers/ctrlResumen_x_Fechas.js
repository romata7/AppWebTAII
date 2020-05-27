var Bus = require('../models/bus')
var Venta = require('../models/venta')
var Ingreso = require('../models/ingreso')

const ctrlResumen_x_Fechas = {}

ctrlResumen_x_Fechas.listar = async (req, res) => {
    var hoy = new Date()
    var finicio = new Date(hoy)
    finicio.setDate(1)
    finicio.setHours(0)
    finicio.setMinutes(0)
    finicio.setSeconds(0)
    finicio.setMilliseconds(0)
    var ffin = new Date(hoy)
    ffin.setHours(23)
    ffin.setMinutes(59)
    ffin.setSeconds(59)
    ffin.setMilliseconds(999)

    var fechas = []

    var faux = new Date(finicio)
    while (faux < ffin) {
        fechas.push(new Date(faux))
        faux.setDate(faux.getDate() + 1)
    }


    var buses = []
    var ingresos = []
    var ventas = []

    try {
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
        ingresos = await Ingreso.find({
            'log.activo': true,
            'log.fecha': {
                $gte: finicio,
                $lte: ffin
            }
        })
        ventas = await Venta.find({
            'log.activo': true,
            'log.fecha': {
                $gte: finicio,
                $lte: ffin
            }
        })
    } catch (error) {
        console.log(error)
    }
    res.render('resumen_x_fechas', { fechas, buses, ingresos, ventas })
}
ctrlResumen_x_Fechas.listarPost = async (req, res) => {
    var f1 = req.body.f1.split('-')
    f1 = new Date(f1[0], f1[1] - 1, f1[2], 00, 00, 00, 000)
    var f2 = req.body.f2.split('-')
    f2 = new Date(f2[0], f2[1] - 1, f2[2], 23, 59, 59, 999)
    finicio = new Date(f1)
    ffin = new Date(f2)
    var fechas = []
    var faux = new Date(finicio)
    while (faux < ffin) {
        fechas.push(new Date(faux))
        faux.setDate(faux.getDate() + 1)
    }

    var buses = []
    var ingresos = []
    var ventas = []

    try {
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
        ingresos = await Ingreso.find({
            'log.activo': true,
            'log.fecha': {
                $gte: finicio,
                $lte: ffin
            }
        })
        ventas = await Venta.find({
            'log.activo': true,
            'log.fecha': {
                $gte: finicio,
                $lte: ffin
            }
        })
    } catch (error) {
        console.log(error)
    }

    res.render('resumen_x_fechas', { fechas, buses, ingresos, ventas })
}

module.exports = ctrlResumen_x_Fechas