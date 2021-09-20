import express, { Request, Response } from 'express';
import session from 'express-session';

const app = express();
const routes = require('./routes');
app.use(express.json());

app.use(
  session({
    secret: 'absdajfaldsjflasdj',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/pub/proxy', routes);
app.use('/api/proxy', routes);

app.get('/', (req: Request, res: Response) => {
  console.log('you are on root page');
  res.send('you are on root');
});

app.listen('3000', () => {
  console.log('app is running on 3000');
});
