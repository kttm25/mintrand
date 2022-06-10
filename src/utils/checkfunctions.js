export function checkAddress(adress){
    if((adress === "" || adress == null || adress.length > 58 || adress.length < 58 )){
        return false;
    }else{
        return true;
    }
}

export function checkSk (sk){
    if((!Array.isArray(sk.split(",")) || sk === null || sk.split(",").length > 64 || sk.split(",").length < 64 )){
        return false;
    }else{
        return true;
    }
}

export function checkAmount(amount){
    if((amount === "" || amount == null || amount < 1000 )){
        return false;
    }else{
        return true;
    }
}

export function checkAssetAmount(amount){
    if((amount === "" || amount == null || amount <= 0 )){
        return false;
    }else{
        return true;
    }
}

export function checkFee(fee){
    if(( isNaN(parseInt(fee)) || parseInt(fee) < 1000 )){
        return false;
    }else{
        return true;
    }
}

export function checkTotalIssuance(totalIssuance){
    if(( isNaN(parseInt(totalIssuance))|| parseInt(totalIssuance) <= 0 )){
        console.log(isNaN(totalIssuance))
        return false;
    }else{
        return true;
    }
}

export function checkAssetName(assetName){
    if((assetName === "" || assetName == null)){
        return false;
    }else{
        return true;
    }
}

export function checkAssetID(assetID){
    if((assetID === "" || assetID == null || assetID.toString().length > 8 || assetID.toString().length < 8 )){
        return false;
    }else{
        return true;
    }
}

export function checkUnitName(unitName){
    if((unitName === "" || unitName == null) || unitName.length > 8){
        return false;
    }else{
        return true;
    }
}

export function checkAssetUrl(assetURL){
    if((assetURL === "" || assetURL == null)){
        return false;
    }else{
        return true;
    }
}

export function checkNote(note){
    if((note === "" || note == null)){
        return false;
    }else{
        return true;
    }
}

export function checkClientError(err){
    if(err.toString().includes("ECONNREFUSED") || err.toString().includes("socket hang up")){
        return false;
    }else{
        return true;
    }
}

export function checkImageError(img){
    if(!img){
        return false;
    }else{
        return true;
    }
}