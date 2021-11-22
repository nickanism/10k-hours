const mongoose = require('mongoose');
const { CURSOR_FLAGS } = require('mongoose/node_modules/mongodb');
const Schema = mongoose.Schema;

const populateChildren = require('../utils/utils');
const Exertion = require('./Exertion');

// User
// schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  dateOfBirth: {
    type: Date
  },
  level: {
    type: Number,
    default: 0
  }
}
);

// virtuals
UserSchema.virtual('mainExertions')
  .get(
    async function() {
      let exertions 
        = await Exertion
          .find({ owner: this, depth: 0 })
          .populate('children')
      
      return (
        exertions.length > 0 ? exertions : []
      )
    }
  )
UserSchema.virtual('allExertions')
.get(
  async function() {
    let exertions 
      = await Exertion
        .find({ owner: this, depth: 0 })
        .populate({
          path: 'children',
          populate: {
            path: 'children',
            populate: {
              path: 'children',
              populate: {
                path: 'children',
                populate: {
                  path: 'children',
                  populate: {
                    path: 'children'
                  }
                }
              }
            }
          }
        })
    return (
      exertions.length > 0 ? exertions : []
    )
  }
)
UserSchema.virtual('totalTargetHoursLeft')
  .get(
    async function() { 
      const mainExertions = await this.mainExertions
      total = mainExertions
        .filter(exertion => !exertion.parent)
        .map(exertion => exertion.targetHoursLeft)
        .reduce((acc, curr) => (acc + curr), 0)
      return total
    }
  );

// instance methods
UserSchema.method(
  'createNewExertion',
  function (newExertionFields) {
    newExertionFields.owner = this
    const newExertion 
      = new Exertion(newExertionFields);
    newExertion.save();
    return newExertion;
  }
)

// UserSchema.set('toJSON', { virtuals: true });
// UserSchema.set('toObject', { virtuals: true });

// export
module.exports = User = mongoose.model('user', UserSchema);