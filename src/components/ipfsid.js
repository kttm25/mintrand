import Title from "./title";

const IpfsId = ({keys, obj}) => {
    if (!obj || !keys || keys.length === 0) return null
    return (
      <>
        {keys?.map((key) => (
          <div className='mb4' key={key}>
            <Title>{key}</Title>
            <div className='bg-white pa2 br2 truncate monospace' data-test={key}>{obj[key]}</div>
          </div>
        ))}
      </>
    )
  }

export default IpfsId;