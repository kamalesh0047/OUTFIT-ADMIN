export default function PageLoader() {
  return (
    <div className="container section" aria-busy="true">
      <div className="skeleton" style={{height:42,width:'40%',marginBottom:28}} />
      <div className="grid grid--4">
        {Array.from({length:8}).map((_,i)=>(
          <div key={i}><div className="skeleton" style={{aspectRatio:'4/5'}} /><div className="skeleton" style={{height:14,marginTop:12,width:'70%'}} /><div className="skeleton" style={{height:14,marginTop:8,width:'40%'}} /></div>
        ))}
      </div>
    </div>
  )
}
