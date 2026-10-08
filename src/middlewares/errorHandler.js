const errorHandler = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === "development"){
        return res.status(err.statusCode).json({"message":err.message,"stack":err.stack,"status": err.status,"error":err});
    }
    if(err.isOperational){
        return res.status(err.statusCode).json({"message":err.message,"status":err.status});
    }

    console.log(err);
    return res.status(500).json({message: 'Une erreur inattendue est survenue'});
}

module.exports = errorHandler;