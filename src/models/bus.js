const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

const busSchema = mongoose.Schema({
    nro: {
        type: Number,
        require: true,
        min: 0
    },
    placa: {
        type: String,
        require: true,
        uppercase: true,
        maxlength: 7,
        minlength: 7
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
busSchema.plugin(autoIncrement.plugin, {
    model: 'Bus',
    startAt: 1,
    incrementBy: 1
})
module.exports = mongoose.model('Bus', busSchema)