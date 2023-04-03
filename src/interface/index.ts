export interface IMenu {
    name: string
    en: string
    icon?: string
    method?: (name?: string) => void
    url?: string
}

export interface IMenuItem {
    name: string
    en: string
}

export interface IContents {
    title: string
    author: string
    dynasty: string
}