import { format } from 'date-fns';

import BaseService from './baseService';

import PostType, { PostActiveStatus } from '@/types/post';
import envConfig from '@/config';

class PostService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/posts`;
  private apiElasticUrl = `${envConfig.NEXT_PUBLIC_ELASTIC}/api/post`;

  async getPosts(props?: {
    page?: number;
    pageSize?: number;
    sortBy?: string[];
    search?: string;
    categoryId?: string;
    professionId?: string;
    minSalary?: number;
    maxSalary?: number;
    provinceName?: string;
    workingFormat?: string;
    recruiterId?: string;
    businessId?: string;
    activeStatus?: string;
    fromDate?: string;
    toDate?: string;
    isExpired?: boolean | string;
  }) {
    const params = new URLSearchParams();
    props?.page && params.append('page', props.page.toString());
    props?.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.sortBy &&
      props.sortBy.map((element) => params.append('sortBy', element));

    props?.search && params.append('search', props!!.search!!);
    props?.categoryId && params.append('categoryId', props.categoryId);
    props?.professionId && params.append('professionId', props.professionId);
    props?.minSalary && params.append('minSalary', props.minSalary.toString());
    props?.maxSalary && params.append('maxSalary', props.maxSalary.toString());
    props?.provinceName &&
      params.append('provinceName', props.provinceName.toString());
    props?.workingFormat && params.append('workingFormat', props.workingFormat);
    props?.recruiterId && params.append('recruiterId', props.recruiterId);
    props?.businessId && params.append('businessId', props.businessId);
    // props?.activeStatus && params.append('activeStatus', props.activeStatus)
    props?.fromDate &&
      params.append('fromDate', format(new Date(props.fromDate), 'dd/MM/yyyy'))
    props?.toDate &&
      params.append('toDate', format(new Date(props.toDate), 'dd/MM/yyyy'));
    props?.isExpired && params.append('isExpired', props.isExpired.toString())

    const url = params.toString().length
      ? `${this.apiElasticUrl}?${params.toString()}`
      : this.apiElasticUrl
    // const res = await fetch(url);

    // this.checkResponseNotOk(res);
    return [
      {
        "id": "660fb32bebddec564a76ef5e",
        "title": "AI smart Test",
        "profession": {
          "id": "65e097a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": 15000000,
        "minSalaryString": "15 tr VND",
        "maxSalary": 20000000,
        "maxSalaryString": "20 tr VND",
        "currency": "VND",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Khánh Hòa",
            "specificAddress": "Xuân Hòa 2"
          },
          {
            "provinceName": "An Giang",
            "specificAddress": "An GIang 1"
          }
        ],
        totalViews: 0,
        "business": {
          "id": "65ffccad48887841f8677c93",
          "name": "Company Tech",
          "profileImageId": "6b58410c-e154-444d-a2dd-69ee3ad6c39f"
        },
        "workingFormat": "full-time",
        "applicationDeadline": "2024-08-20",
        "createdAt": "2024-04-05"
      },
      {
        "id": "65e4a54df0456cc31efe9ae0",
        "title": "TRÌNH DƯỢC VIÊN OTC THÁI NGUYÊN - HÒA BÌNH - LÀO CAI",
        "profession": {
          "id": "65e097a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hòa Bình",
            "specificAddress": ""
          }
        ],
        totalViews: 0,
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>THÁI NGUYÊN - HÒA BÌNH - LÀO CAI</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 13,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        activeStatus: 'Opening',
        createdAt: "",
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e49f39f0456cc31efe9508",
        "title": "Chuyên Viên Cao Cấp Thương Hiệu",
        "profession": {
          "id": "65e097a5bfdb92a961c286d3",
          "name": "Quảng cáo / Đối ngoại / Truyền Thông",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        totalViews: 0,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          }
        ],
        activeStatus: 'Opening',
        createdAt: "",
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>- Trực tiếp giám sát quản lý thương hiệu, kiểm soát hình ảnh đảm bảo tính tuân thủ và bảo hộ thương hiệu Tập đoàn và các thương hiệu ngành (BIM Land, BIM Energy, BIM Foods...).</p> <p>- Tham gia xây dựng, triển khai kế hoạch tổng thể thúc đẩy sự phát triển của thương hiệu tập đoàn BIM Group và các ngành kinh doanh theo phân công của Trưởng phòng/Chuyên gia.</p> <p>- Triển khai kế hoạch phát triển, quảng bá và quản trị thương hiệu của công ty, đảm bảo hình ảnh thương hiệu của công ty được sử dụng chính xác, hợp lý và đúng tiêu chuẩn trên các phương tiện truyền thông.</p> <p>- Trực tiếp xử lý nhằm kiểm soát khủng hoảng truyền thông mạng xã hội để bảo vệ uy tín của Tập đoàn, các ngành kinh doanh, điểm đến, dự án và các đơn vị thành viên theo phân công của Trưởng phòng.</p> <p>- Tìm kiếm thông tin hỗ trợ Trưởng phòng trong công tác xây dựng kế hoạch. Trực tiếp tham gia vận hành hoạt động tài trợ, CSR. </p> <p>- Xây dựng, quản lý về ngân sách, tham gia xây dựng các quy định, quy trình thuộc phạm vi, quy mô công việc được giao.</p> <p>- Các nhiệm vụ khác theo sự phân công bởi cấp trên.</p> </div>",
        "yearsOfExperience": "5 - 10 Năm",
        "otherRequirements": "Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-08-03T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e4885e74a6b32a5ac4efc2",
          "name": "BIM Group",
          "profileImageId": "ab7bdb0e-dc91-49d1-98f5-7817ce961b85"
        }
      },
      {
        "id": "65e4a52248f0456cc31efe9adc",
        "title": "1 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e097a4bfdb92a961c286a62",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 25000000,
        "maxSalaryString": "25tr",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e444a548f0456cc31efe9adc",
        "title": "2 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e097a4bfdb392a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e4a2548f0456cc31efe9adc",
        "title": "3 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e0974a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e43548f0456cc31efe9adc",
        "title": "4 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e2097a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e4a548f04456cc31efe9adc",
        "title": "5 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e0297a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e4a54558f0456cc31efe9adc",
        "title": "6 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e0975a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      },
      {
        "id": "65e4a548f110456cc31efe9adc",
        "title": "7 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e097a4bf22db92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      }, 
      {
        "id": "65e4a548f0456cc31efe559adc",
        "title": "8 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e04497a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      }, 
      {
        "id": "65e4a52348f045226cc31efe9adc",
        "title": "9 TRÌNH DƯỢC VIÊN OTC HÀ NỘI - HẢI PHÒNG - HƯNG YÊN",
        "profession": {
          "id": "65e014197a4bfdb92a961c286a6",
          "name": "Bán hàng / Kinh doanh",
          categoryId: "65e097a4bfdb92a961c286a5"
        },
        "minSalary": -9223372036854775808,
        "minSalaryString": "Cạnh tranh",
        "maxSalary": 9223372036854775807,
        "maxSalaryString": "Cạnh tranh",
        // "currency": null,
        activeStatus: 'Opening',
        totalViews: 0,
        createdAt: "",
        "level": {
          "id": "64cdbe0be84b6f0a08a90cee",
          "name": "Nhân viên"
        },
        "locations": [
          {
            "provinceName": "Hà Nội",
            "specificAddress": ""
          }
        ],
        "workingFormat": "Nhân viên chính thức",
        "benefits": [
          {
            "id": "64cc6b4c1f4068147ecf50b8",
            "name": "Chăm sóc sức khỏe"
          },
          {
            "id": "64cc6ba91f4068147ecf50bc",
            "name": "Phụ cấp"
          },
          {
            "id": "64cc6bd11f4068147ecf50be",
            "name": "Đồng phục"
          }
        ],
        "description": "<div class=\"detail-row reset-bullet\"> <h2 class=\"detail-title\">Mô tả Công việc</h2> <p>Do nhu cầu mở rộng sản xuất kinh doanh, công ty Cổ phần Xuất nhập khẩu Y tế DOMESCO có nhu cầu tuyển dụng như sau:</p> <p><em><u>- Nơi làm việc: </u></em>HÀ NỘI - HẢI PHÒNG - HƯNG YÊN</p> <p><em><u>- </u></em><em><u>Mức lương:</u></em> Cạnh tranh, tùy thuộc vào năng lực và hiệu quả của từng ứng viên</p> <p><em><u>- Công việc cần tuyển dụng</u></em><em><u>:</u></em> Đi định vị theo tuyến, giới thiệu sản phẩm của Công ty, Chăm sóc khách hàng, mở rộng và phát triển thị trường, tăng độ phủ khách hàng và sản phẩm, lập các kế hoạch bán hàng và các báo cáo liên quan đến công việc bán hàng.</p> </div>",
        "yearsOfExperience": "1 - 3 Năm",
        "otherRequirements": "Bằng cấp: Trung cấp</br>Độ tuổi: Không giới hạn tuổi</br>Lương: Cạnh tranh",
        "requisitionNumber": 17,
        "applicationDeadline": "2024-05-18T00:00:00",
        "jdId": null,
        "recruiterId": null,
        "business": {
          "id": "65e48a4ae9406098c28bcbf5",
          "name": "Công ty CP Xuất Nhập Khẩu Y Tế Domesco",
          "profileImageId": "80c51b20-18c8-4cae-a1d7-badd9080328e"
        }
      }
    ] as PostType[]
    // return await this.getResponseData<PostType[]>(res);    
  }

  async getPostById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`);

    this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }

  async createPost(req: FormData) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      body: req,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }

  async updatePostHeadingInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/headingInfo`;
    return this.updatePost(url, req);
  }

  async updatePostGeneralInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/generalInfo`;
    return this.updatePost(url, req);
  }

  async updatePostDetailedInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/detailedInfo`;
    return this.updatePost(url, req);
  }

  async updatePostStatus(id: string, activeStatus: PostActiveStatus) {
    const url = `${this.apiBaseUrl}/${id}/status`;
    return this.updatePost(url, { activeStatus });
  }

  private async updatePost(url: string, req: object) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }
}

const postService = new PostService();
export default postService;
