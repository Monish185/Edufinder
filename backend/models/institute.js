const mongoose = require("mongoose");

const instituteSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },

      category: {
        type: String,
      },

      address: {
        type: String,
      },

      city: {
        type: String,
      },

      state: {
        type: String,
      },

      image: {
        type: String,
        required: true,
      },

      fees: {
        type: Number,
        min: 0,
      },

      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      // GEO LOCATION
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number],

          required: true,

          validate: {
            validator: function (v) {
              return v.length === 2;
            },

            message:
              "Coordinates must contain longitude and latitude",
          },
        },
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    {
      timestamps: true,
    }
  );

instituteSchema.index({
  location: "2dsphere",
});

const Institute = mongoose.model(
  "Institute",
  instituteSchema
);

module.exports = Institute;