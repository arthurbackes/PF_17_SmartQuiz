const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
    {
        // Identifiant de l'utilisateur associé à cette liste
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Associer avec un utilisateur
            ref: "User",
            required: false,
        },
        // Nom de la liste
        name: {
            type: String,
            required: [true, "Veuillez fournir un nom pour la liste"],
            trim: true, // Supprime les espaces au début et à la fin
            maxlength: [100, "Le nom de la liste ne peut pas dépasser 100 caractères"],
        },
        // Contenu de la liste (tableau d'objets clé-valeur)
        content: {
            type: [
                {
                    key: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: [50, "La clé ne peut pas dépasser 50 caractères"]
                    },
                    value: {
                        type: String,
                        required: false,
                        trim: true,
                        maxlength: [200, "La valeur ne peut pas dépasser 200 caractères"]
                    },
                },
            ],
            default: [], // Initialiser avec un tableau vide par défaut
        },
    },
    {
        timestamps: true, // Gère les champs createdAt et updatedAt
    }
);

module.exports = mongoose.model("List", ListSchema);
