import { Link } from "@/navigation"

type Profession = {
  name: string
  total: number
}


export type CategoriesCompose = {
  category: string,
  professions: Profession[]
}

type CategoryProps = {
  categoriesData: CategoriesCompose[]
}

type LocationProps = {
  region: string
  city: string[]
}

export default function CategoriesCpn({ categoriesData }: CategoryProps) {
  return (
    <div className="pt-20 border-box">
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="p-5 lg:w-3/4 sm:w-2/4 left">
          <h1 className="text-lg">
            <b>Find Jobs by Categories</b>
          </h1>
          <hr className="mt-2 mb-2 border-slate-400 border-1" />
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-x-6">
            {categoriesData.map((item, index) => {
              return <RenderProfessionItem key={index} category={item} />
            })}
          </div>
        </div>
        <div className="flex flex-col w-full p-4 lg:w-1/4 sm:w-2/4 right gap-y-3">
          <div className="flex flex-col p-6 bg-gray-100 gap-y-3 Type">
            <b className="text-lg">Jobs by Type</b>
            {jobTypes.map((item, index) => {
              return (
                <div key={index} className="flex justify-between w-full ">
                  <a
                    href="#"
                    className="text-sm font-medium text-stone-600 hover:text-blue-500"
                  >
                    {item.type}
                  </a>
                  <a
                    href="#"
                    className="font-medium text-emerald-500 hover:text-blue-500"
                  >
                    {item.total}
                  </a>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col p-6 bg-gray-100 gap-y-2 Type">
            <b className="text-lg">Jobs by Location</b>
            {jobLocation.map((item, index) => {
              return <RenderLocationCity key={index} data={item} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const RenderProfessionItem = ({ category }: { category: CategoriesCompose }) => {
  return (
    <div className="box-border flex flex-col p-6 pl-0">
      <h2 className="text-lg text-blue-800 industry font-bold">
        {category.category}
      </h2>
      <hr className="mt-2 mb-2 border-blue-400 border-1" />
      <div className="flex flex-col sm:gap-y-4 lg:gap-1 content">
        {category.professions.map((item, index) => (
          <div key={index} className="flex justify-between w-full ">
            <Link
              href="#"
              className="text-sm font-medium break-all text-stone-600 hover:text-blue-500"
            >
              {item.name}
            </Link>
            <Link
              href="#"
              className="font-medium text-emerald-500 hover:text-blue-500"
            >
              {item.total}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

const RenderLocationCity = ({ data }: { data: LocationProps }) => {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <b>
        {data.region != 'Overseas Jobs'
          ? `Jobs in ${data.region}`
          : data.region}
      </b>
      {data.city.map((item, index) => (
        <Link
          key={index}
          href="#"
          className="ml-2 text-sm font-medium text-stone-600 hover:text-blue-500"
        >
          Job in {item}
        </Link>
      ))}
    </div>
  )
}


const jobTypes = [
  {
    type: '$1000 + jobs',
    total: 439,
  },
  {
    type: 'Entry Level / Internship',
    total: 439,
  },
  {
    type: 'Executive managements',
    total: 439,
  },
  {
    type: 'Contract/ Freelance',
    total: 439,
  },
  {
    type: 'Temporary / Project',
    total: 439,
  },
]

const jobLocation = [
  {
    region: 'Viet Nam',
    city: ['Ho Chi Minh', 'Nha Trang', 'Dong Nai', 'Binh Duong', 'Ha Noi'],
  },
  {
    region: 'Overseas Jobs',
    city: ['Japan', 'Malaysia', 'Singapore', 'Cambodia'],
  },
]
