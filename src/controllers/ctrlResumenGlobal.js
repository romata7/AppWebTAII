var Bus = require('../models/bus')
var Venta = require('../models/venta')
var Ingreso = require('../models/ingreso')

const ctrlResumenGlobal = {}

ctrlResumenGlobal.listar = async (req, res) => {

    var buses = []
    var ingresos = []
    var ventas = []
    try {
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
        ingresos = await Ingreso.find({ 'log.activo': true })
        ventas = await Venta.find({ 'log.activo': true })
    } catch (error) {
        console.log(error)
    }

    res.render('resumen_global', { buses, ingresos, ventas })
}


module.exports = ctrlResumenGlobal