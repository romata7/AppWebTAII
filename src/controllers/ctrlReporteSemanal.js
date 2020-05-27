var Bus = require('../models/bus')
var Venta = require('../models/venta')
var Ingreso = require('../models/ingreso')

const ctrlReporteSemanal = {}

ctrlReporteSemanal.listar = async (req, res) => {
    //determinar los dias correspondientes a la semana
    var fecha = new Date() //fecha actual  
    // fecha.setDate(fecha.getDate() - 3)
    var semana = []
    var buses = []
    var ingresos = []
    var ventas = []
    try {
        if (fecha.getDay() == 0) {
            var fecha_aux = new Date(fecha)
            for (var i = 6; i >= 0; i--) {
                fecha_aux.setDate(fecha.getDate() - i)
                semana.push(new Date(fecha_aux))
            }
        } else {
            var fecha_aux = new Date(fecha)
            for (var i = 1; i < 8; i++) {
                fecha_aux.setDate(fecha.getDate() - fecha.getDay() + i)
                semana.push(new Date(fecha_aux))
            }
        }
        buses = await Bus.find({ 'log.activo': true }).sort({ nro: 1 })
        var finicio = semana[0]
        finicio.setHours(0)
        finicio.setMinutes(0)
        finicio.setSeconds(0)
        finicio.setMilliseconds(0)
        var ffin = semana[6]
        ffin.setHours(23)
        ffin.setMinutes(59)
        ffin.setSeconds(59)
        ffin.setMilliseconds(999)
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
    res.render('reporte_semanal', { buses, ingresos, ventas, semana })
}

module.exports = ctrlReporteSemanal
