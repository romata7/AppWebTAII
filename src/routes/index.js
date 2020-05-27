const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

//Controllers
const ctrlBus = require('../controllers/ctrlBus')
const ctrlVenta = require('../controllers/ctrlVenta')
const ctrlIngreso = require('../controllers/ctrlIngreso')
const ctrlHistorial = require('../controllers/ctrlHistorial')
const ctrlReposrteXBus = require('../controllers/ctrlReporteXBus')
const ctrlResumenGlobal = require('../controllers/ctrlResumenGlobal')
const ctrlReporteSemanal = require('../controllers/ctrlReporteSemanal')
const ctrlResumen_x_Fechas = require('../controllers/ctrlResumen_x_Fechas')

//news
var Bus = require('../models/bus')
var Venta = require('../models/venta')
var Ingreso = require('../models/ingreso')

//Buses
router.get('/buses', ctrlBus.listar)
router.post('/bus/agregar', ctrlBus.agregar)
router.post('/bus/eliminar/:_id', ctrlBus.eliminar)
router.post('/bus/modificar/:_id', ctrlBus.modificar)
//Fin Buses

//Ingresos
router.get('/ingresos', ctrlIngreso.listar)
router.post('/ingreso/agregar', ctrlIngreso.agregar)
router.post('/ingreso/eliminar/:_id', ctrlIngreso.eliminar)
router.post('/ingreso/modificar/:_id', ctrlIngreso.modificar)
//Fin Ingresos

//Ventas
router.get('/ventas', ctrlVenta.listar)
router.post('/venta/agregar', ctrlVenta.agregar)
router.post('/venta/eliminar/:_id', ctrlVenta.eliminar)
router.post('/venta/modificar/:_id', ctrlVenta.modificar)
// Fin Ventas

//Historial
router.get('/historial', ctrlHistorial.listar)
//Fin Historial

// Reporte por Bus
router.get('/reporte_x_bus', ctrlReposrteXBus.listar)
router.post('/_reporte_x_bus', ctrlReposrteXBus.cargar)
router.post('/reporte_x_bus_voucher', ctrlReposrteXBus.voucher)
// Fin Reporte por Bus

// Reporte Semanal
router.get('/reporte_semanal', ctrlReporteSemanal.listar)
// Reporte Semanal

// Resumen por Fechas
router.get('/resumen_x_fechas', ctrlResumen_x_Fechas.listar)
router.post('/resumen_x_fechas', ctrlResumen_x_Fechas.listarPost)
// Fin Resumen por Fechas

//Resumen Global
router.get('/resumen_global', ctrlResumenGlobal.listar)
router.get('/resumen', async (req, res) => {
    const hoy = new Date()
    const finicio = new Date(hoy)
    finicio.setHours(0)
    finicio.setMinutes(0)
    finicio.setSeconds(0)
    finicio.setMilliseconds(0)
    const ffin = new Date(hoy)
    ffin.setHours(23)
    ffin.setMinutes(59)
    ffin.setSeconds(59)
    ffin.setMilliseconds(999)
    var fechas = []
    fechas.push(finicio)
    fechas.push(ffin)
    var buses = await Bus.find({ 'log.activo': true })
    var ingresos = await Ingreso.find({
        'log.activo': true,
        'log.fecha': {
            $gte: finicio,
            $lte: ffin
        }
    })
    var ventas = await Venta.find({
        'log.activo': true,
        'log.fecha': {
            $gte: finicio,
            $lte: ffin
        }
    })
    res.render('resumen', { fechas, buses, ingresos, ventas })
})
router.post('/resumen', async (req, res) => {
    console.log(req.body)
    var f1 = req.body.f1.split('-')
    f1 = new Date(f1[0], f1[1] - 1, f1[2], 00, 00, 00, 000)
    var f2 = req.body.f2.split('-')
    f2 = new Date(f2[0], f2[1] - 1, f2[2], 23, 59, 59, 999)
    finicio = new Date(f1)
    ffin = new Date(f2)
    var fechas = []
    fechas.push(finicio)
    fechas.push(ffin)
    var buses = await Bus.find({ 'log.activo': true })
    var ingresos = await Ingreso.find({
        'log.activo': true,
        'log.fecha': {
            $gte: finicio,
            $lte: ffin
        }
    })
    var ventas = await Venta.find({
        'log.activo': true,
        'log.fecha': {
            $gte: finicio,
            $lte: ffin
        }
    })
    res.render('resumen', { fechas, buses, ingresos, ventas })
})
//Fin Resumen Global

router.get('/*', (req, res) => {
    res.redirect('/ventas')
})

module.exports = router