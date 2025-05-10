"use client"

import { User } from "@/model/User";
import UserPosts from "./UserPosts"
import style from './userInfo.module.css';
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../_lib/getUser";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

type Props = {
  userId: string,
}

export default function UserInfo({userId}: Props) {
  const {data: user, error} = useQuery<User, Object, User, [_1: string, _2: string]>({
    queryKey: ['users', userId],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  if(error) {
    return (
      <>
        <div className={style.header}>
          <span>프로필</span>
        </div>
        <div className={style.body}>
          <div className={style.container}>
            <div className={style.profileDiv}>
              <div className={style.profile}></div>
            </div>
          </div>
          <div style={{
            height: 100,
            alignItems: 'center',
            fontSize: 31,
            fontWeight: 'bold',
            justifyContent: 'center',
            display: 'flex'
          }}>
            계정이 존재하지 않음
          </div>
        </div>
      </>
    )
  }
  if(!user) {
    return null;
  }
  return (
    <>
      <div className={style.header}>
        <span>프로필</span>
      </div>
      <div className={style.body}>
        <div className={style.container}>
          <div className={style.profileDiv}>
            {user.profileImagePath ?
            <Avatar src={user.profileImagePath} className={style.profile}/> : 
            <Avatar icon={<UserOutlined />} className={style.profile}/>}
            <div className={style.nickname}>{user.nickName}</div>
          </div>
        </div>
        <div className={style.postsWrapper}>
          <UserPosts userId={userId}/>
        </div>
      </div>
    </>
  )
}