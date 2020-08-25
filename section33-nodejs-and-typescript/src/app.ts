import express from 'express'; // this is how you typically import files fro mother files into this file in client side code.
import bodyParser from 'body-parser';

import todosRoutes from './routes/todos';

const app = express();

app.use(bodyParser.json());

app.use(todosRoutes);

app.listen(3000);// generic : type that interacts with another type
