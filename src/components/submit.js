import React, { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import createasset from "../lib/algorand_nft";
import { ResultText } from "./styled";
import Title from "./title";

function Submit({selectedImage, ipfs, formComplete, setFormComplete, addressValue, skValue, totalInsuanceValue, unitNameValue, assetNameValue, managerValue, feeValue, notesValue, resultDisplay, setResultDisplay, loading, setLoading}){
    const [result, setResult] = useState();
    const [ipfsData, setIpfsData] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const CreateAsset =  async () => {
      
            const ipfsdata = await ipfs.add(selectedImage) 
            setIpfsData(ipfsdata)  
            var res = await createasset(addressValue,
                skValue,
                totalInsuanceValue,
                assetNameValue,
                unitNameValue,
                "ipfs.io/ipfs/" + ipfsdata.cid.toV0().toString(),
                managerValue,
                managerValue,
                managerValue,
                managerValue,
                notesValue,
                feeValue);
            
            setResult(res)
            setIsLoading(false);
            setResultDisplay(true);
            setFormComplete(false);
        }

        if(!isLoading && !result){
            setIsLoading(true);
            CreateAsset()
        }else if(!isLoading && formComplete && resultDisplay){
            setIsLoading(true);
            CreateAsset()
        }
    },[ipfsData, result, skValue, totalInsuanceValue, assetNameValue, unitNameValue,
        managerValue, notesValue, feeValue, addressValue, ipfs, selectedImage, isLoading, 
        formComplete, setFormComplete, resultDisplay, setResultDisplay])
    

    return (
        !isLoading ? <section className='bg-snow mw7 center mt5'>
          <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Result</h1>
          <div className='pa4'>
            <div className='mb4'>
              <div>
                <div>
                  <Title> Link to CID</Title>
                  {ipfsData && <a
                    className="react-link"
                    href={"https://ipfs.io/ipfs/" + ipfsData.cid.toV0().toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link to store image 
                  </a>}
                </div>
                <div>
                  <br></br>
                  <Title> Asset Params</Title>
                  <ResultText rows='18' cols='120' readOnly="tue">
                    {result}
                  </ResultText>
                </div>
              </div>
            </div>
          </div>
        </section> 
        :
        <section className='mw7 center mt5'> 
          <div className='loader'>
            <Grid
              height="100"
              width="100"
              color='#0b3a53ff'
              ariaLabel='loading'
            />
          </div>
        </section>
      )
}

export default Submit;