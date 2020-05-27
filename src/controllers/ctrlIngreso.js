const key = (require('../Config/keys')).key
const Bus = require('../models/bus')
var Ingreso = require('../models/ingreso')
const Venta = require('../models/venta')

const ctrlIngreso = {}

ctrlIngreso.listar = async (req, res) => {
    var ingresos = []
    var buses = []
    try {
        ingresos = await Ingreso.find({ 'log.activo': true })
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
    } catch (error) {
        console.log(error)
    }
    res.render('ingresos', {
        ingresos,
        buses,
        pass: key,
    })
}
ctrlIngreso.agregar = async (req, res) => {
    var ingreso = null
    var saldo_actual = 0
    try {
        ingreso = new Ingreso(req.body)
        ingreso.bus = JSON.parse(req.body.bus)
        await ingreso.save()

        ingresos = await Ingreso.find({ 'log.activo': true, 'bus.nro': ingreso.bus.nro })
        var total_i = 0
        for (var i = 0; i < ingresos.length; i++) {
            total_i = total_i + ingresos[i].monto
        }
        ventas = await Venta.find({ 'log.activo': true, 'bus.nro': ingreso.bus.nro })
        var total_v = 0
        for (var i = 0; i < ventas.length; i++) {
            total_v = total_v + ventas[i].monto
        }
        saldo_actual = total_i - total_v
    } catch (error) {
        console.log(error)
    }
    res.render('ingreso_voucher', { ingreso, saldo_actual })
}
ctrlIngreso.eliminar = async (req, res) => {
    try {
        await Ingreso.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
        var ingreso = new Ingreso(req.body)
        ingreso.bus = JSON.parse(req.body.bus)
        ingreso.log.activo = false
        ingreso.log.evento = 'ELIMINADO'
        ingreso.log.origen = req.params._id
        await ingreso.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/ingresos')
}
ctrlIngreso.modificar = async (req, res) => {
    try {
        await Ingreso.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
        var ingreso = new Ingreso(req.body)
        ingreso.bus = JSON.parse(req.body.bus)
        ingreso.log.activo = true
        ingreso.log.evento = 'MODIFICADO'
        ingreso.log.origen = req.params._id
        await ingreso.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/ingresos')
}

module.exports = ctrlIngreso