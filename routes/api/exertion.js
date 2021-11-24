const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { 
  check, 
  validationResult 
} = require('express-validator');

const User = require('../../models/User');
const Exertion = require('../../models/Exertion');
const { 
  hourToSeconds,
  secToHour,
  mainExertionResponse,
  populateChildren
} = require('../../utils/utils')

// @route     GET api/exertion/main
// @desc      Get current user's all main exertions
// @access    Private
router.get(
  '/main',
  auth,
  async (req, res) => {
    let user = req.user
    let exertions = await user.mainExertions;
    const totalTargetHoursLeft 
      = await user.totalTargetHoursLeft;
    
    // simplify the data
    exertions = mainExertionResponse(exertions)

    return res.status(200).json({ 
      exertions: exertions,
      totalTargetHoursLeft: totalTargetHoursLeft
    })
  }
)

// @route     GET api/exertion/all
// @desc      Get current user's all exertions
// @access    Private
router.get(
  '/all',
  auth,
  async (req, res) => {
    let user = req.user
    let exertions = await user.allExertions;
    const totalTargetHoursLeft 
      = await user.totalTargetHoursLeft;
    
    const totalTargetDuration = await user.totalTargetDuration
    const totalTargetHours = secToHour(totalTargetDuration)
    const totalFinishedDuration = await user.totalFinishedDuration
    const totalFinishedHours = secToHour(totalFinishedDuration)
    
    // simplify the data
    exertions = mainExertionResponse(exertions)

    return res.status(200).json({ 
      exertions: exertions,
      totalTargetHoursLeft,
      totalFinishedDuration,
      totalFinishedHours,
      totalTargetDuration, 
      totalTargetHours
    })
  }
)

// @route     GET api/exertion/:exertion_id
// @desc      Get the exertion by id
// @access    Private
router.get(
  '/:exertion_id',
  auth,
  async (req, res) => {
    const exertion_id = req.params.exertion_id
    const exertion = await Exertion.findById(exertion_id);
    if (!exertion) {
      return res.status(400).json(
        {msg: "NOT_FOUND"}
      )
      res.end() // without this, the code below runs
    }

    totalTargetHoursLeft 
      = exertion.targetHoursLeft

    return res.status(200).json({ 
      exertion: exertion,
      totalTargetHoursLeft: totalTargetHoursLeft
    })
  }
)

// @route     PUT api/exertion/:exertion_id
// @desc      Update the exertion by id
// @access    Private
router.put(
  '/:exertion_id',
  auth,
  async (req, res) => {
    const exertion_id = req.params.exertion_id
    const changes = req.body
    if (req.body.targetHours) {
      changes.targetDuration 
        = hourToSeconds(changes.targetHours)
    }
    try {
      Exertion.findByIdAndUpdate(
        (exertion_id),
        changes,
        { 
          runValidators: true,
          new: true
        },
        function(err, updatedExertion) {
          if (err) { res.send(err.errors) }
          const totalTargetHoursLeft 
            = updatedExertion.targetHoursLeft
          return res.status(200).json({
            msg: "UPDATE_SUCCESS",
            updatedExertion,
            totalTargetHoursLeft
          })
        }
      )
    } catch (error) {
      return res.status(400).json({error})
    }
  }
)

// @route     DELETE api/exertion/:exertion_id
// @desc      Remove the exertion by id
// @access    Private
router.delete(
  '/:exertion_id',
  auth,
  async (req, res) => {
    const exertion_id = req.params.exertion_id
    Exertion.findByIdAndRemove(
      exertion_id,
      function(err, doc) {
        if (err) { res.send(err) }
        doc.deleteSubExertions()
        return res.status(200).json({
          msg: "DELETE_SUCCESS"
        })
      }
    );
  }
)

// @route     POST api/exertion/create
// @desc      Create user's main exertion
// @access    Private
router.post(
  '/create',
  [
    auth,
    [
      check('name', 'Exertion name is required')
        .not()
        .isEmpty(),
      check('skill', 
            'Skill for this exertion is required (You can only put one skill. This is in order to help you focus on one thing at a time.')
        .not()
        .isEmpty(),
      check('targetHours', 'Set the target duration')
        .isNumeric({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }

    const { name, skill, targetHours } = req.body;
    
    // Build Exertion object
    const exertionFields = {};
    exertionFields.name = name;
    exertionFields.skill = skill;
    if (targetHours) exertionFields.targetDuration = hourToSeconds(targetHours);

    try {
      const user = req.user;
      const newExertion = await user.createNewExertion(exertionFields);
      
      return res.status(200).json({ 
        msg: "CREATE_SUCCESS", type: "EXERTION",
        newExertion: { 
          name: newExertion.name, 
          skill: newExertion.skill 
        }
      });
    } catch (err) {
      return res.status(500).json({
        errors: err
      })
    };
  }
)

// @route     POST api/exertion/create-part-exertion
// @desc      Create part exertions
// @access    Private
router.post(
  '/create-part-exertion',
  [
    auth,
    [
      check('name', 'Exertion name is required')
        .not()
        .isEmpty(),
      check('skill', 
            'Skill for this exertion is required (You can only put one skill. This is in order to help you focus on one thing at a time.')
        .not()
        .isEmpty(),
      check('targetHours', 'Set the target hours')
        .isNumeric({ min: 0 }),
      check('mainExertionId', 'There must be a main exertion')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }

    const { name, skill, targetHours, mainExertionId } = req.body;

    const mainExertion = await Exertion.findById(mainExertionId)

    const targetHoursLeft 
      = await mainExertion.targetHoursLeft

    // calculate mainExertion's available hours
    if (targetHoursLeft < targetHours) {
      return res.status(400).json({ 
        msg: "CREATE_ERROR", type: "PART_EXERTION",
        defail: `target hours exceeded available hours by ${targetHours - targetHoursLeft}`
      });
    }
    
    // Build Exertion object
    const exertionFields = {};
    exertionFields.name = name;
    exertionFields.skill = skill;
    exertionFields.targetDuration = hourToSeconds(targetHours);

    try {
      const newExertion 
        = await mainExertion.createSubExertion(exertionFields);
      
      return res.status(200).json({ 
        msg: "CREATE_SUCCESS", type: "PART_EXERTION"
      });
    } catch (err) {
      return res.status(500).json({
        errors: err
      })
    };
  }
)

// @route     PUT /api/exertion/:exertionId/operate-finished-duration
// @desc      Operate on finishedDuration
// @access    Private
router.put(
  '/:exertionId/operate-finished-duration',
  auth,
  async (req, res) => {
    const exertionId = req.params.exertionId
    const changes = req.body
    const operationType = changes.operationType
    const payload = parseInt(changes.payload)
    try {
      Exertion.findByIdAndUpdate(
        (exertionId),
        { operationType, payload },
        { 
          runValidators: true,
          new: true
        },
        async function(err, updatedExertion) {
          if (err) { res.send(err.errors) }
          const updateResult = await updatedExertion.updateFinishedDuration(
            { operationType, payload }
          )
          if (updateResult.result === "FAIL") {
            return (
              res
              .status(400)
              .json(updateResult.detail.message)
            )
          }
          return res.status(200).json({
            updateResult,
          })
        }
      )
    } catch (error) {
      return res.status(400).json({error})
    }
  }
)


module.exports = router;