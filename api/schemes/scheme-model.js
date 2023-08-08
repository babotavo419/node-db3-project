const db = require('../../data/db-config.js'); // Update the path according to your project structure.

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'asc');
}

async function findById(scheme_id) {
  const results = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_name', 'st.*')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc');

  if (results.length) {
    const steps = results.map(step => ({
      step_id: step.step_id,
      step_number: step.step_number,
      instructions: step.instructions
    }));

    const filteredSteps = steps.filter(step => step.step_id !== null);

    return {
      scheme_id: Number(scheme_id), // Convert the scheme_id to a number
      scheme_name: results[0].scheme_name,
      steps: steps
    };    
  } else {
    return null;
  }
}

function findSteps(scheme_id) {
  return db('steps as st')
    .join('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .where('st.scheme_id', scheme_id)
    .orderBy('st.step_number');
}

function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(() => {
      // fetch the latest scheme_id from the 'schemes' table
      return db('schemes').max('scheme_id as scheme_id');
    })
    .then(([result]) => {
      // return the newly inserted scheme with the scheme_id
      return {
        scheme_id: result.scheme_id,
        scheme_name: scheme.scheme_name
      };
    });
}

function addStep(scheme_id, step) {
  return db('steps')
    .insert({ ...step, scheme_id }, ['*'])
    .then(() => findSteps(scheme_id));
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
