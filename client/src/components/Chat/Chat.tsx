import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"

const Chat = () => {
  return (
    <div className='flex flex-col justify-end h-full p-2 bg-gray-900'>
        <ChatMessages/>
        <ChatInput/>
    </div>
  )
}

export default Chat
