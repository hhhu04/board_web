import {create} from "zustand";
import {createJSONStorage, persist} from 'zustand/middleware'

// eslint-disable-next-line no-unexpected-multiline
export const UserStore = create(
    persist(
        (set) => ({

            // 로그인 여부
            isLogin : false,
            loginId : '',

            setIsLogin: (state) => set({ isLogin: state }),
            setLoginId: (code) => set({ loginId: code }),
            reset: () => {
                set({
                    isLogin: false,
                    loginId: '',
                });
            },
        }),{
            name: 'userStorage',
            storage: createJSONStorage(() => {
                return sessionStorage;
            }),
        }
    )
)