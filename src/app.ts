import globalCss from "@/styles/global.css"
import { Component, defineComponent } from "master-ts/library/component"
import { css, html } from "master-ts/library/template"
import { PostTimeline } from "./libs/postTimeline"
import { Navigation } from "./navigation"
import { route } from "./route"
import { routerLayout } from "./router"

const appCssSheet = new CSSStyleSheet()
appCssSheet.replace(globalCss)
Component.$globalCSS = [appCssSheet]

const AppComponent = defineComponent("x-app")
function App() {
	const component = new AppComponent()

	component.$html = html`
		<header>${Navigation()}</header>
		<main>
			${() => routerLayout.ref.top && html`<div class="top">${() => routerLayout.ref.top}</div>`}
			<div class="bottom">
				<div class="page">${() => routerLayout.ref.page}</div>
				${() => route.postId.ref && html`<div class="post">${PostTimeline(route.postId.ref)}</div>`}
			</div>
		</main>
	`

	return component
}

AppComponent.$css = css`
	:host {
		display: grid;
		padding-top: var(--span);
	}

	header {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 10;

		display: grid;
		align-items: center;

		pointer-events: none;
		& > * {
			pointer-events: all;
		}
	}

	main {
		display: grid;
		gap: var(--span);
		padding: 0 var(--span);

		& > .bottom {
			position: relative;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
			gap: var(--span);

			& > * {
				overflow: auto;
				padding-bottom: 10vh;

				&.post {
					position: sticky;
					top: 0;
					height: calc(100vh);
				}
			}
		}
	}

	@media (max-width: 1023px) {
		main > .bottom:has(.post) {
			& > .page {
				position: fixed;
				left: -200%;
			}

			& > .post {
				position: static;
				height: auto;
			}
		}
	}
`

document.querySelector("#app")!.replaceWith(App())
