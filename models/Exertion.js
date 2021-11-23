const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { secToHour } = require('../utils/utils');

// Exertion
// schema
const ExertionSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  targetDuration: { // seconds
    type: Number,
    required: true,
    min: 0,
    max: 72000000
  },
  finishedDuration: { // seconds
    type: Number,
    default: 0,
    min: 0
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'exertion'
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'exertion'
  }],
  isFinished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  depth: {
    type: Number,
    max: 10,
    default: 0
  }
}
);

ExertionSchema.set('toObject', { 
  getters: true, 
  virtuals: true, 
  transform: true 
});
ExertionSchema.set('toJSON', { 
  getters: true, 
  virtuals: true,
  transform: true 
});

// virtuals
ExertionSchema.virtual('targetDurationLeft')
  .get(function() {
    return this.targetDuration - this.finishedDuration
  })

ExertionSchema.virtual('targetHoursLeft')
  .get(
    function() {
      return secToHour(this.targetDurationLeft)
    }
  );

ExertionSchema.virtual('finishedHours')
  .get(function() {
    return secToHour(this.finishedDuration);
  })

// instance methods
ExertionSchema.method(
  'createSubExertion',
  async function (subExertionFields) {
    const newExertion 
      = new Exertion(subExertionFields);
    newExertion.parent = this;
    newExertion.depth = this.depth + 1;
    newExertion.owner = this.owner;
    newExertion.save();
    this.children.push(newExertion);
    this.save();
    
    return newExertion
  }
)

ExertionSchema.method(
  'deleteSubExertions',
  async function () {
    const exertion = this
    let childrenDeletion = "DELETE_SUCCESS";
    if (exertion.children.length) {
      childrenDeletion = await this.children.forEach(async child => {
        try {
          const Exertion = require('./Exertion');
          Exertion.findByIdAndRemove(
            child._id,
            function(err, doc) {
              if (err) { childrenDeletion = "DELETE_FAILED" }
              doc.deleteSubExertions()
              childrenDeletion = "DELETE_SUCCESS"
            }
          )
        } catch (err) {
          childrenDeletion = "DELETE_FAILED"
        }
        return childrenDeletion
      })
    }
    return childrenDeletion
  }
)

ExertionSchema.method(
  'updateFinishedDuration',
  async function ({operationType, payload}) {
    try {
      if (operationType === "addition"){
        const afterDuration 
          = this.finishedDuration + payload
        if (this.targetDuration >= afterDuration) {
          this.finishedDuration += payload
        } else if (
          this.targetDuration < afterDuration
          ) {
          this.finishedDuration = this.targetDuration
        }
      } else {
        this.finishedDuration -= payload
      }
      //  if it has parent, update the parent also
      let parentUpdateResult
      if (this.parent) {
        const parentExertion = await Exertion.findById(this.parent._id)
        parentUpdateResult = await parentExertion.updateFinishedDuration(
          {operationType, payload}
        )
      }
      const saved = await this.save()
        .then((doc) => ({
          result: "UPDATE_SUCCESS", 
          detail: doc,
          ...(this.parent && { parentUpdateResult })
        }))
        .catch((err) => ({result: "FAIL", detail: err}))
      return saved
    } catch (err) {
      return err
    }
  }
)


// export
module.exports = Exertion = mongoose.model('exertion', ExertionSchema);