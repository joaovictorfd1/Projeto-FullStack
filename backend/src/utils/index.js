const Counter = require('../models/counter');

async function getNextSequence(sequenceName) {
  const counterDoc = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return counterDoc.sequence_value;
}

module.exports = getNextSequence;