const Schemes = require('../schemes/scheme-model.js');

const checkSchemeId = async (req, res, next) => {
  try {
    const scheme = await Schemes.findById(req.params.scheme_id);
    if (!scheme) {
      return res.status(404).json({ message: `scheme with scheme_id ${req.params.scheme_id} not found` });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

const validateScheme = (req, res, next) => {
  if (
    !req.body.scheme_name || 
    typeof req.body.scheme_name !== 'string' || 
    req.body.scheme_name.trim() === ''
  ) {
    res.status(400).json({ message: "invalid scheme_name" });
  } else {
    next();
  }
}

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;
  if (
    !instructions || 
    typeof instructions !== 'string' || 
    instructions.trim() === '' || 
    typeof step_number !== 'number' || 
    step_number < 1
  ) {
    res.status(400).json({ message: "invalid step" });
  } else {
    next();
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
