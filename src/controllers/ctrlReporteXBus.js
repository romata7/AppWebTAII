const Bus = require('../models/bus')
const Venta = require('../models/venta')
const Ingreso = require('../models/ingreso')

const ctrlReposrteXBus = {}

ctrlReposrteXBus.listar = async (req, res) => {
    var buses = []
    try {
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
    } catch (error) {
        console.log(error)
    }
    res.render('reporte_x_bus', { buses })
}
ctrlReposrteXBus.cargar = async (req, res) => {
    var f1 = req.body.f1.split('-')
    f1 = new Date(f1[0], f1[1] - 1, f1[2], 00, 00, 00, 000)
    var f2 = req.body.f2.split('-')
    f2 = new Date(f2[0], f2[1] - 1, f2[2], 23, 59, 59, 999)
    var hoy = new Date()

    var bus = JSON.parse(req.body.bus)

    var ingresos = []
    var ventas = []
    try {
        ingresos = await Ingreso.find({
            'bus.nro': bus.nro,
            'log.activo': true,
            'log.fecha': {
                $gte: f1,
                $lt: f2
            }
        })
        ventas = await Venta.find({
            'bus.nro': bus.nro,
            'log.activo': true,
            'log.fecha': {
                $gte: f1,
                $lt: f2
            }
        })
    } catch (error) {
        console.log(error)
    }

    res.render('_reporte_x_bus', {
        ingresos,
        ventas,
        bus,
        f1: f1,
        f2: f2,
        hoy: hoy,
    })
}
ctrlReposrteXBus.voucher = async (req, res) => {
    var f1 = req.body.f1.split('-')
    f1 = new Date(f1[0], f1[1] - 1, f1[2], 00, 00, 00, 000)
    var f2 = req.body.f2.split('-')
    f2 = new Date(f2[0], f2[1] - 1, f2[2], 23, 59, 59, 999)
    var hoy = new Date()

    var bus = JSON.parse(req.body.bus)

    var ingresos = []
    var ventas = []

    try {
        ingresos = await Ingreso.find({
            'bus.nro': bus.nro,
            'log.activo': true,
            'log.fecha': {
                $gte: f1,
                $lt: f2
            }
        })
        ventas = await Venta.find({
            'bus.nro': bus.nro,
            'log.activo': true,
            'log.fecha': {
                $gte: f1,
                $lt: f2
            }
        })
    } catch (error) {
        console.log(error)
    }

    res.render('reporte_x_bus_voucher', {
        ingresos, ventas,
        bus: bus,
        f1: f1,
        f2: f2,
        hoy: hoy,
    })
}

module.exports = ctrlReposrteXBus