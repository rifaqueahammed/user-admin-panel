var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')

module.exports={

    dosignUp:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then(userData)
            resolve(userData)
        })
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
           let loginStatus=false
           let response={}
           let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
           if(user){
            console.log(user)
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    response.user=user
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