import withJoi from 'next-joi';

const validate = withJoi({
  onValidationError: (_, res) => {
    return res.status(400).json({ message: 'Request query format is invalid' });
  }
});

export default validate;
