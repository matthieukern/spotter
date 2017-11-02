import mongoose, { Schema } from 'mongoose';

const spotSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: [Number],
      index: '2dsphere',
      required: true
    },
    photo: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

spotSchema.methods = {
  view() {
    return {
      id: this.id,
      user: this.user.view(),
      location: this.location,
      photo: this.photo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
};

const model = mongoose.model('Spot', spotSchema);

export const schema = model.schema;
export default model;
