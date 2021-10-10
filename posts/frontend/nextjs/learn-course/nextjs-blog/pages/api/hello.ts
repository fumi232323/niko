import { NextApiRequest, NextApiResponse } from "next";

// req = request data, res = response data
export default (_: NextApiRequest, res: NextApiResponse) => {
  // http://localhost:3000/api/hello でアクセスできる
  res.status(200).json({ text: 'Hello' })
}
