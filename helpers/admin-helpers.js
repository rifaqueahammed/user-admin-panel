var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('../app')
var objectId=require('mongodb').ObjectId

module.exports={

    addUser:(user)=>{
            return new Promise(async(resolve,reject)=>{
            user.password=await bcrypt.hash(user.password,10)
            db.get().collection('user').insertOne(user).then(user)
            resolve(user)
        })
    },

    getAllusers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users= await db.get().collection(collection.USER_COLLECTIONS).find().toArray()
            resolve(users)
        })
    },

    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTIONS).deleteOne({_id:objectId(userId)}).then((response)=>{
            resolve(response)
            })
         })
        },

    getuserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTIONS).findOne({_id:objectId(userId)}).then((response)=>{
            resolve(response)
            })
        })
    },

    updateUser:(userId,userDetails)=>{
            return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTIONS).updateOne({_id:objectId(userId)},{
                $set:{
                    Name:userDetails.Name,
                    email:userDetails.email
                }
            }).then((response)=>{
                console.log(response)
            resolve(response)
            })
        })
    },

    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
           let loginStatus=false
           let response={}
           let admin=await db.get().collection(collection.ADMIN_COLLECTIONS).findOne({Name:adminData.email})
            if(admin){
                db.get().collection(collection.ADMIN_COLLECTIONS).findOne({password:adminData.password}).then((status)=>{
                    if(status){
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        response.status=false
                        resolve(response)
                     }
                    
                })
            }else{
                response.status=false
                resolve(response) 
            }
            
           })
           
    
    }


}