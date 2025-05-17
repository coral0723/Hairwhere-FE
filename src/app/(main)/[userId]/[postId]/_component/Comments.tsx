"use client"

import { Comment as IComment} from "@/model/Comment"
import { useQuery } from "@tanstack/react-query"
import { getComments } from "../_lib/getComments"
import { Fragment } from "react"
import Comment from "./Comment"

type Props = {
  postId: string
}

export default function Comments({postId}: Props) {
  const {data} = useQuery<IComment[], object, IComment[], [_1: string, _2: string]>({
    queryKey: ['comments', postId],
    queryFn: getComments,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000
  })
  return (
    <>
      {data?.map((comment, idx) => (
        <Fragment key={idx}>
          <Comment key={comment.id} comment={comment} postId={postId}/>
        </Fragment>
      ))}
    </>
  )
}