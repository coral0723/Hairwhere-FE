"use client"

import { MouseEventHandler, useEffect, useState } from 'react';
import SeeMore from './SeeMore';
import style from './header.module.css';
import { useRouter } from 'next/navigation';
import { Post as IPost } from '@/model/Post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/app/(main)/_lib/axios';

type Props = {
  post: IPost;
};

export default function Header({ post }: Props) {
  const [nickName, setNickName] = useState<string>('');
  const queryClient = useQueryClient();
  const router = useRouter();
  
  useEffect(() => {
    setNickName(localStorage.getItem('nickName') || '');
  }, []);

  const liked = !!post.likedNickNames?.find((v) => v === nickName);

  const onClickBack = () => {
    router.back();
  }

  const heart = useMutation({
    mutationFn: () => {
      return authApi.post(`/like/${post.id}`);
    },
    onMutate() {
      const queryCache = queryClient.getQueryCache(); //react query dev tools에서 볼 수 있는 값들
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey); //query key들을 전부 가져온다.
      queryKeys.forEach((queryKey) => {
        if(queryKey[0] === "post" && queryKey[1] === String(post.id)) {
          const value: IPost | undefined = queryClient.getQueryData(queryKey);
          if (value) {
            if(value.id === post.id) {
              const shallow = {
                ...value,
                likedNickNames: [...value.likedNickNames, nickName],
                likeCount: value.likeCount + 1,
              }
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      })
    }
  })

  const unHeart = useMutation({
    mutationFn: () => {
      return authApi.post(`/like/${post.id}`);
    },
    onMutate() {
      const queryCache = queryClient.getQueryCache(); //react query dev tools에서 볼 수 있는 값들
      const queryKeys = queryCache.getAll().map(cache => cache.queryKey); //query key들을 전부 가져온다.
      queryKeys.forEach((queryKey) => {
        if(queryKey[0] === "post" && queryKey[1] === String(post.id)) {
          const value: IPost | undefined = queryClient.getQueryData(queryKey);
          if (value) {
            if(value.id === post.id) {
              const shallow = {
                ...value,
                likedNickNames: value.likedNickNames.filter((v) => v !== nickName),
                likeCount: value.likeCount - 1,
              }
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      })
    }
  })

  const onClickHeart:MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (liked) {
      unHeart.mutate();
    } else if(nickName){
      heart.mutate();
    } else {
      router.push('/login');
    }
  }

  return (
    <>
      <div className={style.header}>
        <button className={style.backButton} onClick={onClickBack}>
          <svg aria-label="돌아가기" width={24} role="img" viewBox="0 0 24 24">
            <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(270 12 12)"></path>
          </svg>
        </button>
        <div className={style.like}>
          <button onClick={onClickHeart}>
            {liked ?
              <svg width={25} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.373 20.8056C14.7475 23.4311 13.2725 26.992 13.2725 30.7051C13.2725 34.4181 14.7475 37.9791 17.373 40.6046L31.5151 54.7467L38.5862 61.8178C39.3672 62.5988 40.6335 62.5988 41.4146 61.8178L48.4857 54.7467L62.6278 40.6046C65.2533 37.9791 66.7283 34.4181 66.7283 30.7051C66.7283 26.992 65.2533 23.4311 62.6278 20.8056C60.0023 18.1801 56.4413 16.7051 52.7283 16.7051C49.0153 16.7051 45.4543 18.1801 42.8288 20.8056L40.6914 22.943C40.3098 23.3246 39.691 23.3246 39.3094 22.943L37.172 20.8056C34.5464 18.1801 30.9855 16.7051 27.2725 16.7051C23.5594 16.7051 19.9985 18.1801 17.373 20.8056Z" fill="#FF0000" />
                <path d="M13.2725 30.7051H10.7725H13.2725ZM17.373 40.6046L19.1407 38.8368L17.373 40.6046ZM31.5151 54.7467L29.7473 56.5145L31.5151 54.7467ZM48.4857 54.7467L46.7179 52.9789L48.4857 54.7467ZM27.2725 16.7051L27.2725 14.2051H27.2725V16.7051ZM38.5862 61.8178L40.3539 60.05L38.5862 61.8178ZM41.4146 61.8178L39.6468 60.05L41.4146 61.8178ZM15.6052 19.0378C12.5108 22.1322 10.7725 26.329 10.7725 30.7051H15.7725C15.7725 27.6551 16.9841 24.73 19.1407 22.5734L15.6052 19.0378ZM10.7725 30.7051C10.7725 35.0812 12.5109 39.278 15.6052 42.3723L19.1407 38.8368C16.9841 36.6801 15.7725 33.7551 15.7725 30.7051H10.7725ZM15.6052 42.3723L29.7473 56.5145L33.2829 52.9789L19.1407 38.8368L15.6052 42.3723ZM29.7473 56.5145L36.8184 63.5855L40.3539 60.05L33.2829 52.9789L29.7473 56.5145ZM43.1824 63.5855L50.2534 56.5145L46.7179 52.9789L39.6468 60.05L43.1824 63.5855ZM50.2534 56.5145L64.3956 42.3723L60.86 38.8368L46.7179 52.9789L50.2534 56.5145ZM64.3956 42.3723C67.4899 39.278 69.2283 35.0812 69.2283 30.7051H64.2283C64.2283 33.7551 63.0167 36.6801 60.86 38.8368L64.3956 42.3723ZM69.2283 30.7051C69.2283 26.329 67.4899 22.1322 64.3956 19.0378L60.86 22.5734C63.0167 24.73 64.2283 27.6551 64.2283 30.7051H69.2283ZM64.3956 19.0378C61.3012 15.9435 57.1044 14.2051 52.7283 14.2051V19.2051C55.7783 19.2051 58.7034 20.4167 60.86 22.5734L64.3956 19.0378ZM52.7283 14.2051C48.3522 14.2051 44.1554 15.9435 41.061 19.0378L44.5966 22.5734C46.7532 20.4167 49.6783 19.2051 52.7283 19.2051V14.2051ZM41.061 19.0378L38.9236 21.1752L42.4592 24.7108L44.5966 22.5734L41.061 19.0378ZM41.0771 21.1752L38.9397 19.0378L35.4042 22.5734L37.5416 24.7108L41.0771 21.1752ZM38.9397 19.0378C35.8454 15.9435 31.6485 14.2051 27.2725 14.2051L27.2725 19.2051C30.3225 19.2051 33.2475 20.4167 35.4042 22.5734L38.9397 19.0378ZM27.2725 14.2051C22.8964 14.2051 18.6996 15.9435 15.6052 19.0378L19.1407 22.5734C21.2974 20.4167 24.2225 19.2051 27.2725 19.2051V14.2051ZM38.9236 21.1752C39.5183 20.5805 40.4825 20.5806 41.0771 21.1752L37.5416 24.7108C38.8995 26.0687 41.1012 26.0687 42.4592 24.7108L38.9236 21.1752ZM36.8184 63.5855C38.5758 65.3429 41.425 65.3429 43.1824 63.5855L39.6468 60.05C39.8421 59.8547 40.1587 59.8547 40.3539 60.05L36.8184 63.5855Z" fill="#FF0000" />
              </svg> :
              <svg width={25} viewBox="0 0 24 24" aria-hidden="true">
                <g>
                  <path
                    d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </g>
              </svg>
            }
          </button>
          <span>{post.likeCount}</span>
        </div>
        <div className={style.seemore}>
          <SeeMore post={post}/>  
        </div> 
      </div>
    </>
  )
}