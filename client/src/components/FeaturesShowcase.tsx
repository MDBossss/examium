


const showcaseItems = [{
    image: "/showcase-create.png",
    title: "Create",
    description: "Quickly design tests with a user-friendly test builder."
},
{
    image: "/showcase-collaborate.png",
    title: "Collaborate",
    description: "Effortlessly collaborate with teammates or colleagues on creating and editing.",
},
{
    image: "showcase-results.png",
    title: "Results",
    description: "Analyze assessment outcomes and survey responses for valuable insights."
}]

const FeaturesShowcase = () => {


    const layout = (index: number) => {
        return index % 2 === 0
    }

  return (
        <div className="flex flex-col gap-5">
            {showcaseItems.map((item,index) => (
                <div className={`flex gap-5 ${layout(index) ? "flex-row text-left" : "flex-row-reverse text-right"}`}>
                    <div className="flex flex-col w-[40%] justify-center">
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                    </div>
                    <div className="w-[60%] rounded-sm border border-slate-200 p-1"><img src={item.image} alt="showcase" /></div>
                </div>
            ))}
        </div>
    
  )
}

export default FeaturesShowcase