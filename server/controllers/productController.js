import { v2 as cloudinary } from "cloudinary"
import prisma from '../configs/prismaClient.js'

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

    // Ensure numeric fields are proper types (Prisma expects Float for price fields)
    const price = productData.price !== undefined ? Number(productData.price) : null;
    const offerPrice = productData.offerPrice !== undefined ? Number(productData.offerPrice) : null;

    if (price === null || Number.isNaN(price) || offerPrice === null || Number.isNaN(offerPrice)){
        return res.json({ success: false, message: 'Invalid price or offerPrice' })
    }

    // Coerce inStock to boolean if provided as string
    let inStock = productData.inStock;
    if (inStock !== undefined) {
        if (typeof inStock === 'string') {
            inStock = inStock.toLowerCase() === 'true'
        } else {
            inStock = Boolean(inStock)
        }
    }

    await prisma.product.create({ data: { ...productData, price, offerPrice, inStock, image: imagesUrl } })

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list
export const productList = async (req, res)=>{
    try {
    const products = await prisma.product.findMany()
    res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
    const { id } = req.body
    const product = await prisma.product.findUnique({ where: { id } })
    res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
    const { id, inStock } = req.body
    await prisma.product.update({ where: { id }, data: { inStock } })
    res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
