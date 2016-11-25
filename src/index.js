
import express from 'express';
import cors from 'cors';
import fetch from  'isomorphic-fetch';
import _ from 'lodash';

import task3B from  './task3B';

const app = express();
app.use(cors());
app.use('/task3B', task3B);

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
