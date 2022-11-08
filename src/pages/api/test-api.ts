import { NextApiRequest, NextApiResponse } from 'next';

export interface Data {
  name: string;
}

const handler = (req: NextApiRequest, res: NextApiResponse<Data>): void => {
  res.status(200).json({ name: 'John Doe' });
  console.log('test');
};

export default handler;
