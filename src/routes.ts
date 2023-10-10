import { homeLayout } from "@/pages/home"
import { searchLayout } from "@/pages/search"
import { unknownLayout } from "@/pages/unknown"
import { userLayout } from "@/pages/user"
import { route } from "@/router"
import { Address } from "@/utils/address"
import { signal, type Signal } from "master-ts/core"

export type Layout = {
	top: HTMLElement | null
	page: HTMLElement
}

export function createLayout<T extends Record<PropertyKey, unknown> = Record<PropertyKey, never>>(
	factory: (params: { [K in keyof T]: Readonly<Signal<T[K]>> }) => Layout
) {
	let cache: Layout | null = null
	let paramSignals: { [K in keyof T]: Signal<T[K]> }
	return (params: T) => {
		if (cache) {
			const entries = Object.entries(paramSignals) as [keyof typeof paramSignals, (typeof paramSignals)[keyof typeof paramSignals]][]
			entries.forEach(([key, signal]) => (signal.ref = params[key]))
		} else {
			cache = factory(
				(paramSignals = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, signal(value)])) as {
					[K in keyof T]: Readonly<Signal<T[K]>>
				})
			)
		}
		return cache
	}
}

export const routerLayout = signal<Layout>(null!, (set) => {
	const follow = route.pathArr.follow(
		(path) => {
			if (path[0] === "") {
				set(homeLayout({}))
			} else if (path[0] === "search") {
				set(searchLayout({ search: path[1] ? decodeURIComponent(path[1]) : "" }))
			} else if (path[0] === "popular") {
				set(searchLayout({ search: "" }))
			} else if (path[0]?.startsWith("0x") && path[0].length === 42) {
				const [address, tab] = path
				const userAddress = Address.from(address)
				switch (tab) {
					case "posts":
					case "replies":
					case "mentions":
						set(userLayout({ userAddress, tab }))
						break
					default:
						set(userLayout({ userAddress, tab: "posts" }))
						break
				}
			} else {
				set(unknownLayout({}))
			}
		},
		{ mode: "immediate" }
	)

	return () => {
		console.log("unsub")
		follow.unfollow()
	}
})
