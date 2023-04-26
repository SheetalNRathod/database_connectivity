import {NextFunction, Request, Response} from "express";
import {ThrowError} from "../util/ErrorUtil";
import * as UserUtil from "../util/UserUtil";
import {IProduct} from "../models/IProduct";
import ProductCollection from "../schemas/ProductSchema";
import {APP_CONSTANTS} from "../contants";
import mongoose from "mongoose";
// import ProductCollection from '../../schemas/ProductSchema';
import multer from 'multer';
import productsRouter from "../routers/products/productsRouter";

/**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */

export const createProduct = async (request: Request, response: Response) => {
    try {
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            // check if the same product exists
            const theProduct: IProduct | undefined | null = await ProductCollection.findOne({title: title});
            if (theProduct) {
                return ThrowError(response, 401, "The Product is already exists!");
            }
            const newProduct: IProduct = {
                title: title,
                description: description,
                imageUrl: imageUrl,
                brand: brand,
                price: price,
                quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id
            };
            const createdProduct = await new ProductCollection(newProduct).save();
            if (createdProduct) {
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: createdProduct,
                    msg: "Product is Created Successfully!"
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
    const storage = multer.diskStorage({
        destination: function (request, file, cb) {
            cb(null, 'uploads\\uploads.ts')
        },
        
        filename: function (request: any, file: any, cb: any) {
            cb(null, file.uploads)
        }
    });
    const fileFilter = (req: any,file: any,cb: any) => {
        if(file.mimetype === "image/jpg"  || 
           file.mimetype ==="image/jpeg"  || 
           file.mimetype ===  "image/png"){
         
        cb(null, true);
       }else{
          cb(new Error("Image uploaded is not of type jpg/jpeg  or png"),false);
    }
    }
    const upload = multer({storage: storage, fileFilter : fileFilter});
    productsRouter.post('/',upload.array('images',5),async(req: Request,
                res:Response, next :NextFunction)=>{
          
           let newProduct = new ProductCollection({
                // name: req.body.name,
                // price: req.body.price,
                // images: req.files
                title:req.body.title,
                description: req.body.description,
                imageUrl:req.body.imageUrl,
                brand: req.body.brand,
                price: req.body.price,
               quantity:req.body.quantity,
           });
           await newProduct.save();
           res.send(newProduct);
    });
};

/**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
export const updateProduct = async (request: Request, response: Response) => {
    try {
        const {title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId} = request.body;
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            // check if the same product exists
            const theProduct: IProduct | undefined | null = await ProductCollection.findById(mongoProductId);
            if (!theProduct) {
                return ThrowError(response, 404, "The Product is not exists!");
            }
            const newProduct: IProduct = {
                title: title,
                // description: description,
                imageUrl: imageUrl,
                // brand: brand,
                // price: price,
                // quantity: quantity,
                categoryObj: categoryId,
                subCategoryObj: subCategoryId,
                userObj: theUser._id,
                description: "",
                brand: "",
                price: 0,
                quantity: 0
            };
            const updatedProduct = await ProductCollection.findByIdAndUpdate(mongoProductId, {
                $set: newProduct
            }, {new: true});
            if (updatedProduct) {
                return response.status(200).json({
                    status: APP_CONSTANTS.SUCCESS,
                    data: updatedProduct,
                    msg: "Product is Updated Successfully!"
                });
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProducts = async (request: Request, response: Response) => {
    try {
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProducts: IProduct[] | any = await ProductCollection.find().populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                msg: "",
                data: theProducts
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | any = await ProductCollection.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!theProduct) {
                return ThrowError(response, 404, "The product is not found");
            }
            return response.status(200).json({
                msg: "",
                data: theProduct,
                status: APP_CONSTANTS.SUCCESS
            })
        }
    } catch (error) {
        return ThrowError(response);
    }
};

/**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @params : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const {productId} = request.params;
        const mongoProductId = new mongoose.Types.ObjectId(productId);
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const theProduct: IProduct | any = await ProductCollection.findById(mongoProductId).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            if (!theProduct) {
                return ThrowError(response, 404, "The product is not found");
            }

            const deletedProduct = await ProductCollection.findByIdAndDelete(mongoProductId);
            if (deletedProduct) {
                return response.status(200).json({
                    msg: "The Product is deleted!",
                    data: deletedProduct,
                    status: APP_CONSTANTS.SUCCESS
                })
            }
        }
    } catch (error) {
        return ThrowError(response);
    }
};


/**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @params : no-params
 * @method : GET
 * @access : PRIVATE
 */
export const getAllProductsWithCategoryId = async (request: Request, response: Response) => {
    try {
        const {categoryId} = request.params;
        const theUser: any = await UserUtil.getUser(request, response);
        if (theUser) {
            const products: IProduct[] | any = await ProductCollection.find({categoryObj: categoryId}).populate({
                path: "userObj",
                strictPopulate: false
            }).populate({
                path: "categoryObj",
                strictPopulate: false
            }).populate({
                path: "subCategoryObj",
                strictPopulate: false
            });
            return response.status(200).json({
                status: APP_CONSTANTS.SUCCESS,
                data: products,
                msg: ""
            });
        }
    } catch (error) {
        return ThrowError(response);
    }
};
