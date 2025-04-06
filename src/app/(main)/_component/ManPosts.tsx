"use client"

import { InfiniteData, useSuspenseInfiniteQuery} from "@tanstack/react-query";
import getManPosts from "../_lib/getManPosts";
import Post from "./Post";
import type { PageInfo } from "@/model/PageInfo";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function ManPosts() {
  const { 
    data,
    fetchNextPage,
    hasNextPage, 
    isFetching, 
  } = useSuspenseInfiniteQuery<PageInfo, object, InfiniteData<PageInfo>, [_1: string, _2: string], number>({
    queryKey: ['posts', 'mans'], 
    queryFn: getManPosts,
    initialPageParam:0,
    getNextPageParam: (lastPage) => {
      if (Array.isArray(lastPage)) {
        return lastPage.at(-1)?.content[-1].id;
      }
      return undefined; // 배열이 아닐 경우 안전하게 undefined 반환
    },
    staleTime: 60 * 1000, //fresh -> stale로 바뀌는 시간, gcTime보다 작아야함
    gcTime: 300 * 1000, //캐싱한 데이터가 없어지는 시간
    
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <>
      {data?.pages?.map((page, idx) => (
        <Fragment key={idx}>
          {page?.content?.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </Fragment>))}
        <div ref={ref} style={{height: 50}}/>
    </>
  );
}