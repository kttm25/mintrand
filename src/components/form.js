import { render } from "@testing-library/react"
import { useEffect, useState } from "react"
import { checkAddress, checkAssetName, checkFee, checkImageError, checkNote, checkSk, checkTotalIssuance, checkUnitName } from "../utils/checkfunctions"
import { Button, Input } from "./styled"
import Submit from "./submit"
import Title from "./title"




function Form({selectedImage, setSelectedImage, ipfs, loading, setLoading}) {
    const [addressValue, setAddressValue] = useState('4PGC6SU4YL4JVQIOX4CQSYFSAF5VLKUUPP4KC47ZK25I3QJDBBBB3PTV6A')
    const [addressError, setAddressError] = useState(false)
    const [skValue, setSKValue] = useState('[30, 104, 54, 27, 124, 129, 82, 206, 12, 139, 126, 61, 205, 2, 192, 111, 210, 181, 77, 68, 248, 0, 93, 152, 118, 138, 194, 249, 70, 241, 203, 11, 227, 204, 47, 74, 156, 194, 248, 154, 193, 14, 191, 5, 9, 96, 178, 1, 123, 85, 170, 148, 123, 248, 161, 115, 249, 86, 186, 141, 193, 35, 8, 66]')
    const [skError, setSKError] = useState(false)
    const [totalInsuanceValue, setTotalInsuanceValue] = useState('1')
    const [totalInsuanceError, setTotalInsuanceError] = useState(false)
    const [unitNameValue, setUnitNameValue] = useState('Test')
    const [unitNameError, setUnitNameError] = useState(false)
    const [assetNameValue, setAssetNameValue] = useState('Test')
    const [assetNameError, setAssetNameError] = useState(false)
    const [managerValue, setManagerValue] = useState('4PGC6SU4YL4JVQIOX4CQSYFSAF5VLKUUPP4KC47ZK25I3QJDBBBB3PTV6A')
    const [managerError, setManagerError] = useState(false)
    const [feeValue, setFeeValue] = useState('10000')
    const [feeError, setFeeError] = useState(false)
    const [notesValue, setNotesValue] = useState('Test')
    const [notesError, setNotesError] = useState(false)
    
    const [imgError, setImgError] = useState(true)
    const [formComplete, setFormComplete] = useState(false)
    const [resultDisplay, setResultDisplay] = useState(false)
  
    
    useEffect(() => {
          console.log(!selectedImage)
          console.log(!ipfs)
          console.log(!formComplete)
    })
    // useEffect(() => {
    // //   console.log(!selectedImage)
    // //   console.log(!ipfs)
    // //   console.log(!formComplete)
  
    //   if (!selectedImage || !ipfs || !formComplete) return;
    //     console.log("ici")

    //     return <Submit selectedImage={selectedImage} ipfs={ipfs} addressValue={addressValue} skValue={skValue} totalInsuanceValue={totalInsuanceValue}
    //     unitNameValue={unitNameValue} assetNameValue={assetNameValue} managerValue={managerValue} feeValue={feeValue} notesValue={notesValue} setLoading={setLoading} />
    
    // }, [selectedImage, ipfs, formComplete, addressValue, skValue, totalInsuanceValue,
    //     unitNameValue, assetNameValue, managerValue, feeValue, notesValue, setLoading])
    

    //   Submit(selectedImage, ipfs, addressError, addressValue, skError, skValue, totalInsuanceError,
    //     unitNameError, unitNameValue, assetNameError, assetNameValue, managerError, managerValue, feeError, feeValue, notesError, notesValue)
    // }, [selectedImage, ipfs, formComplete, addressError, addressValue, skError, skValue, totalInsuanceError,
    //   unitNameError, unitNameValue, assetNameError, assetNameValue, managerError, managerValue, feeError, feeValue, notesError, notesValue])
    
      if(!ipfs){
        return null;
      }
      return (
        <section className='bg-snow mw7 center mt5'>
          
          <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Create an asset</h1>
          <div className='pa4'>
            <div className='mb4'>
              <Title>Public Key</Title>
              <Input
                  value={''}
                  onChange={(e) => setAddressValue(e.target.value)}
                  onBlur={(e) => checkAddress(e.target.value) ? setAddressError(false) : setAddressError(true)}
                  className='bg-white pa2 br2 truncate monospace'
                  placeholder='Enter public key'
                  isError={addressError}
              />
              <Title>Secret Key</Title>
              <Input
                  value={''}
                  onChange={(e) => setSKValue(e.target.value)}
                  onBlur={(e) => checkSk(e.target.value) ? setSKError(false) : setSKError(true)}
                  placeholder='Enter secret key'
                  className='bg-white pa2 br2 truncate monospace'
                  isError={skError}
              />
              <Title>Total Insurrance</Title>
              <Input
                  value={''}
                  placeholder='Enter total Insuance'
                  onChange={(e) => setTotalInsuanceValue(e.target.value)}
                  onBlur={(e) => checkTotalIssuance(e.target.value) ? setTotalInsuanceError(false) : setTotalInsuanceError(true)}
                  className='bg-white pa2 br2 truncate monospace'
                  isError={totalInsuanceError}
              />
              <Title>Unit Name</Title>
              <Input
                    value={''}
                    placeholder='Enter Unit Name'
                    onChange={(e) => setUnitNameValue(e.target.value)}
                    onBlur={(e) => checkUnitName(e.target.value) ? setUnitNameError(false) : setUnitNameError(true)}
                    className='bg-white pa2 br2 truncate monospace'
                    isError={unitNameError}
                />
              <Title>Asset Name</Title>
              <Input
                  value={''}
                  placeholder='Enter Asset Name'
                  onChange={(e) => setAssetNameValue(e.target.value)}
                  onBlur={(e) => checkAssetName(e.target.value) ? setAssetNameError(false) : setAssetNameError(true)}
                  className='bg-white pa2 br2 truncate monospace'
                  isError={assetNameError}
              />
              <Title>Manager Address</Title>
              <Input
                  value={''}
                  placeholder='Enter Manager Address'
                  onChange={(e) => setManagerValue(e.target.value)}
                  onBlur={(e) => checkAddress(e.target.value) ? setManagerError(false) : setManagerError(true)}
                  className='bg-white pa2 br2 truncate monospace'
                  isError={managerError}
              />
              <Title>Fee</Title>
              <Input
                  value={''}
                  placeholder='Define Fee'
                  onChange={(e) => setFeeValue(e.target.value)}
                  onBlur={(e) => checkFee(e.target.value) ? setFeeError(false) : setFeeError(true)}
                  className='bg-white pa2 br2 truncate monospace'
                  isError={feeError}
              />
              <Title>Notes</Title>
              <Input
                    value={''}
                    placeholder='Define Notes of transaction'
                    onChange={(e) => setNotesValue(e.target.value)}
                    onBlur={(e) => checkNote(e.target.value) ? setNotesError(false) : setNotesError(true)}
                    className='bg-white pa2 br2 truncate monospace'
                    isError={notesError}
              />
              <Title>Logo</Title>
              <Input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  name="myImage"
                  onChange={(event) => {
                    console.log(event.target.files[0]);
                    setSelectedImage(event.target.files[0]);
                    checkImageError(event.target.files[0]) ? setImgError(false) : setImgError(true) 
                  }}
                  isError={imgError}
                />
              <Button onClick={() => {
                  if(!(selectedImage || ipfs || addressError || skError || totalInsuanceError || unitNameError || assetNameError || managerError || feeError ||notesError)){
                    return render(<div>Veuillez completer le formulaire correctement</div>)
                  }
                  setFormComplete(true)
                  }}>Submit</Button>
              </div>
              <div>
                {((selectedImage && ipfs && formComplete) || resultDisplay) && 
                <Submit selectedImage={selectedImage} ipfs={ipfs} addressValue={addressValue} skValue={skValue} totalInsuanceValue={totalInsuanceValue}
                unitNameValue={unitNameValue} assetNameValue={assetNameValue} managerValue={managerValue} feeValue={feeValue} notesValue={notesValue} loading={loading} setLoading={setLoading} setFormComplete={setFormComplete} formComplete={formComplete} 
                setResultDisplay={setResultDisplay}  resultDisplay={resultDisplay}/>}
              </div>
          </div>
          </section>
      )
      // return (
      //   <section className='bg-snow mw7 center mt5'>
      //     <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Fill this formulare to create a new NFT</h1>
      //     <div className='pa4'>
      //       <div className='mb4'>
      //         <Title>test</Title>
      //         <div className='bg-white pa2 br2 truncate monospace' >{"test"}</div>
      //       </div>
      //     </div>
      //   </section> 
      // );
    
  };
  
  export default Form;