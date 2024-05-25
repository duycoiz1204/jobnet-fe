import {
  FaArrowRight,
  FaMicrochip,
  FaMoneyBillTrendUp,
  FaSackDollar,
  FaUserNurse,
} from 'react-icons/fa6';

const vite = '/vite.png';
const chart = '/bar-chart.png';
const analycs = '/data-analycs.png';

export default function DashBoard() {
  return (
    <main className="p-3 py-4 h-screen overflow-y-scroll lg:p-6">
      <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-3">
        <Item data={data} />
      </div>

      <div className="grid grid-rows-2">
        <div className="grid grid-cols-1 gap-3 mt-6 lg:gap-5 lg:grid-cols-3">
          <ItemPopular />
          <ItemReport />
          <ItemPopular />
        </div>
      </div>
    </main>
  );
}

interface ItemTemplate {
  id: number;
  image: string;
  backgroundColor: string;
  title: string;
  summary: number;
  chart: string;
  number: string;
}

const data = [
  {
    id: 1,
    image: vite,
    backgroundColor: 'bg-[#40189d]',
    title: 'Bài đăng',
    summary: 1000,
    chart,
    number: '1.5%',
  },
  {
    id: 2,
    image: vite,
    backgroundColor: 'bg-[#48a9f8]',
    title: 'Người tìm việc',
    summary: 80,
    chart,
    number: '1.7%',
  },
  {
    id: 3,
    image: vite,
    backgroundColor: 'bg-[#22c55e]',
    title: 'Doanh nghiệp',
    summary: 500,
    chart,
    number: '1.2%',
  },
];

function Item({ data }: { data: ItemTemplate[] }) {
  return (
    <>
      {data.map((item) => (
        <div
          key={item.id}
          className={`lg:p-10 p-4 w-full items-starts h-[250px] text-white ${item.backgroundColor} flex flex-col justify-start rounded-2xl cursor-pointer transition-all hover:bg-emerald-400 border`}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start gap-y-3">
              <div className="w-16 h-16 rounded-lg">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full rounded-lg"
                />
              </div>
              <span className="text-4xl font-bold">{item.summary}</span>
              <h1 className="lg:text-xl text-md">{item.title}</h1>
            </div>
            <div className="flex flex-col items-center w-16 h-16 gap-2 rounded-lg">
              <img
                src={item.chart}
                alt=""
                className="w-full h-full rounded-lg"
              />
              <span className="font-semibold">{item.number}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const ItemPopular = () => {
  return (
    <div className="col-span-2 h-[250px] w-full bg-[#f7f7ff] px-8 py-4 rounded-2xl">
      <h1 className="text-2xl font-semibold">Lĩnh vực phổ biến</h1>
      <div className="flex flex-col pt-4 gap-y-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-5">
            <div className="flex items-center lg:flex-row flex-cols gap-x-3">
              <FaMicrochip className="text-[#fe7d7e]" />
              <h3 className="text-base font-semibold text-slate-600">
                Công nghệ thông tin
              </h3>
            </div>
            <div className="flex items-center gap-x-3">
              <FaSackDollar className="text-[#a8adff]" />
              <h3 className="text-base font-semibold text-slate-600">
                Kinh tế
              </h3>
            </div>
            <div className="flex items-center gap-x-3">
              <FaUserNurse className="text-[#8cd7f5]" />
              <h3 className="text-base font-semibold text-slate-600">
                Sức khỏe
              </h3>
            </div>
            <div className="flex items-center gap-x-3">
              <FaMoneyBillTrendUp className="text-emerald-500" />
              <h3 className="text-base font-semibold text-slate-600">
                Tài chính
              </h3>
            </div>
          </div>
          <div className="flex flex-col mt-1 gap-y-5">
            <div className="flex items-center gap-x-3">
              2250
              <div className="lg:inline-block hidden w-[400px] h-3 bg-[#fe7d7e] rounded"></div>
            </div>
            <div className="flex items-center gap-x-3">
              2210
              <div className="lg:inline-block hidden w-[400px] h-3 bg-[#a8adff] rounded"></div>
            </div>
            <div className="flex items-center gap-x-3">
              2001
              <div className="lg:inline-block hidden w-[400px] h-3 bg-[#8cd7f5] rounded"></div>
            </div>
            <div className="flex items-center gap-x-3">
              1910
              <div className="lg:inline-block hidden w-[400px] h-3 bg-emerald-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemReport = () => {
  return (
    <div className="lg:row-span-2 row-span-full h-full w-full bg-[#f7f7ff] lg:p-6 p-2 rounded-2xl">
      <h1 className="pb-3 text-2xl font-bold">Thông kê</h1>
      <div className="mx-auto w-[200px] h-[200px]">
        <img src={analycs} className="w-full h-full" alt="" />
      </div>
      <div className="flex items-center justify-between pr-2 mt-6 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-slate-200">
        <div className="flex items-center gap-x-4">
          <div className="w-1 rounded-lg h-[60px] bg-[#fe7d7e]"></div>
          <div>
            <p className="text-lg font-semibold">1150</p>
            <p>Thống kê chi thiết</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold opacity-50"> +122</span>
          <span className="p-3 transition-all cursor-pointer bg-slate-200 rounded-2xl hover:text-emerald-500 hover:bg-slate-300">
            <FaArrowRight />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pr-2 mt-2 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-slate-200">
        <div className="flex items-center gap-x-4">
          <div className="w-1 rounded-lg h-[60px] bg-[#a8adff]"></div>
          <div>
            <p className="text-lg font-semibold">1150</p>
            <p>Thống kê chi thiết</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold opacity-50"> +122</span>
          <span className="p-3 transition-all cursor-pointer bg-slate-200 rounded-2xl hover:text-emerald-500 hover:bg-slate-300">
            <FaArrowRight />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pr-2 mt-2 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-slate-200">
        <div className="flex items-center gap-x-4">
          <div className="w-1 rounded-lg h-[60px] bg-[#8cd7f5]"></div>
          <div>
            <p className="text-lg font-semibold">1150</p>
            <p>Thống kê chi thiết</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold opacity-50"> +122</span>
          <span className="p-3 transition-all cursor-pointer bg-slate-200 rounded-2xl hover:text-emerald-500 hover:bg-slate-300">
            <FaArrowRight />
          </span>
        </div>
      </div>
    </div>
  );
};
