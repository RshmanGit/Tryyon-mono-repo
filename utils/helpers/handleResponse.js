const method = (req, res, resultKey) => (err, results) => {
  console.log(results);
  if (err) {
    err = JSON.parse(err.message);
    const status = err.body.status ? err.body.status : 500;
    const data = err.body.data
      ? err.body.data
      : { message: 'Some error occurred in Api' };
    console.error(`${data.message} ${status}`);
    res.status(status).json(data).end();
  } else {
    res.json(results[resultKey]);
    res.status(200).end();
  }
};

export default method;
