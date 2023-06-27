import { useState } from "react"
import { AnswerType } from "../types/models"
import { Checkbox } from "./ui/checkbox"

interface Props{
    answer: AnswerType
}

const QuizAnswer = ({answer}:Props) => {
    const [isChecked,setIsChecked] = useState<boolean>(false)

    const handleCheck = () => {
        setIsChecked(!isChecked);
    }

  return (
    <div className="flex items-center gap-2 p-4 rounded-sm transition-all bg-primary hover:bg-blue-300" onClick={handleCheck}>
        <Checkbox className="" checked={isChecked}/>
        <p>{answer.answer}</p>
    </div>
  )
}

export default QuizAnswer