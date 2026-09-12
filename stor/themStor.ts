import { stat } from "fs"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface them{
    isDark:boolean,
    Toggle:()=>void
}

export const UseThemStor=create<them>()(
    persist(
        (set)=>({
            isDark:false,
            Toggle:()=>set(
                (state)=>({
                    isDark:!state.isDark
                })
            )
        }),
        {
            name:"them-storage"
        }
    )
)