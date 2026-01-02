// import { connectMongo } from "@/utils"
// import { Test } from "@/models"

// /**
//  * 
//  * @param {import('next').NextApiRequest} req 
//  * @param {import('next').NextApiResponse} res 
//  */

// export default async function addTest(req: any, res: any) {

//     console.log('Connecting to DB')
//     await connectMongo()
//     console.log('Connected to DB')
//     console.log('Sending')
//     const test = await Test.create(req.body)
//     console.log('Sent')

//     res.json({ test })
// }