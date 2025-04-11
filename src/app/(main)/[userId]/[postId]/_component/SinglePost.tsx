"use client";

import style from "./singlePost.module.css";
import Link from "next/link";
import Header from "./Header";
import ImageSlider from "./ImageSlider";
import { Avatar, Divider } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "../_lib/getSinglePost";
import { Post } from "@/model/Post";
import { useRef } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { UserOutlined } from "@ant-design/icons";
import { Tag } from 'antd';

dayjs.locale('ko');
dayjs.extend(relativeTime)

type Props = {
  postId: string;
}

export default function SinglePost({postId}: Props) {
  const textRef = useRef<HTMLSpanElement>(null);

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText)
        .then(() => {
          alert('주소가 클립보드에 복사되었습니다.');
        })
        .catch((err) => {
          console.error('복사 중 에러 발생:', err);
        });
    }
  };

  const {data: post, error} = useQuery<Post, object, Post, [_1: string, _2: string]>({
    queryKey: ['post', postId],
    queryFn: getSinglePost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  if (error) {
    <div style={{
      height: 100,
      alignItems: 'center',
      fontSize: 31,
      fontWeight: 'bold',
      justifyContent: 'center',
      display: 'flex'
    }}>
      게시글을 찾을 수 없습니다.
    </div>
  }
  
  if (!post) {
    return null;
  }

  return (
    <>
      <Header post={post}/>
      <div className={style.imageWrapper}>
        <ImageSlider post={post} />
      </div>
      <div className={style.hairInfoWrapper}>
        <div className={style.hairName}>{post.hairName}</div>
        <div className={style.hairSalon}>
          <Link href={`/salon/${post.hairSalon}/${post.hairSalonAddress}`}>
            {post.hairSalon}
          </Link>
          </div>
        <span className={style.hairSalonAddress} ref={textRef} onClick={copyToClipboard}>{post.hairSalonAddress}</span>
        <div className={style.postDate}>{dayjs(post.created).fromNow(true)} 전</div>
      </div>
      <div className={style.badgeWrapper}>
        <Tag>{post.gender === "male" ? "남성" : "여성"}</Tag>
        <Tag>{post.hairLength}</Tag>
        <Tag>{post.hairColor}</Tag>
      </div>
      {post.kakaoId && (
      <div className={style.userBadge}>
        <Link href={`/${post.kakaoId}`}>
          {post.userProfilePath === '' ?
            <Avatar size={44} icon={<UserOutlined/>} /> :
            <Avatar size={44} src={post.userProfilePath} />
          }
          <div className={style.userName}>{post.nickname}</div>
        </Link>
      </div>
      )}
      <Divider/>
      <div className={style.content}>
        {post.text}
      </div>
    </>
  )
}