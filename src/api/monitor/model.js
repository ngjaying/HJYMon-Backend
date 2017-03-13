import mongoose, { Schema } from 'mongoose'

const monitorSchema = new Schema({
  url: {
		type: String,
		required: true,
		match: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
    trim: true
  },
	jqpath: {
		type: String,
		required: true,
		minlength: 1,
    trim: true
	},
  title: String,
  value: String,
	oldMD5: String,
  launchies: [{
    type: Schema.ObjectId,
    ref: 'launchy'
  }]
}, {
  timestamps: true
})

monitorSchema.index({url: 1, jqpath: 1}, {unique: true});

monitorSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      url: this.url,
      jqpath: this.jqpath,
      title: this.title,
      value: this.value,
      oldMD5: this.oldMD5,
      launchies: this.launchies
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Monitor', monitorSchema)

export const schema = model.schema
export default model
