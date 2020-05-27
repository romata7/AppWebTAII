const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const ingresoSchema = mongoose.Schema({
    bus: {},
    monto: {
        type: Number,
        require: true
    },
    aportante: {
        type: String,
        require: true,
        uppercase: true,
    },
    empresa: {
        type: String,
        require: true,
        uppercase: true,
    },
    referencia: {
        type: String,
        require: true,
        uppercase: true,
    },
    log: {
        evento: {
            type: String,
            enum: ['AGREGADO', 'MODIFICADO', 'ELIMINADO'],
            uppercase: true,
            default: "AGREGADO"
        },
        activo: {
            type: Boolean,
            default: function () {
                if (this.evento == 'ELIMINADO') return false;
                else return true;
            }
        },
        fecha: {
            type: Date,
            default: Date.now
        },
        origen: Number
    }
})
ingresoSchema.plugin(autoIncrement.plugin, {
    model: 'Ingreso',
    startAt: 1,
    incrementBy: 1
})
module.exports = mongoose.model('Ingreso', ingresoSchema)