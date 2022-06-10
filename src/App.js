import { useState, useEffect } from 'react';
import useIpfsFactory from './hooks/use-ipfs-factory.js'
import useIpfs from './hooks/use-ipfs.js'
import logo from './assets/logo.svg';
// import ipfsLogo from './assets/ipfs-logo.svg'
import './styles/App.css';
import Form from './components/form.js';
import DisplayIPFSMeta from './components/ipfsmeta.js';
import { Grid } from 'react-loader-spinner';

function App() {
  const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] })
  const id = useIpfs(ipfs, 'id')
  const [version, setVersion] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ipfs) return;

    const getVersion = async () => {
      const nodeId = await ipfs.version();
      setVersion(nodeId);
    }
    getVersion();
    setLoading(false)
  }, [ipfs])

  useEffect(() => {
    console.log(loading)
  }, [loading])


  return (
    <div className='sans-serif'>
      <header className='flex items-center pa3 bg-navy bb bw3 b--aqua'>
        <h1 className='ma0 f3 fw2 montserrat aqua'> Algorand </h1>
        <img src={logo} className="react-logo" alt="logo" style={{ height: 50 }} />
        <h1 className='flex-auto ma0 tr f3 fw2 montserrat aqua'>Mintrand React</h1>
      </header>
      <main>

        {ipfsInitError && (
          <div className='bg-red pa3 mw7 center mv3 white'>
            Error: {ipfsInitError.message || ipfsInitError}
          </div>
        )}

          
        {(id && version && !loading) ? 
        <div>
          <DisplayIPFSMeta id={id} version={version} loading={loading} />
          <Form selectedImage={selectedImage} setSelectedImage={setSelectedImage} ipfs={ipfs} loading={loading} setLoading={setLoading}/>
          {/* {Form({selectedImage, setSelectedImage, ipfs, loading, setLoading})} */}
        </div> 
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
        </section>}
      </main>
      <footer className="react-header">
        {/*<p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="react-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>*/}
      </footer>
    </div>
    
  );
}


export default App;
