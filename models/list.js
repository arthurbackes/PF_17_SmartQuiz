const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Veuillez fournir un nom"],
        },
        content: {
            type: [
                {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        default: () => new mongoose.Types.ObjectId(),
                    },
                    key: { type: String, required: true },
                    value: { type: String, required: true },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.List || mongoose.model("List", ListSchema);
