import { QueryFunction } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "@/model/Comment";

export const getRecomments: QueryFunction<Comment[], [_1: string, _2: string, _3: string]>
 = async ({ queryKey }) => {
  try {
    const [, postId, parentId] = queryKey;

    //msw용
    // const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/comment/getComments/${postId}?parentId=${parentId}`);
    // return res.data.result;

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comment/getComments/${postId}?parentId=${parentId}`);
    return res.data;
  } catch (error) {
    console.error('에러 상세 정보:', error);
    throw error;
  }
 }