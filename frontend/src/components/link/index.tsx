import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Anchor, type AnchorProps } from "@mantine/core";
import type { RefObject } from "react";

type MantineAnchorProps = Omit<AnchorProps, "href">;

type Props = MantineAnchorProps & {
	ref: RefObject<HTMLAnchorElement>;
};
const MantineLinkComponent = ({ ref, ...props }: Props) => {
	return <Anchor ref={ref} {...props} />;
};

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const Link: LinkComponent<typeof MantineLinkComponent> = (props) => {
	return <CreatedLinkComponent preload="intent" {...props} />;
};
