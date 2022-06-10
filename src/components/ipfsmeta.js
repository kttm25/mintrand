import { Grid } from "react-loader-spinner";
import IpfsId from "./ipfsid";

function DisplayIPFSMeta({id, version, loading}){
    return (
      (id || version || !loading) ? 
        <section className='bg-snow mw7 center mt5'>
          <h1 className='f3 fw4 ma0 pv3 aqua montserrat tc' data-test='title'>Connected to IPFS</h1>
          <div className='pa4'>
            {id && <IpfsId obj={id} keys={['id', 'agentVersion']}/>}
            {version && <IpfsId obj={version} keys={['version']}/>}
          </div>
        </section> 
          : 
        <section className='mw7 center mt5'> 
          <div className='loader'>
            <Grid
              height="300"
              width="300"
              color='#0b3a53ff'
              ariaLabel='loading'
            />
          </div>
        </section>
    );
}

export default DisplayIPFSMeta;