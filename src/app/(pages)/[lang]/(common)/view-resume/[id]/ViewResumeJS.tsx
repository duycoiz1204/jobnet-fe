'use client'
import { useState } from 'react'
import { FaCaretDown, FaCaretUp, FaHive } from 'react-icons/fa6'
import ResumeType from '@/types/resume'
import EvaluationType, { CommentType } from '@/types/evaluation'
import recruiterService from '@/services/recruiterService'

interface ViewResumeProps{
  _resume: ResumeType
  _comments: EvaluationType[],
  _file: string
}

const ViewResumeJS = ({_resume, _comments, _file} : ViewResumeProps) => {
  const [resume, setResume] = useState<ResumeType>(_resume)
  const [comments, setComments] = useState<EvaluationType[]>(_comments)
  const [file, setFile] = useState<string>(_file)

  return (
    <div>
      <div className="grid grid-cols-6 gap-x-2">
        <div className="h-screen col-span-4 bg-slate-300">
          <iframe
            title="PDF Viewer"
            src={"/admin.png"}
            className="w-full h-full text-white bg-slate-100"
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>

        <div className="h-screen col-span-2 p-4 bg-gray-50">
          <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 rounded-full">
              <img src={'/admin.png'} alt="" className="w-full h-full rounded-full" />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">{resume?.jobSeeker.name}</p>
              <p className="text-sm opacity-75">
                {resume?.jobSeeker.email || 'trongduc05032002@gmail.com'}
              </p>
            </div>
          </div>
          <hr className="my-3 bg-slate-500" />
          <div className="flex items-center w-32 ml-auto"></div>

          <div className="flex flex-col">
            <div className="w-full flex flex-col gap-y-4 mt-2 overflow-y-scroll pr-2 h-[600px]">
              {comments?.map((item, key) => (
                <ItemRecruterCommented
                  key={key}
                  image={item.recruiter?.id}
                  name={item.recruiter?.name}
                  content={item.comments}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewResumeJS

type CommentDetails = {
  image: string
  name: string
  content?: CommentType[]
}

function ItemRecruterCommented({ image, name, content }: CommentDetails) {
  const [isShow, setIsShow] = useState(false)
  return (
    <>
      <div
        onClick={() => setIsShow(!isShow)}
        className="relative flex items-center p-3 transition-all rounded-lg cursor-pointer gap-x-4 bg-slate-200 hover:bg-slate-300"
      >
        <div className="w-12 h-12 border rounded-full border-emerald-500">
          <img
            src={recruiterService.getRecruiterProfileImage(image)}
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium">{name} đã đưa ra ý kiến!</p>
          <p className="text-xs opacity-75">Công ty TNHH Bigone</p>
        </div>
        <div className="absolute top-1 flex items-center left-[76px] gap-x-1">
          <p className="text-[10px] opacity-50">Recruiter</p>
          <FaHive className="text-xs text-emerald-600" />
        </div>
        <div className="ml-auto text-xl opacity-40">
          {isShow ? <FaCaretUp /> : <FaCaretDown />}
        </div>
      </div>
      <div>
        {isShow && (
          <div className="max-h-96 -mt-1 w-[80%] overflow-y-scroll ml-auto flex flex-col gap-y-4 pr-4">
            {content?.map((item) => (
              <ItemCommentDetail
                content={item.content}
                recruiterImage={image}
                dateCreated={item.createdAt}
                key={item.id}
                recruiterName={name}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

type CommentMoreDetail = {
  content: string
  dateCreated: string
  recruiterImage: string
  recruiterName: string
}
function ItemCommentDetail({
  content,
  dateCreated,
  recruiterImage,
  recruiterName,
}: CommentMoreDetail) {
  return (
    <div className="relative flex w-full transition-all ease-out gap-x-2">
      <div className="relative flex-1 p-2 transition-all rounded-lg bg-slate-200">
        <div className="flex items-center gap-x-4">
          <div className="w-8 h-8 -translate-y-2 rounded-full">
            <img
              src={recruiterService.getRecruiterProfileImage(recruiterImage)}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <p className="mt-2 text-sm font-semibold">{recruiterName}</p>
            <span className="text-md">{content}</span>
          </div>
        </div>
      </div>
      <span className="absolute text-xs right-2 -bottom-4">{dateCreated}</span>
    </div>
  )
}
