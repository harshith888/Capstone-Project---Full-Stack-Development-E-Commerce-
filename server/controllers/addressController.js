import prisma from '../configs/prismaClient.js'


// Add Address : /api/address/add
export const addAddress = async(req, res)=>{
    try {
    const { address, userId } = req.body
    // Coerce zipcode to integer (Prisma schema expects Int)
    const zipcode = address.zipcode !== undefined && address.zipcode !== null ? Number(address.zipcode) : null;
    if (zipcode === null || Number.isNaN(zipcode)){
        return res.json({ success: false, message: 'Invalid zipcode' });
    }

    await prisma.address.create({ data: { ...address, zipcode, userId } })
    res.json({success: true, message: "Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
export const getAddress = async(req, res)=>{
    try {
    const { userId } = req.body
    const addresses = await prisma.address.findMany({ where: { userId } })
    res.json({success: true, addresses})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
