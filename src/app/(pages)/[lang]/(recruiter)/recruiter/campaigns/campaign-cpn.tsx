'use client'
import Dropdown from '@/components/Dropdown'
import { Link, useRouter } from '@/navigation'
import ResumeType from '@/types/resume'
import Image from 'next/image'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'


interface CampainProps {
    _resumes: Array<ResumeType>
}

export default function Campaign({ _resumes }: CampainProps): JSX.Element {

    const [option, showOption] = useState<boolean>(false)
    return (
        <main className="flex flex-col w-full px-2 mt-3 lg:px-6 lg:gap-y-4 gap-y-2">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Chiến dịch</h2>
            </div>
            <h2>Bạn muốn tìm CV cho chiến dịch nào:</h2>
            <div className="flex flex-col pt-6 lg:items-center lg:justify-between lg:px-14 lg:flex-row gap-y-3">
                <Dropdown
                    type="click"
                    position="bottomRight"
                    render={
                        <div className="relative w-[350px] text-sm font-medium">
                            <div
                                onClick={() => showOption(!option)}
                                className="flex items-center justify-between w-full p-3 border rounded cursor-pointer border-primary"
                            >
                                <span className="pointer-events-none">Mới nhất</span>
                                <span className="pointer-events-none">
                                    {option ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                            </div>
                        </div>
                    }
                >
                    <Dropdown.Header>
                        <div className="text-lg font-bold text-emerald-400">
                            Vui lòng chọn
                        </div>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    {dropdownData.map((item) => (
                        <Dropdown.Item key={item.id}>{item.content}</Dropdown.Item>
                    ))}
                </Dropdown>
                <div>
                    <span>hoặc</span>
                </div>
                <div>
                    <Link href="#" className="text-blue-500">
                        Tạo chiến dịch mới
                    </Link>
                </div>
            </div>

            <h1 className="pt-6 font-bold">Danh sách CV phù hợp:</h1>

            <div className="content h-[420px] overflow-y-auto">
                <div className="grid grid-cols-1 pt-3 lg:grid-cols-3 gap-x-5">
                    {_resumes.map((resume) => (
                        <ItemCV key={resume.id} data={resume} />
                    ))}
                </div>
            </div>
        </main>
    )
}

function ItemCV({ data }: { data: ResumeType }): JSX.Element {
    const router = useRouter()
    return (
        <div
            onClick={() => router.push('/recruiter/resume-details/1')} // temporary
            className="w-full h-[193px] lg:p-4 p-1 bg-slate-200 rounded-md mt-6 cursor-pointer hover:bg-slate-300 transition-all"
        >
            <div className="flex items-center justify-between mt-3 gap-x-5 lg:mt-0">
                <Image
                    width={undefined}
                    height={undefined}
                    alt=''
                    src={`${data.jobSeeker.profileImageId || '/public/candidate.png'}`}
                    className="lg:w-[110px] lg:h-[162px] w-[80px] h-[120px] object-cover rounded-md"
                />
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <h1 className="inline font-bold">{data.jobSeeker.name}</h1>
                        <span>{data.jobSeeker.dateOfBirth}</span>
                    </div>
                    <p>Fullstack developer</p>
                    <div className="flex flex-col pt-3 gap-y-2">
                        <p>
                            <strong>Kinh nghiệm:</strong> 2 năm
                        </p>
                        <p>
                            <strong>Bằng cấp:</strong> Đại học
                        </p>
                        <p>
                            <strong>Kỹ năng:</strong> Java, VueJs
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const dropdownData = [
    {
        id: 1,
        content: 'Chiến dịch một',
    },
    {
        id: 2,
        content: 'Chiến dịch hai',
    },
    {
        id: 3,
        content: 'Chiến dịch ba',
    },
]
