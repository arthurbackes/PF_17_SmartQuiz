const mongoose = require("mongoose");

const ListSchema = mongoose.Schema(
    {
        user_id: {
            type: BigInt,
            default: 1,
        },
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        content: {
            type: [
                {
                    _id: {
                        type: mongoose.Schema.Types.ObjectId,
                        default: () => new mongoose.Types.ObjectId(),
                    },
                    key: { type: String, required: true },
                    value: { type: String, required: false },
                },
            ],
            default: [
                {
                    key: "key",
                    value: "value",
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("List", ListSchema);
