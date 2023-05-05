import { TheGraphApi } from "@/api/graph"
import { Post } from "@/libs/post"
import { PostForm } from "@/libs/post-form"
import { Timeline } from "@/libs/timeline"
import { routeHref } from "@/router"
import type { PostId } from "@/utils/post-id"
import { $ } from "master-ts/library/$"
import { defineComponent } from "master-ts/library/component"
import type { SignalReadable } from "master-ts/library/signal"
import { css, html } from "master-ts/library/template"

const PostTimelineComponent = defineComponent("x-post-timeline")
export function PostTimeline(postId: SignalReadable<PostId>) {
	const component = new PostTimelineComponent()

	const post = $.await($.derive(() => TheGraphApi.getPosts([postId.ref]).then((posts) => posts[0] ?? null), [postId])).then()
	const repliesTimeline = $.derive(() => TheGraphApi.createTimeline({ parentId: postId.ref }))

	component.$html = html`
		<div class="top">
			<a class="btn" href=${routeHref({ postId: null })}>← Close</a>
			<h2 class="title">Post</h2>
		</div>
		<div class="content">
			<div class="family">
				${$.match(post)
					.case(null, () => null)
					.default((post) => Post(post))}
			</div>
			<div class="replies">
				<h3 class="title">Replies</h3>
				<x ${PostForm(postId)} class="form"></x>
				<x ${Timeline(repliesTimeline)} class="timeline"></x>
			</div>
		</div>
	`

	return component
}

PostTimelineComponent.$css = css`
	:host {
		display: grid;
		gap: calc(var(--span) * 1);
	}

	.top {
		display: grid;
		grid-auto-flow: column;
		justify-content: start;
		align-items: center;
		gap: calc(var(--span) * 0.5);

		& > .title {
			font-weight: bold;
			font-size: 1.5em;
		}
	}

	.content {
		display: grid;
		gap: calc(var(--span) * 1);
	}

	.replies {
		display: grid;

		grid-template-areas:
			"title"
			"."
			"form"
			"."
			"timeline";
		grid-template-rows: auto calc(var(--span) * 0.5) auto calc(var(--span) * 2) auto;

		& > .title {
			grid-area: title;
		}
		& > .form {
			grid-area: form;
		}
		& > .timeline {
			grid-area: timeline;
		}
	}
`
