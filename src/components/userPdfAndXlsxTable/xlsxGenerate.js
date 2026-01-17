import axios from 'axios';
import * as XLSX from 'xlsx';

import { fDateTime } from 'src/utils/format-time';

// Function to fetch data from a specific page
const fetchData = async (url, page) => {
  const userToken = JSON.parse(sessionStorage.getItem('jwt_access_token'));
  const token = userToken?.token;
  try {
    const res = await axios.get(`${url}&page=${page}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return res.data?.data;
  } catch (error) {
    return { data: [] };
  }
};

export const generateUserExcelData = async ({ url, totalPages, loading }) => {
  loading(true);
  try {
    const pagePromises = [];

    for (let page = 1; page <= totalPages; page += 1) {
      pagePromises.push(fetchData(url, page));
    }

    const isData = await Promise.all(pagePromises);

    const combinedData = isData.flat();

    exportToExcel(combinedData);
  } catch (error) {
    console.log(error, 'xlsx');
  } finally {
    loading(false);
  }
};

const exportToExcel = (allListData) => {
  const data = allListData?.map((ele, i) => ({
    'S.No': i + 1,
    Name: `${ele?.userName || '-'}`,
    UserId: `${ele?._id || '-'}`,
    Email: `${ele?.email || '-'}`,
    'Phone No.': `${ele?.phoneNumber || '-'}`,
    'Registration Date': ele?.createdAt
      ? `${fDateTime(new Date(ele?.createdAt) || '-') || '-'}`
      : '-',
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'User List');

  // Set column widths
  worksheet['!cols'] = [
    { wpx: 50 },
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 200 },
    { wpx: 150 },
    { wpx: 200 },
  ];

  // Get the range of the worksheet to ensure all cells exist
  const range = XLSX.utils.decode_range(worksheet['!ref']);

  // Apply styles to header cells if they exist
  if (range.s.r === 0) {
    const headerStyle = {
      fill: { fgColor: { rgb: 'FFFFA500' } }, // Orange background color
      font: { color: { rgb: 'FFFFFFFF' }, bold: true, sz: 12 }, // White font color, bold, and size 12
    };
    worksheet.A1.s = headerStyle;
    worksheet.B1.s = headerStyle;
    worksheet.C1.s = headerStyle;
    worksheet.D1.s = headerStyle;
    worksheet.E1.s = headerStyle;
    worksheet.F1.s = headerStyle;
  }

  // Save to file
  XLSX.writeFile(workbook, 'User List.xlsx');
};
