const method = (req, res, resultKey) => (err, results) => {
  console.log(results);
  if (err) {
    err = JSON.parse(err.message);
    const status = err.body.status ? err.body.status : 500;
    const data = err.body.data
      ? err.body.data
      : { message: 'Some error occurred in Api' };
    console.error(`${data.message} ${status}`);
    res.json({ status, message: data.message });
    res.status(status).end();
  } else {
    res.json({ status: 200, ...results[resultKey] });
    res.status(200).end();
  }
};

export default method;
