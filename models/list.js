const mongoose = require("mongoose");

const ListSchema = mongoose.Schema(
    {
        user_id: {
            type: BigInt,
            default: 1
        },
        name: {
            type: String,
            required: [true, "Please provide a name"], // Correction du message d'erreur
        },
        content: {
            type: [
                {
                    key: { type: String, required: true }, // Exemples de champs dans chaque objet
                    value: { type: String, required: false }, 
                }
            ],
            default: [], // Initialiser avec un tableau vide par défaut si aucune valeur n'est fournie
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("List", ListSchema);