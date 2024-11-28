import { socials } from "../../structure/navigation"

const Footer = () => {

    return(
        <footer className="bg-black border-t py-10 border-neutral-700">
            <div className="grid grid-cols-2 gap-4">
                <div >
                    <h3 className="text-white mx-4 my-4 font-semibold text-left">Socials</h3>
                    <ul className="flex flex-row">
                        {socials.map((link,index)=>( 
                            <>
                                <a className='text-neutral-300 hover:text-white ml-2 mr-2' key={index} target="_blank" href={link.path}>
                                    <img key={index} src={link.logo} className="flex flex-row mx-2 invert w-10 h-10"></img>
                                </a>
                            </>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer