export interface IMenu {
    name: string
    en: string
    icon?: string
    method: (name?: string) => void
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