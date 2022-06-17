import withJoi from 'next-joi';

const validate = withJoi({
  onValidationError: (_, res) => {
    return res.status(400).end();
  }
});

export default validate;
