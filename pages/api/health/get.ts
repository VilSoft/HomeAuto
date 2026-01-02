/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function getHealth(req: any, res: any) {
    res.json({ status: "ok" })
}