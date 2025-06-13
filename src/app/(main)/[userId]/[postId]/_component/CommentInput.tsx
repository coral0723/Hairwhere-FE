"use client"

import style from './commentInput.module.css';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useRouter} from "next/navigation";
import { Comment } from '@/model/Comment';
import { authApi } from '@/app/(main)/_lib/axios';

type Props = {
  postId: string
}

export default function CommentInput({postId}: Props) {
  const myId = localStorage.getItem("id");
  const myKakaoId = localStorage.getItem("kakaoId");
  const myName = localStorage.getItem("nickName");
  const myProfile = localStorage.getItem("profileImagePath");
  const queryClient = useQueryClient();
  const [text, setText] = useState<string>("");
  const router = useRouter();

  const addComment = useMutation({
    mutationFn: () => {
      return authApi.post(`/comment/${postId}`, {
        content: text
      })
    }, 
    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if(queryKey[0] === "comments" && queryKey[1] === postId) {
          const value: Comment[] | undefined = queryClient.getQueryData(queryKey);
          const shallow = value ? [...value] : [];
          const newComment:Comment = {
            id: shallow.length === 0 ? 1: shallow[shallow.length-1].id + 1,
            photoId: Number(postId),
            content: text,
            user: {
              id: myId || '',
              kakaoId: myKakaoId || '',
              nickName: myName || '',
              profileImagePath: myProfile || '',
            },
            replies: [],
            createdAt: new Date()
          };
          shallow.unshift(newComment);
          queryClient.setQueryData(queryKey, shallow);
        }
      })
    },
    onSuccess(responseData) {
      setText('');
      console.log("댓글 달기 성공: ", responseData);
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if(queryKey[0] === "comments" && queryKey[1] === postId) {
          const value: Comment[] | undefined = queryClient.getQueryData(queryKey);
          if (value) {
            const shallow = [...value];
            // 첫 번째 댓글(방금 추가한 임시 댓글)의 id를 서버 응답의 id로 교체
            if (shallow.length > 0) {
              shallow[0] = {
                ...shallow[0],
                id: responseData.data.id // 또는 responseData.id (서버 응답 구조에 따라)
              };
            }
            queryClient.setQueryData(queryKey, shallow);
          }
        }
      })
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
    }
  })

  const onAddComment = () => {
    if(!myName && !myKakaoId) {
      router.push('/login');
      return;
    } else {
      addComment.mutate();
      return;
    }
  }

  return (
    <>
      <div className={style.commentInput}>
          { myName && myProfile ?
            <Avatar src={myProfile} className={style.profile}/>
            : <Avatar icon={<UserOutlined/>} className={style.profile}/>
          }
          <textarea 
            className={style.textArea} 
            placeholder="댓글 작성..."
            spellCheck={false}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          { text && <button className={style.commentButton} onClick={onAddComment}>등록</button> }
        </div>
    </>
  )
}