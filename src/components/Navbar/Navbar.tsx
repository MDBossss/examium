import { DocumentIcon,PlusCircleIcon } from '@heroicons/react/24/solid';
import { Button } from '../ui/button';

const Navbar = () => {
  return (
    <div className="p-3 flex flex-col gap-10 w-60 bg-gray-200 h-screen">
        <div className='flex gap-3 items-center text-xl'>
            <DocumentIcon className="h-7 w-7 text-blue-500"/>
            <h1 className=' font-normal text-2xl text-gray-700 font-sans tracking-tight'>examium</h1>
        </div>
        <Button className='bg-blue-500 hover:bg-blue-600 flex gap-2'>New test <PlusCircleIcon className='w-6 h-6'/></Button>
    </div>
  )
}

export default Navbar