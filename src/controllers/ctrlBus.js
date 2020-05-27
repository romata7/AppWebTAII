const Bus = require('../models/bus')
const key = (require('../Config/keys')).key

const ctrlBus = {}

ctrlBus.listar = async (req, res) => {
    var buses = []
    try {
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: -1 })
    } catch (error) {
        console.log(error)
    }
    res.render('buses', { buses, pass: key })
}
ctrlBus.agregar = async (req, res) => {
    try {
        var bus = new Bus(req.body)
        var nros = await Bus.find({ nro: req.body.nro, 'log.activo': true })
        var placas = await Bus.find({ placa: req.body.placa, 'log.activo': true })
        if (nros == 0 && placas == 0)
            await bus.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/buses')
}
ctrlBus.eliminar = async (req, res) => {
    try {
        await Bus.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
        var bus = new Bus(req.body)
        bus.log.activo = false
        bus.log.evento = 'ELIMINADO'
        bus.log.origen = req.params._id
        await bus.save()
    } catch (error) {
        console.log(error)
    }
    res.redirect('/buses')
}
ctrlBus.modificar = async (req, res) => {
    try {
        //caso 1: mismo nro distinta placa
        var bus_source = await Bus.findById(req.params._id)
        if (bus_source.nro == req.body.nro) {
            //las placas deben ser distintas
            var placas = await Bus.find({ placa: req.body.placa, 'log.activo': true })
            //La nueva placa no debe existir
            if (bus_source.placa != req.body.placa && placas == 0) {
                await Bus.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
                var bus = new Bus(req.body)
                bus.log.activo = true
                bus.log.evento = 'MODIFICADO'
                bus.log.origen = req.params._id
                await bus.save()
            }
        } else {
            //nros distintos pero la misma placa de quien estamos modificando
            var nros = await Bus.find({ nro: req.body.nro, 'log.activo': true })
            //el nro no debe existir
            if (bus_source.placa == req.body.placa && nros == 0) {
                await Bus.findOneAndUpdate({ _id: req.params._id }, { 'log.activo': false })
                var bus = new Bus(req.body)
                bus.log.activo = true
                bus.log.evento = 'MODIFICADO'
                bus.log.origen = req.params._id
                await bus.save()
            }
        }
    } catch (error) {
        console.log(error)
    }
    res.redirect('/buses')
}

module.exports = ctrlBus