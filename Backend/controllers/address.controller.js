import { AddressModel } from '../models/address.model.js'
import { UserModel } from '../models/user.model.js'

export const addAddress = async (req,res) => {
    try {
        const userId = req.user._id;
        const {recipient_name, address_line, city, province, localPlace, district, mobile} = req.body
        if(!recipient_name || !address_line || !city || !province || !localPlace || !district || !mobile){
            return res
                .status(400)
                .json({ message: "Fill in all credentials", success: false });
        }
        const newAddress = new AddressModel({recipient_name, address_line, city, province, localPlace, district, mobile, userId})
        const Address = await newAddress.save()
        if (!Address) {
            return res
                .status(500)
                .json({ message: "Address update Failed ", success: false });
            }
        
        const addUserAddress = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address_detail: Address._id } }, 
            { new: true }
          );

        return res.status(201).json({ message: "Address Added Successfully ", success: true, Address: Address });

    } 
    
    catch (error) {
        console.log("Error in add address controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
}
export const editAddress = async (req,res) => {
    try {
        const {_id,recipient_name, address_line, city, province, localPlace, district, mobile} = req.body
        if(!_id){
            return res
                .status(400)
                .json({ message: "Address Not Found", success: false });
        }
        const updatedAddress = await AddressModel.findByIdAndUpdate(_id,{recipient_name, address_line, city, province, localPlace, district, mobile},{ new: true })
        if (!updatedAddress) {
            return res
                .status(500)
                .json({ message: "Address update Failed ", success: false });
            }

        return res.status(200).json({ message: "Address Updated Successfully ", success: true, Address: updatedAddress });
    } 
    
    catch (error) {
        console.log("Error in update address controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
}
export const getAddress = async (req,res) => {
    try {
        const userId = req.user._id;

        const Address = await AddressModel.find({userId})
        if (!Address) {
            return res
                .status(500)
                .json({ message: "Address update Failed ", success: false });
            }
        
        return res.status(200).json({ message: "Address Fetch Successfully ", success: true, Address: Address });
    } 
    
    catch (error) {
        console.log("Error in get address controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
}

export const deleteAddress = async (req,res) => {
    try {
        const userId = req.user._id;
        const {_id} = req.body
        if(!_id){
            return res
                .status(400)
                .json({ message: "Address Not Found", success: false });
        }
        const deleteAddress =  await AddressModel.findByIdAndDelete(_id)
        if (!deleteAddress) {
            return res
                .status(500)
                .json({ message: "Address delete Failed ", success: false });
            }
        
        const deleteUserAddress = await UserModel.findByIdAndUpdate(
            userId,
            { $pull : { address_detail: _id } }, 
            { new: true }
          );

        return res.status(200).json({ message: "Address Removed Successfully ", success: true});

    } 
    
    catch (error) {
        console.log("Error in delete address controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
}