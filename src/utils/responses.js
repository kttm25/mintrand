export function _Success(message, results){
    console.log({code:200, message: message, value:results, error:false});
    return(JSON.stringify({code:200, message: message, value:results, error:false}));
}
export function _400(message, results) {
    return (JSON.stringify({code:400, message: message, value:results, error:true}));
}