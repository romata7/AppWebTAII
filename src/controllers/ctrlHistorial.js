var Bus = require('../models/bus')
var Venta = require('../models/venta')
var Ingreso = require('../models/ingreso')

const ctrlHistorial = {}

ctrlHistorial.listar = async (req, res) => {
    var ingresos = []
    var ventas = []
    var buses = []
    try {
        ingresos = await Ingreso.find()
        ventas = await Venta.find()
        buses = await Bus.find()
    } catch (error) {
        console.log(error)
    }
    res.render('historial', { ingresos, ventas, buses })
}

module.exports = ctrlHistorial