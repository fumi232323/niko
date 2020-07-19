// req = request data, res = response data
export default (req, res) => {
  // http://localhost:3000/api/hello でアクセスできる
  res.status(200).json({ text: 'Hello' })
}
