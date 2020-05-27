const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const ventaSchema = mongoose.Schema({
    bus: {},
    monto: {
        type: Number,
        require: true,
        min: 0
    },
    galones: {
        type: Number,
        require: true,
        min: 0
    },
    costo_x_galon: {
        type: Number,
        default: function () {
            return (parseFloat(this.monto) / parseFloat(this.galones)).toFixed(2)
        }
    },
    conductor: {
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
ventaSchema.plugin(autoIncrement.plugin, {
    model: 'Venta',
    startAt: 1,
    incrementBy: 1
})
module.exports = mongoose.model('Venta', ventaSchema)