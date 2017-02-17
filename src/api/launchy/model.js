import mongoose, { Schema } from 'mongoose'

const launchySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  monitor: {
    type: Schema.ObjectId,
    ref: 'Monitor'
  }
}, {
  timestamps: true
})

launchySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      monitor: this.monitor.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Launchy', launchySchema)

export const schema = model.schema
export default model
