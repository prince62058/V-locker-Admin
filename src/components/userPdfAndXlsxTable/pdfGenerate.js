import axios from 'axios';
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const generateUserPdfData = async ({ url, totalPages, loading }) => {
  loading(true);
  try {
    const pagePromises = [];

    for (let page = 1; page <= totalPages; page += 1) {
      pagePromises.push(fetchData(url, page));
    }

    const isData = await Promise.all(pagePromises);
    const combinedData = isData.flat();

    pdfGenerator(combinedData);
  } catch (error) {
    console.log(error, 'pdf');
  } finally {
    loading(false);
  }
};

// Original pdfGenerator function
const pdfGenerator = (data) => {
  const doc = new JsPDF();

  const newData = data?.map((ele, i) => [
    i + 1,
    `${ele?.userName || '-'}`,
    `${ele?._id || '-'}`,
    `${ele?.email || '-'}`,
    `${ele?.phoneNumber || '-'}`,
    ele?.createdAt ? `${fDateTime(new Date(ele?.createdAt) || '-') || '-'}` : '-',
  ]);

  autoTable(doc, {
    head: [['S.No', 'Full Name', 'UserId', 'Email', 'Phone No.', 'Registration Date']],
    body: [...newData],
    columnStyles: {
      0: { cellWidth: 10 }, // S.No
      1: { cellWidth: 30 }, // Full Name
      2: { cellWidth: 40 }, // UserId
      3: { cellWidth: 40 }, // Email
      4: { cellWidth: 30 }, // Phone No.
      5: { cellWidth: 30 }, // Registration Date
    },
  });
  const fileName = 'User Record List.pdf';

  doc.save(fileName);
};
