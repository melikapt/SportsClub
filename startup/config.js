const config=require('config')


module.exports=function () {
    if(!config.get("jwtPrivateKey")){
        console.log('FATAL ERROR');
        process.exit(1)
    }
    
}