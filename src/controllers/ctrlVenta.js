const key = (require('../Config/keys')).key
const Bus = require('../models/bus')
const Venta = require('../models/venta')
const Ingreso = require('../models/ingreso')

const ctrlVenta = {}

ctrlVenta.listar = async (req, res) => {
    var ventas = []
    var buses = []
    try {
        ventas = await Venta.find({ 'log.activo': true })
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
    } catch (error) {
        console.log(error)
    }

    res.render('ventas', {
        ventas,
        buses,
        pass: key,
    })
}
ctrlVenta.agregar = async (req, res) => {
    var venta = null
    var saldo_actual = 0

    try {
        venta = new Venta(req.body)
        venta.bus = JSON.parse(req.body.bus)
        await venta.save()

        ingresos = await Ingreso.find({ 'log.activo': true, 'bus.nro': venta.bus.nro })
        var total_i = 0
        for (var i = 0; i < ingresos.length; i++) {
            total_i = total_i + ingresos[i].monto
        }
        ventas = await Venta.find({ 'log.activo': true, 'bus.nro': venta.bus.nro })
        var total_v = 0
        for (var i = 0; i < ventas.length; i++) {
            total_v = total_v + ventas[i].monto
        }
        saldo_actual = total_i - total_v
    } catch (error) {
        console.log(error)
    }

    res.render('venta_voucher', { venta, saldo_actual })
}
ctrlVenta.eliminar = async (req, res) => {
    try {
        await Venta.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
        var venta = new Venta(req.body)
        venta.bus = JSON.parse(req.body.bus)
        venta.log.activo = false
        venta.log.evento = 'ELIMINADO'
        venta.log.origen = req.params._id
        venta.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/ventas')
}
ctrlVenta.modificar = async (req, res) => {
    try {
        await Venta.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
        var venta = new Venta(req.body)
        venta.bus = JSON.parse(req.body.bus)
        venta.log.activo = true
        venta.log.evento = 'MODIFICADO'
        venta.log.origen = req.params._id
        venta.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/ventas')
}

module.exports = ctrlVenta