import { Algodv2, algosdk, encodeObj, makeAssetCreateTxnWithSuggestedParams } from 'algosdk';
import { _Success, _400 } from '../utils/responses';
import { checkAddress, checkAssetAmount, checkAssetID, checkAssetName, checkAssetUrl, checkClientError, checkFee, checkNote, checkSk, checkTotalIssuance, checkUnitName } from '../utils/checkfunctions';
import { messages } from '../utils/messages';
import env from "react-dotenv";


// Function used to wait for a tx confirmation
async function waitForConfirmation (algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response["last-round"];
    while (true) {
        const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
        if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
            //Got the completed Transaction
            console.info("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
            break;
        }
        lastround++;
        await algodclient.statusAfterBlock(lastround).do();
    }
};


// Function used to print created asset for account and assetid
async function printCreatedAsset (algodclient, account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    let accountInfo = await algodclient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['created-assets'][idx];
        if (scrutinizedAsset['index'] === assetid) {
            console.info("AssetID = " + scrutinizedAsset['index']);
            let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
            console.info("parms = " + myparms);
            return myparms
        }
    }
};
// Function used to print asset holding for account and assetid
async function printAssetHolding (algodclient, account, assetid) {
    // note: if you have an indexer instance available it is easier to just use this
    //     let accountInfo = await indexerClient.searchAccounts()
    //    .assetID(assetIndex).do();
    // and in the loop below use this to extract the asset for a particular account
    // accountInfo['accounts'][idx][account]);
    let accountInfo = await algodclient.accountInformation(account).do();
    for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['assets'][idx];
        if (scrutinizedAsset['asset-id'] === assetid) {
            let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.info("assetholdinginfo = " + myassetholding);
            break;
        }
    }
};

// Permet de creer un asset
export default async function createasset(address, sk, totalIssuance, unitName, assetName, assetURL, manager, reserve, freeze, clawback, notes, fee) {
    /*let address = req.body.address;
    let sk = req.body.sk;
    let totalIssuance = req.body.totalissuance;
    let assetName = req.body.assetname;
    let unitName = req.body.unitname;
    let assetURL = req.body.asseturl;
    let manager = req.body.manager;
    let reserve = req.body.reserve;
    let freeze = req.body.freeze;
    let clawback = req.body.clawback;
    let fee = req.body.fee;
    let notes = req.body.notes;*/

    if (!checkAddress(address)) {
        return _400(messages.incorrect_parameter, { error_message: messages.address_incorrect});
    }
    else if (!checkSk(sk)) {
        return _400(messages.incorrect_parameter, { error_message: messages.sk_incorrect });
    }
    else if (!checkTotalIssuance(totalIssuance)) {
        return _400(messages.incorrect_parameter, { error_message: messages.totalIssuance_incorrect });
    }
    else if (!checkAssetName(assetName)) {
        return _400(messages.incorrect_parameter, { error_message: messages.assetName_incorrect });
    }
    else if (!checkUnitName(unitName)) {
        return _400(messages.incorrect_parameter, { error_message: messages.unitName_incorrect });
    }
    else if (!checkAssetUrl(assetURL)) {
        return _400(messages.incorrect_parameter, { error_message: messages.assetUrl_incorrect });
    } else if (!checkAddress(manager)) {
        return _400(messages.incorrect_parameter, { error_message: messages.manager_incorrect });
    } else if (!checkAddress(reserve)) {
        return _400(messages.incorrect_parameter, { error_message: messages.reserve_incorrect });
    } else if (!checkAddress(freeze)) {
        return _400(messages.incorrect_parameter, { error_message: messages.freeze_incorrect });
    } else if (!checkAddress(clawback)) {
        return _400(messages.incorrect_parameter, { error_message: messages.clawback_incorrect });
    } else if (!checkFee(fee)) {
        return _400(messages.incorrect_parameter, { error_message: messages.fee_incorrect });
    } else if (!checkNote(notes)) {
        return _400(messages.incorrect_parameter, { error_message: messages.note_incorrect });
    }
    else {
        try {
            // Connection au client
            const algodToken = JSON.parse(env.ALGODTOKEN);
            const algodServer = env.ALGODSERVER;
            const algodPort = env.ALGODPORT;

            /*const algodToken = "dcLGPXKQ0H8GnJnI55gyZ4X5kugAARCY1NkfKFSpd";
            const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
            const algodPort = "";*/
            let algodclient = new Algodv2(algodToken, algodServer, algodPort);

            // Asset Creation:
            // The first transaciton is to create a new asset
            // Get last round and suggested tx fee
            // We use these to get the latest round and tx fees
            // These parameters will be required before every 
            // Transaction
            // We will account for changing transaction parameters
            // before every transaction in this example
            let params = await algodclient.getTransactionParams().do();
            //comment out the next two lines to use suggested fee
            params.fee = parseInt(fee);
            params.flatFee = true;
            //let note = algosdk.encodeObj("showing prefix");
            let note = encodeObj(notes);

            let defaultFrozen = false;
            // integer number of decimals for asset unit calculation
            let decimals = 0;

            let assetMetadataHash = undefined;

            let txn = makeAssetCreateTxnWithSuggestedParams(address, note,
                parseInt(totalIssuance), decimals, defaultFrozen, manager, reserve, freeze,
                clawback, unitName, assetName, assetURL, assetMetadataHash, params);


            //let rawSignedTxn = txn.signTxn(Uint8Array.from([30, 104, 54, 27, 124, 129, 82, 206, 12, 139, 126, 61, 205, 2, 192, 111, 210, 181, 77, 68, 248, 0, 93, 152, 118, 138, 194, 249, 70, 241, 203, 11, 227, 204, 47, 74, 156, 194, 248, 154, 193, 14, 191, 5, 9, 96, 178, 1, 123, 85, 170, 148, 123, 248, 161, 115, 249, 86, 186, 141, 193, 35, 8, 66]))
            let rawSignedTxn = txn.signTxn(Uint8Array.from(sk.replace('[','').replace(']','').split(',')))
            
            let tx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
            console.info("Asset Creation Txn : " + tx.txId);
            let assetID = null;
            // wait for transaction to be confirmed
            await waitForConfirmation(algodclient, tx.txId);
            // Get the new asset's information from the creator account
            let ptx = await algodclient.pendingTransactionInformation(tx.txId);
            //console.info(ptx)
            //assetID = ptx.txresults.createdasset;
            //console.info("AssetID = " + assetID);

            // Get the new asset's information from the creator account
            ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
            assetID = ptx["asset-index"];
            // console.info("AssetID = " + assetID);

            const result = await printCreatedAsset(algodclient, "4PGC6SU4YL4JVQIOX4CQSYFSAF5VLKUUPP4KC47ZK25I3QJDBBBB3PTV6A", assetID);
            await printAssetHolding(algodclient, "4PGC6SU4YL4JVQIOX4CQSYFSAF5VLKUUPP4KC47ZK25I3QJDBBBB3PTV6A", assetID);


            return result;

        } catch (error) {
            console.info(error)

            if (!checkClientError(error)) {
                return _400(messages.generic_error, { error_status: error.status, error_message: messages.client_connection_error });
            } else {
                return _400(messages.generic_error, { error_status: error.status, error_message: error.body });
            }
        }
    }
};

//createasset();

// Find specifique asset from created asset
export async function getcreatedassets(address, assetid, account) {
    //var address = req.query.address;
    if (!checkAddress(address)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sender_incorrect });
    }
    else {
        // Connection au client

        const algodToken = JSON.parse(env.ALGODTOKEN);
        const algodServer = env.ALGODSERVER;
        const algodPort = env.ALGODPORT;

        /*const algodToken = "dcLGPXKQ0H8GnJnI55gyZ4X5kugAARCY1NkfKFSp";
        const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
        const algodPort = "";*/
        let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        let temp;

        // note: if you have an indexer instance available it is easier to just search accounts for an asset
        let accountInfo = await algodclient.accountInformation(account).do();
        for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
            let scrutinizedAsset = accountInfo['created-assets'][idx];
            if (scrutinizedAsset['index'] === assetid) {
                console.info("AssetID = " + scrutinizedAsset['index']);
                let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
                temp = scrutinizedAsset['index'];
                console.info("parms = " + myparms);
                break;
            }
        }
        return _Success(messages.asset_creation_success, { address: accountInfo.address, assets: temp });
    }
};

// Function used to print asset holding for account and assetid
export async function getAssets(req, res) {

    var address = req.query.address;
    if (!checkAddress(address)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sender_incorrect });
    }
    else {
        // Connection au client
        try {

            const algodToken = JSON.parse(env.ALGODTOKEN);
            const algodServer = env.ALGODSERVER;
            const algodPort = env.ALGODPORT;

            let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

            let accountInfo = await algodclient.accountInformation(address).do();

            return _Success(messages.operation_success, { address: accountInfo.address, assets: accountInfo.assets });
        } catch (error) {
            console.info(error)


            if (!checkClientError(error)) {
                return _400(messages.generic_error, { error_status: error.status, error_messages: messages.client_connection_error });
            } else {
                return _400(messages.generic_error, { error_status: error.status, error_messages: error.body.message });
            }
        }
    }
};

//Permet de recevoir un asset
export async function OptInAsset(req, res) {
    let sender = req.body.sender;
    let sk = req.body.sk;
    let assetID = req.body.assetid;
    let fee = req.body.fee;
    let notes = req.body.notes;
    if (!checkAddress(sender)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sender_incorrect });
    }
    else if (!checkSk(sk)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sk_incorrect });
    }
    else if (!checkAssetID(assetID)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.assetID_incorrect });
    } else if (!checkFee(fee)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.fee_incorrect });
    } else if (!checkNote(notes)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.note_incorrect });
    }
    else {
        try {
            // replace with your  assetid
            // Transfer New Asset:
            // Now that account3 can recieve the new tokens 
            // we can tranfer tokens in from the creator
            // to account3
            // First update changing transaction parameters
            // We will account for changing transaction parameters
            // before every transaction in this example

            const algodToken = JSON.parse(env.ALGODTOKEN);
            const algodServer = env.ALGODSERVER;
            const algodPort = env.ALGODPORT;
            let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

            let params = await algodclient.getTransactionParams().do();
            //comment out the next two lines to use suggested fee
            params.fee = fee;
            params.flatFee = true;
            let note = algosdk.encodeObj(notes);

            let recipient = sender
            let revocationTarget = undefined;
            let closeRemainderTo = undefined;
            // We are sending 0 assets
            let amount = 0;

            // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
            let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
                amount, note, assetID, params);

            // Must be signed by the account sending the asset  
            let rawSignedTxn = opttxn.signTxn(Uint8Array.from(sk))
            //let rawSignedTxn = opttxn.signTxn(Uint8Array.from([30,104,54,27,124,129,82,206,12,139,126,61,205,2,192,111,210,181,77,68,248,0,93,152,118,138,194,249,70,241,203,11,227,204,47,74,156,194,248,154,193,14,191,5,9,96,178,1,123,85,170,148,123,248,161,115,249,86,186,141,193,35,8,66]))    

            let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
            console.info("Transaction : " + opttx.txId);
            // wait for transaction to be confirmed
            await waitForConfirmation(algodclient, opttx.txId);

            return _Success(messages.asset_opt_in_success, { transactionID: opttx.txId });

        } catch (error) {
            console.info(error)
            if (!checkClientError(error)) {
                return _400(messages.generic_error, { error_status: error.status, error_messages: messages.client_connection_error });
            } else {
                return _400(messages.generic_error, { error_status: error.status, error_messages: error.body.message });
            }
        }
    }
}

export async function sendAsset(req, res) {

    let sender = req.body.sender;
    let receiver = req.body.receiver;
    let sk = req.body.sk;
    let assetID = req.body.assetid;
    let fee = req.body.fee;
    let notes = req.body.notes;
    //Amount of the asset to transfer
    let amount = req.body.amount;

    if (!checkAddress(sender)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sender_incorrect });
    }
    if (!checkAddress(receiver)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.recveiver_incorrect });
    }
    else if (!checkSk(sk)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sk_incorrect });
    }
    else if (!checkAssetID(assetID)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.assetID_incorrect });
    } else if (!checkFee(fee)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.fee_incorrect });
    } else if (!checkNote(notes)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.note_incorrect });
    } else if (!checkAssetAmount(amount)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.amount_incorrect });
    }
    else {
        try {
            // replace with your  assetid
            // Transfer New Asset:
            // Now that account3 can recieve the new tokens 
            // we can tranfer tokens in from the creator
            // to account3
            // First update changing transaction parameters
            // We will account for changing transaction parameters
            // before every transaction in this example

            const algodToken = JSON.parse(env.ALGODTOKEN);
            const algodServer = env.ALGODSERVER;
            const algodPort = env.ALGODPORT;
            let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

            let params = await algodclient.getTransactionParams().do();
            //comment out the next two lines to use suggested fee
            params.fee = fee;
            params.flatFee = true;
            let note = algosdk.encodeObj(notes);

            let revocationTarget = undefined;
            let closeRemainderTo = undefined;

            // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
            let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, receiver, closeRemainderTo, revocationTarget,
                amount, note, assetID, params);

            // Must be signed by the account sending the asset  
            //let rawSignedTxn = txn.signTxn(Uint8Array.from([30, 104, 54, 27, 124, 129, 82, 206, 12, 139, 126, 61, 205, 2, 192, 111, 210, 181, 77, 68, 248, 0, 93, 152, 118, 138, 194, 249, 70, 241, 203, 11, 227, 204, 47, 74, 156, 194, 248, 154, 193, 14, 191, 5, 9, 96, 178, 1, 123, 85, 170, 148, 123, 248, 161, 115, 249, 86, 186, 141, 193, 35, 8, 66]))    
            let rawSignedTxn = txn.signTxn(Uint8Array.from(sk))

            let xtx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
            //console.info("Transaction : " + xtx.txId);

            // wait for transaction to be confirmed
            await waitForConfirmation(algodclient, xtx.txId);

            // You should now see the 10 assets listed in the account information
            //console.info("Account = " + sender);
            await printAssetHolding(algodclient, sender, assetID);

            return _Success(messages.asset_transfer_success, { transactionID: xtx.txId });


        } catch (error) {
            console.info(error)

            if (!checkClientError(error)) {
                return _400({ error_status: error.status, messages: messages.client_connection_error });
            } else {
                return _400({ error_status: error.status, messages: error.body.message });
            }
        }
    }
}

// Find specifique asset
export async function getspecifiqueassets(req, assetid, res) {

    var address = req.query.address;
    if (!checkAddress(address)) {
        return _400(messages.incorrect_parameter, { error_messages: messages.sender_incorrect });
    }
    else {
        try {
            // Connection au client
            const algodToken = JSON.parse(env.ALGODTOKEN);
            const algodServer = env.ALGODSERVER;
            const algodPort = env.ALGODPORT;
            let algodclient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

            let temp;

            // note: if you have an indexer instance available it is easier to just search accounts for an asset
            let accountInfo = await algodclient.accountInformation(address).do();
            //console.info(accountInfo);
            for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
                let scrutinizedAsset = accountInfo['assets'][idx];
                console.info(JSON.stringify(scrutinizedAsset, undefined, 2));
                if (scrutinizedAsset['asset-id'] === assetid) {
                    let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
                    console.info("assetholdinginfo = " + myassetholding);
                    temp = scrutinizedAsset['index'];
                    break;
                }
            }
            return _Success(messages.operation_success, { address: accountInfo.address, assets: temp });
        } catch (error) {
            //console.info(error)
            if (!checkClientError(error)) {
                return _400({ error_status: error.status, error_messages: messages.client_connection_error });
            } else {
                return _400({ error_status: error.status, error_messages: error.body.message });
            }
        }
    }
};