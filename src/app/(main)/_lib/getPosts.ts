import axios from "axios";

type Props = {pageParam?: number};

export default async function getPosts({pageParam}: Props) {
  try {
    //msw용
    // const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/photo/find/all?page=${pageParam}&size=15`);
    // return response.data.result;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/photo/find/all?page=${pageParam}&size=15`);
    return response.data;
  } catch (error) {
    console.error('에러 상세 정보:', error);
    throw error;
  }
};